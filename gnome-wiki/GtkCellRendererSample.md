# Projects/Vala/GtkCellRendererSample - GNOME Wiki!
# Vala Gtk+ CellRenderer Sample

```genie
// vala-test:examples/gtk-cell-renderer.vala
[indent=4]
uses Gtk

class MyCellRenderer: CellRenderer
    /* icon property set by the tree column */
    icon: Gdk.Pixbuf

    construct()
        GLib.Object ();

    /* get_size method, always request a 50x50 area */
    def override get_size(widget: Widget, cell_area: Gdk.Rectangle?,
                          out x_offset: int, out y_offset: int,
                          out width: int, out height: int)
        x_offset = 0;
        y_offset = 0;
        width = 50;
        height = 50;

    /* render method */
    def override render(ctx: Cairo.Context, widget: Widget,
                        background_area: Gdk.Rectangle,
                        cell_area: Gdk.Rectangle,
                        flags: CellRendererState)
        Gdk.cairo_rectangle (ctx, background_area);
        if icon != null
            /* draw a pixbuf on a cairo context */
            Gdk.cairo_set_source_pixbuf (ctx, icon,
                                         background_area.x,
                                         background_area.y);
            ctx.fill ();
        else
            print("icon is null...")

def open_image(): Gdk.Pixbuf
    // var fname = "/usr/share/pixmaps/firefox.png"
    // lubuntu 18.04
    var fname = "/usr/share/icons/hicolor/48x48/apps/firefox.png"
    try
        return new Gdk.Pixbuf.from_file(fname)
    except e: Error
        error ("%s", e.message);

init  // (string[] args) {
    Gtk.init (ref args);
    var tv = new TreeView ();
    var tm = new Gtk.ListStore(2, typeof (Gdk.Pixbuf), typeof (string))
    tv.set_model (tm);
    var renderer = new MyCellRenderer ();
    var col = new TreeViewColumn ();
    col.pack_start (renderer, true);
    col.set_title ("1st column");
    col.add_attribute (renderer, "icon", 0);
    ti: TreeIter
    tm.append (out ti);
    tv.append_column (col);
    var pixbuf = open_image ();
    tm.set(ti, 0, pixbuf, 1, "asd", -1)
    col.add_attribute (renderer, "icon", 0);
    var win = new Window ();
    win.set_default_size (400, 100);
    win.destroy.connect (Gtk.main_quit);
    win.add (tv);
    win.show_all ();
    Gtk.main ();
    // TODO(shimoda): return 0; in init()
```

### Compile and Run

```shell
$ valac --pkg=gtk+-3.0 gtk-cell-renderer.gs
$ ./gtk-cell-renderer
```

Vala/Examples Projects/Vala/GtkCellRendererSample
    (last edited 2013-11-22 16:48:32 by WilliamJonMcCann)
