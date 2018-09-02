# Projects/Vala/ThreadingSamples - GNOME Wiki!

Contents
- Threading
- Simple Threads with Context
- Simple Threads with Context (GLib 2.32 version)
- Synchronization With Mutex
- Communcation between two threads using async queues


## Threading
Require Vala >= 0.11.0


## Simple Threads with Context
```genie
// vala-test:examples/threading-simple.vala
[indent=4]
class MyThread
    name: string;
    count: int = 0

    construct(name: string)
        this.name = name;

    def thread_func (): void*
        while true
            stdout.printf ("%s: %i\n", this.name, this.count);
            this.count++;
            Thread.usleep (Random.int_range (0, 200000));

init
    if !Thread.supported()
        stderr.printf ("Cannot run without thread support.\n");
        return

    var thread_a_data = new MyThread ("A");
    var thread_b_data = new MyThread ("B");
    try
        // Start two threads
        var thread_a = Thread.create of void*(thread_a_data.thread_func, true)
        var thread_b = Thread.create of void*(thread_b_data.thread_func, true)
        // Wait for threads to finish
        // (this will never happen in our case, but anyway)
        thread_a.join ();
        thread_b.join ();
    except e: ThreadError
        stderr.printf ("%s\n", e.message);
```

```shell
$ valac --thread threads.gs
$ ./threads
```


## Simple Threads with Context (GLib 2.32 version)
```genie
// vala-test:examples/threading-simple.vala
[indent=4]
class MyThread
    name: string
    count: int = 0
    construct(name: string)
        this.name = name;

    def thread_func(): void*
        while true
            stdout.printf ("%s: %i\n", this.name, this.count);
            this.count++;
            Thread.usleep (Random.int_range (0, 200000));

init
    if !Thread.supported()
        stderr.printf ("Cannot run without thread support.\n");
        return

    var thread_a_data = new MyThread ("A");
    var thread_b_data = new MyThread ("B");
    try
        // Start two threads
        /* With error handling */
        var thread_a = new Thread of void*.try(
                "thread_a", thread_a_data.thread_func)
        /* Without error handling (is not using the try/catch) */
        var thread_b = new Thread of void*(
                "thread_b", thread_b_data.thread_func)
        // Wait for threads to finish
        // (this will never happen in our case, but anyway)
        thread_a.join ();
        thread_b.join ();
    except e: Error
        stderr.printf ("%s\n", e.message);
```

```shell
$ valac --thread --target-glib=2.32 threads.gs
$ ./threads
```


## Synchronization With Mutex
This is an implementation of the dining philosophers problem, a classic
multi-process synchronization problem.

```genie
// vala-test:examples/threading-philosophers.vala
[indent=4]
/** Fork pool used by the philosophers */
class Forks
    // initially false, i.e. not used
    fork: array of bool = new array of bool[5]
    cond: Cond = new Cond()
    mutex: Mutex = new Mutex()

    // Try to pick up the forks with the designated numbers
    def pick_up(left: int, right: int)
        mutex.lock ();
        while fork[left] or fork[right]
            cond.wait (mutex);
        fork[left] = true;
        fork[right] = true;
        mutex.unlock ();

    // Lay down the forks with the designated numbers
    def lay_down(left: int, right: int)
        mutex.lock ();
        fork[left] = false;
        fork[right] = false;
        cond.broadcast ();
        mutex.unlock ();

/** A dining philosopher */
class Philosopher
    number: int         // this philosopher's number
    think_delay: int    // how long does this philosopher think?
    eat_delay: int      // how long does this philosopher eat?
    left: int           // left fork number
    right: int          // right fork number
    forks: Forks        // forks used by all philosophers

    construct(number: int, think_delay: int, eat_delay: int, forks: Forks)
        this.number = number;
        this.think_delay = think_delay;
        this.eat_delay = eat_delay;
        this.forks = forks;
        this.left = number == 0 ? 4 : number - 1;
        this.right = (number + 1) % 5;

    def run(): void*
        while true
            Thread.usleep (think_delay);
            forks.pick_up (left, right);
            stdout.printf ("Philosopher %d starts eating...\n", number);
            Thread.usleep (eat_delay);
            forks.lay_down (left, right);
            stdout.printf ("Philosopher %d stops eating...\n", number);

init  // (string[] args) {
    if !Thread.supported()
        error ("Cannot run without thread support.");
    var forks = new Forks ();
    philos: array of Philosopher = {
        new Philosopher (0, 100000, 500000, forks),
        new Philosopher (1, 200000, 400000, forks),
        new Philosopher (2, 300000, 300000, forks),
        new Philosopher (3, 400000, 200000, forks),
        new Philosopher (4, 500000, 100000, forks)
    };
    try
        for philosopher in philos
            var th = Thread.create of void*(philosopher.run, false)
    except e: ThreadError
        error ("%s\n", e.message);
    new MainLoop ().run ();
```

```shell
$ valac --thread philosophers.gs
$ ./philosophers
```


## Communcation between two threads using async queues
In this example data is sent from one thread to another. This is done via GLib's
AsyncQueue. The pop and push functions of AsyncQueue provide built-in locking.

```genie
[indent=4]
class ThreadCommunication
    const NUMBER_OF_MESSAGES: int = 200000
    async_queue: AsyncQueue of DataBox

    construct()
        this.async_queue = new AsyncQueue of DataBox();

    // data object for sending
    class DataBox
        prop readonly number: int
        prop name: string
        construct(number: int, name: string)
            this._number = number;
            this._name = name;

    def writing_func(): void*
        var timer = new Timer ();
        timer.start ();
        var i = 0
        while i < NUMBER_OF_MESSAGES
            // prepare an object to send
            var databox = new DataBox (i, @"some text for value $i");
            // send a message to the queue
            async_queue.push (databox);
            i += 1

        // show time result
        print ("Pushed %d DataBoxes into AsyncQueue in %f s\n", NUMBER_OF_MESSAGES, timer.elapsed ());
        return null;

    def reading_func(): void*
        var timer = new Timer ();
        timer.start ();
        var i = 0
        while i < NUMBER_OF_MESSAGES
            // receive a message from the queue
            var databox = async_queue.pop ();
            // make sure the content is right
            assert (i == databox.number);
            assert (@"some text for value $i" == databox.name);
            // show one of the strings
            if (NUMBER_OF_MESSAGES / 2) == databox.number
                print ("\tNO: %d \tTEXT: %s\n", databox.number, databox.name);
            i += 1

        // show time result
        print ("Popped %d DataBoxes from AsyncQueue in %f s\n", NUMBER_OF_MESSAGES, timer.elapsed ());
        return null;

    def run()
        try
            var thread_a = Thread.create of void*(writing_func, true)
            var thread_b = Thread.create of void*(reading_func, true)
            // Wait until the threads finish
            thread_a.join ();
            thread_b.join ();
        except e: ThreadError
            stderr.printf ("%s\n", e.message);
            return

init
    var thread_comm = new ThreadCommunication ();
    thread_comm.run ();
```

```shell
$ valac --thread async-queue-test.gs
$ ./async-queue-test
```

Vala/Examples Projects/Vala/ThreadingSamples
    (last edited 2013-11-22 16:48:27 by WilliamJonMcCann)
