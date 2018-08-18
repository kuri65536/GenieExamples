# Projects/Vala/CursesSample - GNOME Wiki!

```genie
// vala-test:examples/curses.vala
using Curses;
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
```

```shell
$ valac --pkg curses -X -lncurses cursesdemo.vala
$ ./cursesdemo Vala/Examples
```

Projects/Vala/CursesSample
    (last edited 2013-11-22 16:48:25 by WilliamJonMcCann)

