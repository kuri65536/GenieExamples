/** compile command
 *
 * ```bash
 * valac --pkg gtk+-3.0 genie-gtk-drawing-area.gs
 * ./gui-test
 * ```
 *
 * this is equivalent to https://valadoc.org/gtk+-3.0/Gtk.DrawingArea.html
 * but these sample coludn't be got with genie
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

        drawing_area = new Gtk.DrawingArea()
        drawing_area.draw += def (context)
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
        self.add(drawing_area)
