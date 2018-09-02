# Vala Advanced Example

```genie
/* class derived from GObject */
[indent=4]
class AdvancedSample: Object

    /* automatic property, data field is implicit */
    prop name: string

    /* signal */
    event foo()

    /* creation method */
    construct(name: string)
        this.name = name;

    /* public instance method */
    def run()
        /* assigning anonymous function as signal handler */
        this.foo += def (s)
            stdout.printf ("Lambda expression %s!\n", this.name);

        /* emitting the signal */
        this.foo()

/* application entry point */
init
    for arg in args
        var sample = new AdvancedSample(arg)
        sample.run()
        /* "sample" is freed as block ends */
```

## Compile and Run

```shell
$ valac -o advancedsample AdvancedSample.gs
$ ./advancedsample
```

# Game Classic: Number Guessing

Requires at least Vala 0.7.5 (for stdin.read_line () support)

```genie
[indent=4]
class NumberGuessing
    min: int
    max: int

    construct(min: int, max: int)
        this.min = min;
        this.max = max;

    def start()
        var try_count = 0;
        var number = Random.int_range (min, max);

        stdout.printf ("Welcome to Number Guessing!\n\n");
        stdout.printf ("I have thought up a number between %d and %d\n", min, max);
        stdout.printf ("which you have to guess now. Don't worry, I will\n");
        stdout.printf ("give you some hints.\n\n");

        while (true)
            try_count++;

            stdout.printf ("Try #%d\n", try_count);
            stdout.printf ("Please enter a number between %d and %d: ", min, max);
            var input = int.parse(stdin.read_line())

            if number == input
                stdout.printf ("Congratulations! You win.\n");
                break;
            else
                stdout.printf ("Wrong. The wanted number is %s than %d.\n",
                               number > input ? "greater" : "less", input);

init  // string[] args) {
    var game = new NumberGuessing(1, 100)
    game.start()
```


## Compile and Run

```shell
$ valac number-guessing.gs
$ ./number-guessing
```


