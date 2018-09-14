/** compile command
 *
 * ```bash
 * valac --pkg gtk+-3.0 gui-test.gs
 * ./gui-test
 * ```
 *
 * this is equivalent to https://wiki.gnome.org/Projects/Genie/GtkGuiTutorial,
 * but these sample can't compile with my ubuntu 18.04 valac.
 * I just fix some symbols by add `Gtk.` namespace.
 */
[indent=4]
init
    Gtk.init (ref args) // Initialise the Gtk library
    var AppWindow = new MainAppWindow() //make an instance of the window
    AppWindow.show_all()
    Gtk.main() //pass control to the GTK main loop which polls for signals/events

class MainAppWindow : Gtk.Window
    init
        title = "My Application Main Window"
        default_height = 200 //set the height of the window
        default_width = 350 //set the width of the window
        window_position = Gtk.WindowPosition.CENTER

        destroy.connect(Gtk.main_quit) //add the Gtk.main_quit to the close 

