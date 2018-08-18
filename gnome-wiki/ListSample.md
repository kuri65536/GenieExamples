Projects/Vala/ListSample - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
Projects/Vala/ListSampleHomeRecentChangesScheduleLogin
Vala List Example
This sample uses the List class from GLib.  There is also various container classes in libgee, which are often easier to use or more powerful. See ../GeeSamples vala-test:examples/list.vala int main (string[] args) {
    var list = new List<string> ();
    list.append ("one");
    list.append ("two");
    list.append ("three");
    stdout.printf ("list.length () = %u\n", list.length ());
    // Traditional iteration
    for (int i = 0; i < list.length (); i++) {
        stdout.printf ("%s\n", list.nth_data (i));
    }
    // Comfortable iteration
    foreach (string element in list) {
        stdout.printf ("%s\n", element);
    }
    return 0;
}
Compile and Run
$ valac -o list list.vala
$ ./list Vala/Examples Projects/Vala/ListSample  (last edited 2013-11-22 16:48:25 by WilliamJonMcCann)
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
