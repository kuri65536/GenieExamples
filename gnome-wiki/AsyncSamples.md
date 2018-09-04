# Projects/Vala/AsyncSamples - GNOME Wiki!

Contents
- Async Method Samples
- GIO Example
- Background thread example
- Generator example
- Async sleep example
- Simple Example
- Async Method Samples

These illustrate the use of async methods in Genie.

The Genie Tutorial has more details on using async methods.
See also [GIO Samples](GIOSamples.md)
which has a couple of examples which use async.


## GIO Example

This illustrates calling async methods from within an async method.

```shell
# Example with GIO asynchronous methods:
# Build with:
$ valac --pkg=gio-2.0 example.gs
```

```genie
[indent=4]
class Holder
    prop loop: MainLoop

    construct(_loop: MainLoop)
        loop = _loop

    def async list_dir()
        var dir = File.new_for_path(Environment.get_home_dir())
        try
            var e = yield dir.enumerate_children_async(
                FileAttribute.STANDARD_NAME, 0, Priority.DEFAULT, null);
            while true
                var files = yield e.next_files_async(
                    10, Priority.DEFAULT, null)
                if files == null
                    break
                for info in files
                    print("%s\n", info.get_name())
        except err: Error
            warning("Error: %s\n", err.message)
        this.on_quit()

    def on_quit()
        loop.quit()


init
    var loop = new MainLoop()
    var hold = new Holder(loop)
    hold.list_dir.begin()
    loop.run()
```

## Background thread example
This illustrates an async method which starts a background thread to do processing, and receives a result back from it when it is complete. It also illustrates catching exceptions from an async method. // Async method to run a slow calculation in a background thread.

```genie
// Build with: valac --pkg=gio-2.0 example.gs
[indent=4]

/*
 * With Vala 0.38+ this should compile without warnings, although you may want
 * to use the valac option `--target-glib 2.44` in your own code for maximum 
 * compatibility with GTask callbacks.
 * With Vala 0.36 use `--target-glib 2.44` or `--target-glib 2.36` to avoid the 
 * GSimpleAsyncResult deprecated warnings
 * With Vala before 0.32 use `--target-glib 2.32` to expose the bindings for the Thread constructors
 * Vala 0.16 is the minimum version required
 */

class AsyncSample2
    __loop: MainLoop
    output: array of double
    callback: SourceFunc

    def async do_calc_in_bg(val: double): double raises ThreadError
        this.callback = do_calc_in_bg.callback
        this.output = new array of double[1]

        // Hold reference to closure to keep it from being freed whilst
        // thread is active.
        // run: ThreadFunc of bool = caller
        new Thread of bool("thread-example", run)

        // Wait for background thread to schedule our callback
        yield
        return output[0]

    def run(): bool
        // Perform a dummy slow calculation.
        // (Insert real-life time-consuming algorithm here.)
        var result = 0.0
        var a = 0.0
        while a < 100000000.0
            result += a
            a += 1.0

        // Pass back result and schedule callback
        output[0] = result
        Idle.add((owned) callback)
        return true

    def start(_loop: MainLoop)
        this.__loop = _loop
        do_calc_in_bg.begin(0.001, callback_finish)

    def callback_finish(obj: Object?, res: AsyncResult)
        try
            var result = do_calc_in_bg.end(res)
            stderr.printf(@"Result: $result\n");
        except e: ThreadError
            var msg = e.message
            stderr.printf(@"Thread error: $msg\n");
        this.__loop.quit();

init
    var loop = new MainLoop()
    var smp = new AsyncSample2()
    smp.start(loop)
    loop.run()
```

```shell
$ valac --pkg=gio-2.0 example.gs
```

## Generator example
This is based on Luca Bruno's Generator.

It illustrates using async methods to emulate a generator style of iterator
coding.

Note that this runs fine without a main loop.

```genie
// Build with: valac --pkg=gio-2.0 example.gs
[indent=4]
class abstract Generator of G
    consumed: bool
    value: unowned G
    callback: SourceFunc

    construct()
        helper.begin ();

    def async helper()
        yield generate ();
        consumed = true;

    def abstract async generate()

    def async feed(value: G)
        this.value = value;
        this.callback = feed.callback;
        yield;

    def next(): bool
        return !consumed;

    def get(): G
        var result = value;
        callback ();
        return result;

    def iterator(): Generator of G
        return this;

class IntGenerator: Generator of int
    def override async generate()
        var i = 0
        while (i < 10)
            if (i % 2 ==0)
                yield feed(i)
            i += 1

init  // (string[] args) {
    var gen = new IntGenerator();

    for item in gen
        stdout.printf(@"Result: $item\n");
```

```shell
$ valac --pkg=gio-2.0 example.gs
```


## Async sleep example
This is a version of the venerable sleep() function which allows the main loop
to continue iterating, and therefore will not block the UI:

```genie
// Build with: valac --pkg=gio-2.0 example.gs
[indent=4]
class AsyncSample4
    loop: MainLoop

    def async nap(interval: uint, priority: int = GLib.Priority.DEFAULT)
        GLib.Timeout.add(interval, nap.callback, priority)
        yield;

    def async do_stuff()
        yield nap(1000)

    def on_quit(obj: Object?, res: AsyncResult)
        loop.quit ();

init  // (string[] args) {
    var loop = new GLib.MainLoop ();
    var smp = new AsyncSample4()
    smp.loop = loop
    smp.do_stuff.begin(smp.on_quit)
    loop.run()
```

```shell
$ valac --pkg=gio-2.0 example.gs
```


## Simple Example

```genie
// Demo class with async function
// Build with: valac --pkg=gio-2.0 example.gs
[indent=4]
class Test.Async: Object
    loop: MainLoop

    def async say(sentence: string): string
        GLib.Idle.add(this.say.callback)
        yield
        return sentence

    def on_quit(obj: Object?, res: AsyncResult)
        var sentence = this.say.end(res);
        print("%s\n", sentence);
        loop.quit();


init  // args[]
    var myasync = new Test.Async()
    var mainloop = new GLib.MainLoop()
    myasync.loop = mainloop
    myasync.say.begin("helloworld", myasync.on_quit)
    mainloop.run()
```

```shell
$ valac --pkg=gio-2.0 example.gs
```

from Vala/Examples Projects/Vala/AsyncSamples
    (last edited 2018-02-24 15:05:58 by AlThomas)

