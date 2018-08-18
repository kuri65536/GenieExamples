# Projects/Vala/Gedit3PluginSample - GNOME Wiki!
# Gedit 3 Plugin Sample

Required bindings are for: Gedit >= 3.0 (gedit.vapi for gedit 3.0+ is
automatically generated from upstream and usually distributed with gedit
development packages) GtkSourceView >= 3.0 (gtksourceview-3.0.vapi is
automatically generated from upstream and distributed with Vala) PeasGtk >=1.0
(libpeas-gtk-1.0.vapi is automatically generated from upstream and distributed
with Vala) ...and Vala >= 0.11

# Source & support files
A Gedit plugin compiled from Vala/Genie source files is composed of just two
files: a library (.so) and the plugin file definition (.plugin). Our example
plugin will be contained in just one Vala soure file, so the directory listing
at the start will be:

$ ls gedit-3-example.plugin
gedit-3-example-plugin.valaIn order to make the example really simple we decided
to implement a very basic function: the plugin will just close an xml tag upon
writing the '>'. Eg. if you write <test> it will add the corresponding </test>
close tag. Source code for the file:

```genie
// gedit-3-example-plugin.vala
[indent=4]
uses GLib

namespace GeditPluginExample
    /*
     * This class will be instantiated and activated for each Gedit View
     */
    public class View: Gedit.ViewActivatable, Peas.ExtensionBase
        construct()
            GLib.Object ();

        view: Gedit.View
             owned get; construct;

        def activate ()
            print ("View: activated\n");
            view.key_release_event.connect (this.on_key_release);

        def deactivate ()
            print ("View: deactivated\n");
            view.key_release_event.disconnect (this.on_key_release);

        def on_key_release(sender: Gtk.Widget sender,
                           event: Gdk.EventKey): bool
            if event.str == ">"
                // Close the tag
                var view = (Gedit.View)sender
                buffer: Gtk.TextBuffer = view.get_buffer ();
                end: Gtk.TextIter
                start: Gtk.TextIter
                buffer.get_iter_at_mark(
                    out end, (Gtk.TextMark)buffer.get_insert())
                if end.backward_char ()
                    start = end;
                    if start.backward_word_start()
                        string tag = "</%s>".printf(
                            buffer.get_text(start, end, false))
                        // add the closing tag
                        buffer.begin_user_action ();
                        buffer.insert_interactive_at_cursor (tag, -1, true);
                        buffer.end_user_action ();
                        // move cursor back
                        buffer.get_iter_at_mark(
                            out end, (Gtk.TextMark)buffer.get_insert())
                        end.backward_chars (tag.length);
                        buffer.place_cursor (end);
            return true;

    /*
     * Plugin config dialog
     */
    public class Config : Peas.ExtensionBase, PeasGtk.Configurable
        construct()
            Object ();

        def create_configure_widget(): Gtk.Widget
            return new Gtk.Label (" Gedit 3.0 Example Vala Plugin ");
```

```
[ModuleInit]
public void peas_register_types (TypeModule module) 
{
    var objmodule = module as Peas.ObjectModule;
    // Register my plugin extension
    objmodule.register_extension_type (typeof (Gedit.ViewActivatable), typeof (GeditPluginExample.View));
    // Register my config dialog
    objmodule.register_extension_type (typeof (PeasGtk.Configurable), typeof (GeditPluginExample.Config));
}
```

Contents of the plugin definition file: gedit-3-example.plugin

```
[Plugin]
Module=gedit-3-example-plugin.so
IAge=2
Name=Vala Example Plugin
Description=A simple Vala Example Plugin
Authors=Andrea Del Signore <sejerpz@tin.it>
Copyright=Copyright © 2011 Andrea Del Signore
Website=http://wiki.gnome.org/Projects/Vala/Gedit3PluginSample
```

### Compiling & Installing

```shell
$ valac \
    --pkg=gtk+-3.0 \
    --pkg=gedit \
    --pkg=libpeas-gtk-1.0 \
    --pkg=gtksourceview-3.0 \
    gedit-3-example-plugin.vala \
    -X --shared \
    -X -fPIC \
    --library libgedit-3-example-plugin \
    --output libgedit-3-example-plugin.so
$ cp libgedit-3-example-plugin.so gedit-3-example.plugin ~/.local/share/gedit/plugins/
```

### Running
Start gedit 3 and enable the plugin from the edit -> preference menu

Vala/Examples Projects/Vala/Gedit3PluginSample
    (last edited 2016-10-07 14:33:53 by AlThomas)
