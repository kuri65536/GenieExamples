# Projects/Vala/AsyncSamples - GNOME Wiki!

Contents
- Async Method Samples
- GIO Example
- Background thread example
- Generator example
- Async sleep example
- Simple Example
- Async Method Samples
- These illustrate the use of async methods in Vala.  The Vala Tutorial has more details on using async methods.  See also GIO Samples which has a couple of examples which use async. 

## GIO Example

This illustrates calling async methods from within an async method.

```shell
# Example with GIO asynchronous methods:
# Build with:
$ valac --pkg=gio-2.0 example.vala
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
// Build with: valac --pkg=gio-2.0 example.vala
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

def async do_calc_in_bg(double val): double throws ThreadError
    SourceFunc callback = do_calc_in_bg.callback;
    double[] output = new double[1];

    // Hold reference to closure to keep it from being freed whilst
    // thread is active.
    ThreadFunc<bool> run = () =>
    new Thread<bool>("thread-example", run);

    // Wait for background thread to schedule our callback
    yield
    return output[0]

def run()
    // Perform a dummy slow calculation.
    // (Insert real-life time-consuming algorithm here.)
    double result = 0
    var a = 0.0
    while a < 100000000.0
        result += val * a
        a += 1.0

    // Pass back result and schedule callback
    output[0] = result
    Idle.add((owned) callback)
    return true

init
    var loop = new MainLoop()
    do_calc_in_bg.begin(0.001, (obj, res) => {
            try {
                double result = do_calc_in_bg.end(res);
                stderr.printf(@"Result: $result\n");
            } catch (ThreadError e) {
                string msg = e.message;
                stderr.printf(@"Thread error: $msg\n");
            }
            loop.quit();
        });
    loop.run();
```

## Generator example
This is based on Luca Bruno's Generator.  It illustrates using async methods to emulate a generator style of iterator coding.  Note that this runs fine without a main loop. // Build with: valac --pkg=gio-2.0 example.vala

```genie
abstract class Generator<G> {
    private bool consumed;
    private unowned G value;
    private SourceFunc callback;

    public Generator () {
        helper.begin ();
    }

    private async void helper () {
        yield generate ();
        consumed = true;
    }

    protected abstract async void generate ();

    protected async void feed (G value) {
        this.value = value;
        this.callback = feed.callback;
        yield;
    }

    public bool next () {
        return !consumed;
    }

    public G get () {
        var result = value;
        callback ();
        return result;
    }

    public Generator<G> iterator () {
        return this;
    }
}

class IntGenerator : Generator<int> {
    protected override async void generate () {
        for (int i=0; i < 10; i++) {
             if (i%2 ==0) yield feed (i);
        }
    }
}

void main(string[] args) {
    var gen = new IntGenerator();

    foreach (var item in gen)
        stdout.printf(@"Result: $item\n");
}
```

## Async sleep example
This is a version of the venerable sleep() function which allows the main loop to continue iterating, and therefore will not block the UI:

```genie
// Build with: valac --pkg=gio-2.0 example.vala

public async void nap (uint interval, int priority = GLib.Priority.DEFAULT) {
  GLib.Timeout.add (interval, () => {
      nap.callback ();
      return false;
    }, priority);
  yield;
}

private async void do_stuff () {
  yield nap (1000);
}

private static int main (string[] args) {
  GLib.MainLoop loop = new GLib.MainLoop ();
  do_stuff.begin ((obj, async_res) => {
      loop.quit ();
    });
  loop.run ();

  return 0;
}
```

## Simple Example

```genie
// Demo class with async function
// Build with: valac --pkg=gio-2.0 example.vala
[indent=4]
class Test.Async: Object
    def async say(sentence: string): string
        GLib.Idle.add(this.say.callback)
        yield
        return sentence

init  // args[]
    var myasync = new Test.Async()
    GLib.MainLoop mainloop = new GLib.MainLoop()
    myasync.say.begin("helloworld",
                      (obj, res) => {
                          string sentence = myasync.say.end(res);
                          print("%s\n", sentence);
                          mainloop.quit();
                      })
    mainloop.run()
    return 0
```

from Vala/Examples Projects/Vala/AsyncSamples
    (last edited 2018-02-24 15:05:58 by AlThomas)

