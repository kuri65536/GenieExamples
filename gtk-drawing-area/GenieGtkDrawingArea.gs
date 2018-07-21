/** compile command
 *
 * ```bash
 * valac --pkg gtk+-3.0 genie-gtk-drawing-area.gs
 * ./genie-gtk-drawing-area
 * ```
 *
 * this is equivalent to https://valadoc.org/gtk+-3.0/Gtk.DrawingArea.html
 * but these sample coludn't be got with genie
 *
 * - Genie do not have [anonymous method now](
 *     https://bugzilla.gnome.org/show_bug.cgi?id=746704)
 * - Deprecated `signal +=` sample is [this gist rev:7fdda28e8](
 *     https://gist.github.com/kuri65536/844b89c1825f2c581d4333d5c8b2a3dd/7fdda28e8bff4df326e2f104ad6ee34aa6cb092b)
 */
[indent=4]
init
    Gtk.init (ref args) // Initialise the Gtk library
    var AppWindow = new MainAppWindow() //make an instance of the window
    AppWindow.show_all()
    Gtk.main()  // pass control to the GTK main loop which polls for signals/events


class MainAppWindow : Gtk.Window
    drawing_area: Gtk.DrawingArea

    init
        title = "My Gtk.DrawingArea"
        window_position = Gtk.WindowPosition.CENTER
        destroy.connect(Gtk.main_quit)  // add the Gtk.main_quit to the close
        default_height = 400  // set the height of the window
        default_width = 400  // set the width of the window

        self.drawing_area = new Gtk.DrawingArea()
        self.drawing_area.draw.connect(self.on_draw)
        self.add(self.drawing_area)

    def on_draw(context: Cairo.Context): bool
        // Get necessary data:
        style_context: weak Gtk.StyleContext
        style_context = drawing_area.get_style_context ()
        var height = drawing_area.get_allocated_height()
        var width = drawing_area.get_allocated_width()
        var color = style_context.get_color(0)

        // Draw an arc:
        var xc = width / 2.0
        var yc = height / 2.0
        var radius = int.min (width, height) / 2.0
        var angle1 = 0
        var angle2 = 2 * Math.PI

        context.arc(xc, yc, radius, angle1, angle2)
        Gdk.cairo_set_source_rgba (context, color)
        context.fill()
        return true
