







Projects/Vala/Gedit3PluginSample - GNOME Wiki!



<!--
var search_hint = "Search";
//-->




























Projects/Vala/Gedit3PluginSampleHomeRecentChangesScheduleLogin








Gedit 3 Plugin Sample
Required bindings are for: Gedit &gt;= 3.0 (gedit.vapi for gedit 3.0+ is automatically generated from upstream and usually distributed with gedit development packages) GtkSourceView &gt;= 3.0 (gtksourceview-3.0.vapi is automatically generated from upstream and distributed with Vala) PeasGtk &gt;=1.0 (libpeas-gtk-1.0.vapi is automatically generated from upstream and distributed with Vala) ...and Vala &gt;= 0.11 
Source &amp; support files
A Gedit plugin compiled from Vala/Genie source files is composed of just two files: a library (.so) and the plugin file definition (.plugin). Our example plugin will be contained in just one Vala soure file, so the directory listing at the start will be: $ ls
gedit-3-example.plugin
gedit-3-example-plugin.valaIn order to make the example really simple we decided to implement a very basic function: the plugin will just close an xml tag upon writing the '&gt;'. Eg. if you write &lt;test&gt; it will add the corresponding &lt;/test&gt; close tag. Source code for the file: gedit-3-example-plugin.vala using GLib;

namespace GeditPluginExample
{
        /*
         * This class will be instantiated and activated for each Gedit View
         */
        public class View : Gedit.ViewActivatable, Peas.ExtensionBase
        {
                public View ()
                {
                        GLib.Object ();
                }

                public Gedit.View view {
                         owned get; construct;
                }
                public void activate ()
                {
                        print (&quot;View: activated\n&quot;);
                        view.key_release_event.connect (this.on_key_release);
                }
                public void deactivate ()
                {
                        print (&quot;View: deactivated\n&quot;);
                        view.key_release_event.disconnect (this.on_key_release);
                }
                private bool on_key_release (Gtk.Widget sender, Gdk.EventKey event)
                {
                        if (event.str == &quot;&gt;&quot;) {
                                // Close the tag
                                Gedit.View view = (Gedit.View)sender;
                                Gtk.TextBuffer buffer = view.get_buffer ();
                                Gtk.TextIter end, start;

                                buffer.get_iter_at_mark (out end, (Gtk.TextMark) buffer.get_insert ());
                                if (end.backward_char ()) {
                                        start = end;
                                        if (start.backward_word_start ()) {
                                                string tag = &quot;&lt;/%s&gt;&quot;.printf (buffer.get_text (start, end, false));

                                                // add the closing tag
                                                buffer.begin_user_action ();
                                                buffer.insert_interactive_at_cursor (tag, -1, true);
                                                buffer.end_user_action ();

                                                // move cursor back
                                                buffer.get_iter_at_mark (out end, (Gtk.TextMark) buffer.get_insert ());
                                                end.backward_chars (tag.length);
                                                buffer.place_cursor (end);
                                        }
                                }
                        }
                        return true;
                }
        }

        /*
         * Plugin config dialog
         */
        public class Config : Peas.ExtensionBase, PeasGtk.Configurable
        {
                public Config () 
                {
                        Object ();
                }

                public Gtk.Widget create_configure_widget () 
                {
                        return new Gtk.Label (&quot; Gedit 3.0 Example Vala Plugin &quot;);
                }
        }
}

[ModuleInit]
public void peas_register_types (TypeModule module) 
{
        var objmodule = module as Peas.ObjectModule;

        // Register my plugin extension
        objmodule.register_extension_type (typeof (Gedit.ViewActivatable), typeof (GeditPluginExample.View));
        // Register my config dialog
        objmodule.register_extension_type (typeof (PeasGtk.Configurable), typeof (GeditPluginExample.Config));
}
Contents of the plugin definition file: gedit-3-example.plugin [Plugin]
Module=gedit-3-example-plugin.so
IAge=2
Name=Vala Example Plugin
Description=A simple Vala Example Plugin
Authors=Andrea Del Signore &lt;sejerpz@tin.it&gt;
Copyright=Copyright © 2011 Andrea Del Signore
Website=http://wiki.gnome.org/Projects/Vala/Gedit3PluginSample
Compiling &amp; Installing
$ valac \
    --pkg gtk+-3.0 \
    --pkg gedit \
    --pkg libpeas-gtk-1.0 \
    --pkg gtksourceview-3.0 \
    gedit-3-example-plugin.vala \
    -X --shared \
    -X -fPIC \
    --library libgedit-3-example-plugin \
    --output libgedit-3-example-plugin.so
$ cp libgedit-3-example-plugin.so gedit-3-example.plugin ~/.local/share/gedit/plugins/
Running
Start gedit 3 and enable the plugin from the edit -&gt; preference menu  Vala/Examples Projects/Vala/Gedit3PluginSample  (last edited 2016-10-07 14:33:53 by AlThomas)











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



