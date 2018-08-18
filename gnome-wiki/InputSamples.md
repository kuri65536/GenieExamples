Projects/Vala/InputSamples - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
Projects/Vala/InputSamplesHomeRecentChangesScheduleLogin
Vala Input Examples
Reading a Single Line
vala-test:examples/input-stdin-line.vala int main () {
    stdout.printf (&quot;Please enter your name: &quot;);
    string? name = stdin.read_line ();
    if (name != null) {
        stdout.printf (&quot;Hello, %s!\n&quot;, name);
    }
    return 0;
}
Reading From Standard Input (stdin)
vala-test:examples/input-stdin.vala /*
 * We use the fact that char[] allocates space
 * and that FileStream.gets takes a char[] but returns a string!
 *
 * Note that stdin.gets uses the &quot;safe&quot; fgets(), not the unsafe gets()
 */
string read_stdin () {
    var input = new StringBuilder ();
    var buffer = new char[1024];
    while (!stdin.eof ()) {
        string read_chunk = stdin.gets (buffer);
        if (read_chunk != null) {
            input.append (read_chunk);
        }
    }
    return input.str;
}
int main () {
    string name = read_stdin ();
    stdout.printf (&quot;\n-----\n%s\n&quot;, name);
    return 0;
}
$ valac stdin-input.vala
$ ./stdin-input
Using GNU Readline
A comfortable way of handling user input is GNU Readline: vala-test:examples/input-readline.vala void main () {
    while (true) {
        var name = Readline.readline (&quot;Please enter your name: &quot;);
        if (name != null &amp;&amp; name != &quot;&quot;) {
            stdout.printf (&quot;Hello, %s\n&quot;, name);
            Readline.History.add (name);
        } else {
            break;
        }
    }
}
$ valac readline-sample.vala --pkg readline -X -lreadline
$ ./readline-sample
Character Input
vala-test:examples/input-character.vala public static void main (string[] args) {
    int c = 0;
    stdout.printf (&quot;Type something and press enter. Type '0' to quit\n&quot;);
    do {
        c = stdin.getc ();
        if (c &gt; 10) {
            stdout.printf (&quot;%c (%d)\n&quot;, c, c);
        }
    } while (c != '0');
}
$ valac character-input.vala
$ ./character-input
Scanf
Useful for parsing text input into numbers vala-test:examples/input-scanf.vala public static void main() {
    float f;
    double d;
    int i;
    long l;
    stdout.printf(&quot;Enter a float   : &quot;);
    stdin.scanf(&quot;%f&quot;, out f);
    stdout.printf(&quot;Enter a double  : &quot;);
    stdin.scanf(&quot;%lf&quot;, out d);
    stdout.printf(&quot;Enter an integer: &quot;);
    stdin.scanf(&quot;%d&quot;, out i);
    stdout.printf(&quot;Enter a long    : &quot;);
    stdin.scanf(&quot;%ld&quot;, out l);
    stdout.printf(&quot;The numbers you entered\n&quot;);
    stdout.printf(&quot;Float  : %f\n&quot;,f);
    stdout.printf(&quot;Double : %lf\n&quot;,d);
    stdout.printf(&quot;Integer: %d\n&quot;,i);
    stdout.printf(&quot;Long   : %ld\n&quot;,l);
}
See the Wikipedia article on Scanf for more details. There is also a scanf function for strings.  Vala/Examples Projects/Vala/InputSamples  (last edited 2013-11-22 16:48:26 by WilliamJonMcCann)
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
