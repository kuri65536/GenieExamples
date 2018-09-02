# Projects/Vala/InputSamples - GNOME Wiki!

# Vala Input Examples

## Reading a Single Line

```genie
// vala-test:examples/input-stdin-line.vala
[indent=4]
init
    stdout.printf ("Please enter your name: ");
    var name = stdin.read_line ();
    if name != null
        stdout.printf ("Hello, %s!\n", name);
    // return 0;
```

```shell
$ valac stdin-input.gs
$ ./stdin-input
```

## Reading From Standard Input (stdin)

```genie
// vala-test:examples/input-stdin.vala
/*
 * We use the fact that char[] allocates space
 * and that FileStream.gets takes a char[] but returns a string!
 *
 * Note that stdin.gets uses the "safe" fgets(), not the unsafe gets()
 */
[indent=4]
def read_stdin(): string
    var input = new StringBuilder ();
    var buffer = new array of char[1024];
    while !stdin.eof()
        var read_chunk = stdin.gets(buffer)
        if read_chunk != null
            input.append (read_chunk);
    return input.str;

init  // () {
    var name = read_stdin()
    stdout.printf ("\n-----\n%s\n", name);
```

```shell
$ valac stdin-input.gs
$ ./stdin-input
```


## Using GNU Readline
A comfortable way of handling user input is GNU Readline:

```genie
// vala-test:examples/input-readline.vala
[indent=4]
uses Readline

init  //  () {
    while true
        var name = Readline.readline ("Please enter your name: ");
        if name != null and name != ""
            stdout.printf ("Hello, %s\n", name);
            Readline.History.add (name);
        else
            break;
```

- prerequiste on Ubuntu 18.04

```
$ apt install libreadline-dev
```

```shell
$ valac readline-sample.gs --pkg=readline -X -lreadline
$ ./readline-sample
```


## Character Input

```genie
// vala-test:examples/input-character.vala
[indent=4]
init  // atic void main (string[] args) {
    var c = 0
    stdout.printf ("Type something and press enter. Type '0' to quit\n");
    do
        c = stdin.getc ();
        if c > 10
            stdout.printf ("%c (%d)\n", c, c);
    while c != '0'
```

```shell
$ valac character-input.gs
$ ./character-input
```


## Scanf
Useful for parsing text input into numbers vala-test:

```genie
// examples/input-scanf.vala
[indent=4]
init  // atic void main() {
    f: float
    d: double
    i: int
    l: long
    stdout.printf("Enter a float   : ");
    stdin.scanf("%f", out f);
    stdout.printf("Enter a double  : ");
    stdin.scanf("%lf", out d);
    stdout.printf("Enter an integer: ");
    stdin.scanf("%d", out i);
    stdout.printf("Enter a long    : ");
    stdin.scanf("%ld", out l);
    stdout.printf("The numbers you entered\n");
    stdout.printf("Float  : %f\n",f);
    stdout.printf("Double : %lf\n",d);
    stdout.printf("Integer: %d\n",i);
    stdout.printf("Long   : %ld\n",l);
```

See the Wikipedia article on Scanf for more details. There is also a scanf
function for strings.

Vala/Examples Projects/Vala/InputSamples
    (last edited 2013-11-22 16:48:26 by WilliamJonMcCann)
