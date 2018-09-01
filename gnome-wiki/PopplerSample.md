# Projects/Vala/PopplerSample - GNOME Wiki!
## Vala Poppler Sample

```genie
// vala-test:examples/poppler-sample.vala
[indent=4]
/* Using Poppler for PDF rendering in Vala sample code */
uses Cairo
uses Gtk

class PopplerSample: Window
    // To store the document and the current page
    document: Poppler.Document
    context: Context
    image: Image
    width: int = 800
    height: int = 600
    index: int = 0

    // To create an application object with the name of the file to display
    construct(file_name: string)
        try
            this.document = new Poppler.Document.from_file (Filename.to_uri (file_name), "");
        except e: Error
            error ("%s", e.message);
        // Create an image and render first page to image
        var surface = new ImageSurface (Format.ARGB32, this.width, this.height);
        this.context = new Context (surface);
        var pixbuf = new Gdk.Pixbuf (Gdk.Colorspace.RGB, false, 8, this.width, this.height);
        this.image = new Image.from_pixbuf (pixbuf);
        render_page ();
        add (this.image);
        this.key_press_event.connect (on_key_pressed);
        this.destroy.connect (Gtk.main_quit);

    def on_key_pressed (source: Widget, key: Gdk.EventKey): bool
        // If the key pressed was q, quit, else show the next page
        if key.str == "q"
            Gtk.main_quit ();
        // Render the next page, or the first if we were at the last
        this.index++;
        this.index %= this.document.get_n_pages ();
        render_page ();
        return false;

    def render_page()
        // Clear the Cairo surface to white
        this.context.set_source_rgb (255, 255, 255);
        this.context.paint ();
        // Output the PDF page to the Cairo surface,
        // then get a pixbuf, then an image, from this surface
        var pixbuf = this.image.get_pixbuf ();
        var page = this.document.get_page (this.index);
        page.render (this.context);
        pixbuf = Gdk.pixbuf_get_from_surface (this.context.get_target (),
                                              0, 0, this.width, this.height);
        this.image.set_from_pixbuf (pixbuf);

init  //ic static int main (string[] args) {
    if args.length != 2
        stderr.printf ("Usage: %s /full/path/to/some.pdf\n", args[0]);
        return
    Gtk.init (ref args);
    var sample = new PopplerSample (args[1]);
    sample.show_all ();
    Gtk.main ();
```

### Compile and Run

```shell
$ valac --pkg=poppler-glib --pkg=gtk+-3.0 -o popplersample PopplerSample.vala
$ ./popplersample /full/path/to/some.pdf
```

Vala/Examples Projects/Vala/PopplerSample
    (last edited 2013-11-22 16:48:29 by WilliamJonMcCann)
