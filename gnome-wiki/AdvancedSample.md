# Vala Advanced Example

```
/* class derived from GObject */
public class AdvancedSample : Object {

    /* automatic property, data field is implicit */
    public string name { get; set; }

    /* signal */
    public signal void foo ();

    /* creation method */
    public AdvancedSample (string name) {
        this.name = name;
    }

    /* public instance method */
    public void run () {
        /* assigning anonymous function as signal handler */
        this.foo.connect ((s) => {
            stdout.printf ("Lambda expression %s!\n", this.name);
        });

        /* emitting the signal */
        this.foo ();
    }

    /* application entry point */
    public static int main (string[] args) {
        foreach (string arg in args) {
            var sample = new AdvancedSample (arg);
            sample.run ();
            /* "sample" is freed as block ends */
        }
        return 0;
    }
}
```

## Compile and Run

```
$ valac -o advancedsample AdvancedSample.vala
$ ./advancedsample
```

# Game Classic: Number Guessing

Requires at least Vala 0.7.5 (for stdin.read_line () support)

```
public class NumberGuessing {

    private int min;
    private int max;

    public NumberGuessing (int min, int max) {
        this.min = min;
        this.max = max;
    }

    public void start () {
        int try_count = 0;
        int number = Random.int_range (min, max);

        stdout.printf ("Welcome to Number Guessing!\n\n");
        stdout.printf ("I have thought up a number between %d and %d\n", min, max);
        stdout.printf ("which you have to guess now. Don't worry, I will\n");
        stdout.printf ("give you some hints.\n\n");

        while (true) {
            try_count++;

            stdout.printf ("Try #%d\n", try_count);
            stdout.printf ("Please enter a number between %d and %d: ", min, max);
            int input = int.parse (stdin.read_line ());

            if (number == input) {
                stdout.printf ("Congratulations! You win.\n");
                break;
            } else {
                stdout.printf ("Wrong. The wanted number is %s than %d.\n",
                               number > input ? "greater" : "less", input);
            }
        }
    }

    public static int main (string[] args) {
        var game = new NumberGuessing (1, 100);
        game.start ();
        return 0;
    }
}
```


## Compile and Run

```
$ valac number-guessing.vala
$ ./number-guessing
```


