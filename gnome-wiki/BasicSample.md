







Projects/Vala/BasicSample - GNOME Wiki!



<!--
var search_hint = "Search";
//-->




























Projects/Vala/BasicSampleHomeRecentChangesScheduleLogin








Basic Vala Samples

Hello World
A very simple Hello World program: void main () {
    print (&quot;hello, world\n&quot;);
}

Compile and Run
$ valac hello.vala
$ ./helloIf the binary should have a different name: $ valac hello.vala -o greeting
$ ./greeting
Reading User Input
void main () {
    stdout.printf (&quot;Please enter your name: &quot;);
    string name = stdin.read_line ();
    if (name != null) {
        stdout.printf (&quot;Hello, %s!\n&quot;, name);
    }
}
Vala provides the objects stdin (standard input), stdout (standard output) and stderr (standard error) for the three standard streams. The printf method takes a format string and a variable number of arguments as parameters. 
Mathematics
Math functions are inside the Math namespace. void main () {

    stdout.printf (&quot;Please enter the radius of a circle: &quot;);
    double radius = double.parse (stdin.read_line ());
    stdout.printf (&quot;Circumference: %g\n&quot;, 2 * Math.PI * radius);

    stdout.printf (&quot;sin(pi/2) = %g\n&quot;, Math.sin (Math.PI / 2));

    // Random numbers

    stdout.printf (&quot;Today's lottery results:&quot;);
    for (int i = 0; i &lt; 6; i++) {
        stdout.printf (&quot; %d&quot;, Random.int_range (1, 49));
    }
    stdout.printf (&quot;\n&quot;);

    stdout.printf (&quot;Random number between 0 and 1: %g\n&quot;, Random.next_double ());
}

Command-Line Arguments and Exit Code
int main (string[] args) {

    // Output the number of arguments
    stdout.printf (&quot;%d command line argument(s):\n&quot;, args.length);

    // Enumerate all command line arguments
    foreach (string arg in args) {
        stdout.printf (&quot;%s\n&quot;, arg);
    }

    // Exit code (0: success, 1: failure)
    return 0;
}
The first command line argument (args[0]) is always the invocation of the program itself. 
Reading and Writing Text File Content
This is very basic text file handling. For advanced I/O you should use GIO's powerful stream classes. void main () {
    try {
        string filename = &quot;data.txt&quot;;

        // Writing
        string content = &quot;hello, world&quot;;
        FileUtils.set_contents (filename, content);

        // Reading
        string read;
        FileUtils.get_contents (filename, out read);

        stdout.printf (&quot;The content of file '%s' is:\n%s\n&quot;, filename, read);
    } catch (FileError e) {
        stderr.printf (&quot;%s\n&quot;, e.message);
    }
}

Spawning Processes
void main () {
    try {
        // Non-blocking
        Process.spawn_command_line_async (&quot;ls&quot;);

        // Blocking (waits for the process to finish)
        Process.spawn_command_line_sync (&quot;ls&quot;);

        // Blocking with output
        string standard_output, standard_error;
        int exit_status;
        Process.spawn_command_line_sync (&quot;ls&quot;, out standard_output,
                                               out standard_error,
                                               out exit_status);
    } catch (SpawnError e) {
        stderr.printf (&quot;%s\n&quot;, e.message);
    }
}

First Class
/* class derived from GObject */
public class BasicSample : Object {

    /* public instance method */
    public void run () {
        stdout.printf (&quot;Hello World\n&quot;);
    }
}

/* application entry point */
int main (string[] args) {
    // instantiate this class, assigning the instance to
    // a type-inferred variable
    var sample = new BasicSample ();
    // call the run method
    sample.run ();
    // return from this main method
    return 0;
}
The entry point may as well be inside the class, if you prefer it this way: public class BasicSample : Object {

    public void run () {
        stdout.printf (&quot;Hello World\n&quot;);
    }

    static int main (string[] args) {
        var sample = new BasicSample ();
        sample.run ();
        return 0;
    }
}
In this case main must be declared static.  Vala/Examples Projects/Vala/BasicSample  (last edited 2013-11-22 16:48:31 by WilliamJonMcCann)











Search:
<input id="searchinput" type="text" name="value" value="" size="20"
    onfocus="searchFocus(this)" onblur="searchBlur(this)"
    onkeyup="searchChange(this)" onchange="searchChange(this)" alt="Search">
<input id="titlesearch" name="titlesearch" type="submit"
    value="Titles" alt="Search Titles">
<input id="fullsearch" name="fullsearch" type="submit"
    value="Text" alt="Search Full Text">



<!--// Initialize search form
var f = document.getElementById('searchform');
f.getElementsByTagName('label')[0].style.display = 'none';
var e = document.getElementById('searchinput');
searchChange(e);
searchBlur(e);
//-->



        Copyright &copy; 2005 -  The GNOME Project.
        Hosted by Red Hat.

  document.getElementById('current-year').innerHTML = new Date().getFullYear();



