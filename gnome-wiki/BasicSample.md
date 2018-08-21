# Projects/Vala/BasicSample - GNOME Wiki!

# Basic Genie Samples

## Hello World

A very simple Hello World program:

```genie
[indent=4]
init
    print("hello, world\n")
```

Compile and Run

```shell
$ valac hello.vala
$ ./helloIf
# the binary should have a different name:
$ valac hello.vala -o greeting
$ ./greeting
```

## Reading User Input

```genie
[indent=4]
init
    stdout.printf("Please enter your name: ")
    var name = stdin.read_line()
    if name != null
        stdout.printf("Hello, %s!\n", name)
```

Vala provides the objects stdin (standard input),
stdout (standard output) and stderr (standard error)
for the three standard streams.

The printf method takes a format string and
a variable number of arguments as parameters.


## Mathematics
Math functions are inside the Math namespace.

```genie
[indent=4]
init
    stdout.printf("Please enter the radius of a circle: ")
    var radius = double.parse(stdin.read_line())
    stdout.printf("Circumference: %g\n", 2 * Math.PI * radius)

    stdout.printf("sin(pi/2) = %g\n", Math.sin (Math.PI / 2))

    // Random numbers
    stdout.printf("Today's lottery results:")
    var i = 0
    while i < 6
        stdout.printf(" %d", Random.int_range(1, 49))
        i += 1
    stdout.printf("\n")

    stdout.printf("Random number between 0 and 1: %g\n", Random.next_double())
```

## Command-Line Arguments and Exit Code

```genie
[indent=4]
init
    // Output the number of arguments
    stdout.printf("%d command line argument(s):\n", args.length)

    // Enumerate all command line arguments
    for arg in args
        stdout.printf("%s\n", arg)

    // TODO(shimoda): find to implement to this in genie
    // Exit code (0: success, 1: failure)
    // return 0;
```

The first command line argument (args[0]) is always
the invocation of the program itself.


## Reading and Writing Text File Content
This is very basic text file handling.
For advanced I/O you should use GIO's powerful stream classes.

```genie
[indent=4]
init
    try
        var filename = "data.txt"

        // Writing
        var content = "hello, world"
        FileUtils.set_contents(filename, content)

        // Reading
        read: string
        FileUtils.get_contents(filename, out read)

        stdout.printf("The content of file '%s' is:\n%s\n", filename, read)
    except e: FileError
        stderr.printf("%s\n", e.message)
```

## Spawning Processes

```genie
[indent=4]
init
    try
        // Non-blocking
        Process.spawn_command_line_async("ls")

        // Blocking (waits for the process to finish)
        Process.spawn_command_line_sync("ls")

        // Blocking with output
        standard_output: string
        standard_error: string
        exit_status: int
        Process.spawn_command_line_sync("ls", out standard_output,
                                              out standard_error,
                                              out exit_status)
    except e: SpawnError
        stderr.printf("%s\n", e.message)
```


## First Class

```genie
[indent=4]
/* class derived from GObject */
class BasicSample: Object

    /* public instance method */
    def run()
        stdout.printf("Hello World\n")

/* application entry point */
init
    // instantiate this class, assigning the instance to
    // a type-inferred variable
    var sample = new BasicSample()
    // call the run method
    sample.run()
    // TODO(shimoda): return from this main method
    // return 0;
```

The entry point may as well be inside the class, if you prefer it this way:

```genie
[indent=4]
class BasicSample: Object
    def run()
        stdout.printf("Hello World\n")

    init
        var sample = new BasicSample()
        sample.run()
        // TODO(shimoda): return 0
```

_In this case main must be declared static._

### Note in genie
- init can't handle command line arguments (vala can this feature)


Vala/Examples Projects/Vala/BasicSample
    (last edited 2013-11-22 16:48:31 by WilliamJonMcCann)

