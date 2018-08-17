







Projects/Vala/GeeSamples - GNOME Wiki!



<!--
var search_hint = "Search";
//-->




























Projects/Vala/GeeSamplesHomeRecentChangesScheduleLogin







Contents
List Example
Set Example
Map Example
Syntactic Sugar
Customizing the equality function
Implementing your own Iterable Vala Home Vala Collections: libgeeYou should install the Vala collection library, libgee, from your distribution. More information about libgee is available from https://wiki.gnome.org/Projects/Libgee Gee API Documentation 
List Example
vala-test:examples/gee-list.vala using Gee;

void main () {
    var list = new ArrayList&lt;int&gt; ();
    list.add (1);
    list.add (2);
    list.add (5);
    list.add (4);
    list.insert (2, 3);
    list.remove_at (3);
    foreach (int i in list) {
        stdout.printf (&quot;%d\n&quot;, i);
    }
    list[2] = 10;                       // same as list.set (2, 10)
    stdout.printf (&quot;%d\n&quot;, list[2]);    // same as list.get (2)
}

Compile and Run
$ valac --pkg gee-0.8 gee-list.vala
$ ./gee-listYou can use any type fitting into the size of a pointer (e.g. int, bool, reference types) directly as generic type argument: &lt;bool&gt;, &lt;int&gt;, &lt;string&gt;, &lt;MyObject&gt;. Other types must be &quot;boxed&quot; by appending a question mark: &lt;float?&gt;, &lt;double?&gt;, &lt;MyStruct?&gt;.  The compiler will tell you this if necessary. 
Set Example
Sets are unordered and do not contain duplicate elements. vala-test:examples/gee-set.vala using Gee;

void main () {
    var my_set = new HashSet&lt;string&gt; ();
    my_set.add (&quot;one&quot;);
    my_set.add (&quot;two&quot;);
    my_set.add (&quot;three&quot;);
    my_set.add (&quot;two&quot;);         // will not be added because it's a duplicate
    foreach (string s in my_set) {
        stdout.printf (&quot;%s\n&quot;, s);
    }
}

Compile and Run
$ valac --pkg gee-0.8 gee-set.vala
$ ./gee-set
Map Example
Maps work like a dictionary. They store key - value pairs. vala-test:examples/gee-map.vala using Gee;

void main () {

    var map = new HashMap&lt;string, int&gt; ();

    // Setting values
    map.set (&quot;one&quot;, 1);
    map.set (&quot;two&quot;, 2);
    map.set (&quot;three&quot;, 3);
    map[&quot;four&quot;] = 4;            // same as map.set (&quot;four&quot;, 4)
    map[&quot;five&quot;] = 5;

    // Getting values
    int a = map.get (&quot;four&quot;);
    int b = map[&quot;four&quot;];        // same as map.get (&quot;four&quot;)
    assert (a == b);

    // Iteration

    stdout.printf (&quot;Iterating over entries\n&quot;);
    foreach (var entry in map.entries) {
        stdout.printf (&quot;%s =&gt; %d\n&quot;, entry.key, entry.value);
    }

    stdout.printf (&quot;Iterating over keys only\n&quot;);
    foreach (string key in map.keys) {
        stdout.printf (&quot;%s\n&quot;, key);
    }

    stdout.printf (&quot;Iterating over values only\n&quot;);
    foreach (int value in map.values) {
        stdout.printf (&quot;%d\n&quot;, value);
    }

    stdout.printf (&quot;Iterating via 'for' statement\n&quot;);
    var it = map.map_iterator ();
    for (var has_next = it.next (); has_next; has_next = it.next ()) {
        stdout.printf (&quot;%d\n&quot;, it.get_value ());
    }
}

Compile and Run
$ valac --pkg gee-0.8 gee-map.vala
$ ./gee-map
Syntactic Sugar
There's syntactic sugar for testing if a collection contains an element: if (&quot;three&quot; in my_set) {    // same as my_set.contains (&quot;three&quot;)
    stdout.printf (&quot;heureka\n&quot;);
}

Customizing the equality function
bool same_book (Book a, Book b) {
    return a.isbn == b.isbn;
}
// ...
var books = new Gee.ArrayList&lt;Book&gt; ((EqualFunc) same_book);

Implementing your own Iterable
You will have to implement two interfaces: Iterable with an iterator () method and an element_type property as well as an Iterator. vala-test:examples/gee-iterable.vala using Gee;

class RangeIterator : Object, Iterator&lt;int&gt; {

    private Range range;
    private int current;

    public RangeIterator (Range range) {
        this.range = range;
        this.current = range.from - 1;
    }

    public bool next () {
        if (!has_next ()) {
            return false;
        }
        this.current++;
        return true;
    }

    public bool has_next () {
        return this.current &lt; this.range.to;
    }

    public bool first () {
        this.current = range.from;
        return true;
    }

    /* Here the 'new' keyword is used because Object already
       has a 'get' method. This will hide the original method.
       Otherwise you'll get a warning. */
    public new int get () {
        return this.current;
    }

    public void remove () {
        assert_not_reached ();
    }
}

public class Range : Object, Iterable&lt;int&gt; {

    public int from { get; private set; }
    public int to { get; private set; }

    public Range (int from, int to) {
        assert (from &lt; to);
        this.from = from;
        this.to = to;
    }

    public Type element_type {
        get { return typeof (int); }
    }

    public Iterator&lt;int&gt; iterator () {
        return new RangeIterator (this);
    }
}

void main () {
    foreach (int i in new Range (10, 20)) {
        stdout.printf (&quot;%d\n&quot;, i);
    }
}

Compile and Run
$ valac --pkg gee-0.8 iterable.vala
$ ./iterableYou could even add an each () method for Ruby or Groovy style iteration. public class Range : Object, Iterable&lt;int&gt; {

    // ... (as above)

    public delegate void RangeEachFunc (int i);

    public void each (RangeEachFunc each_func) {
        foreach (int i in this) {
            each_func (i);
        }
    }
}

void main () {
    // Pass an anonymous function as parameter
    new Range (10, 20).each ((i) =&gt; {
        stdout.printf (&quot;%d\n&quot;, i);
    });
}
 Vala/Examples Projects/Vala/GeeSamples  (last edited 2016-08-09 15:55:57 by AlThomas)











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



