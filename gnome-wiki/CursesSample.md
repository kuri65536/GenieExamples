







Projects/Vala/CursesSample - GNOME Wiki!



<!--
var search_hint = "Search";
//-->




























Projects/Vala/CursesSampleHomeRecentChangesScheduleLogin







vala-test:examples/curses.vala using Curses;

int main (string[] args) {
    /* Initialize Curses */
    initscr ();

    /* Initialize color mode and define a color pair */
    start_color ();
    init_pair (1, Color.GREEN, Color.RED);

    /* Create a window (height/lines, width/columns, y, x) */
    var win = new Window (LINES - 8, COLS - 8, 4, 4);
    win.bkgdset (COLOR_PAIR (1) | Attribute.BOLD);  // set background
    win.addstr (&quot;Hello world!&quot;);   // write string
    win.clrtobot ();               // clear to bottom (does not move cursor)
    win.getch ();                  // read a character

    /* Reset the terminal mode */
    endwin ();

    return 0;
}
$ valac --pkg curses -X -lncurses cursesdemo.vala
$ ./cursesdemo Vala/Examples Projects/Vala/CursesSample  (last edited 2013-11-22 16:48:25 by WilliamJonMcCann)











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



