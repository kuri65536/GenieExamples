# Projects/Vala/GSettingsSample - GNOME Wiki!
# Vala Settings Sample

Requires Vala >= 0.10.0 and GLib/GIO >= 2.26 Create a GSettings schema file for your application settings, with filename extension .gschema.xml, e.g. org.example.my-app.gschema.xml: <schemalist>
  <schema id="org.example.my-app" path="/org/example/my-app/" gettext-domain="my-app">
    <key name="greeting" type="s">
      <default l10n="messages">"Hello, earthlings"</default>
      <summary>A greeting</summary>
      <description>
        Greeting of the invading martians
      </description>
    </key>
    <key name="bottles-of-beer" type="i">
      <default>99</default>
      <summary>Bottles of beer</summary>
      <description>
        Number of bottles of beer on the wall
      </description>
    </key>
    <key name="lighting" type="b">
      <default>false</default>
      <summary>Is the light switched on?</summary>
      <description>
        State of an imaginary light switch.
      </description>
    </key>
  </schema>
</schemalist>Install it to a glib-2.0/schemas subdirectory of a XDG_DATA_DIRS directory and recompile all schema files of this directory with glib-compile-schemas: $ cp org.example.my-app.gschema.xml /usr/share/glib-2.0/schemas/
$ glib-compile-schemas /usr/share/glib-2.0/schemas/Compile and run the following demo program: vala-test:examples/gio-settings-demo.vala void main () {
    var settings = new Settings ("org.example.my-app");
    // Getting keys
    var greeting = settings.get_string ("greeting");
    var bottles = settings.get_int ("bottles-of-beer");
    var lighting = settings.get_boolean ("lighting");
    print ("%s\n", greeting);
    print ("%d bottles of beer on the wall\n", bottles);
    print ("Is the light switched on? %s\n", lighting ? "yes" : "no");
    // Change notification for any key in the schema
    settings.changed.connect ((key) => {
        print ("Key '%s' changed\n", key);
    });
    // Change notification for a single key
    settings.changed["greeting"].connect (() => {
        print ("New greeting: %s\n", settings.get_string ("greeting"));
    });
    // Setting keys
    settings.set_int ("bottles-of-beer", bottles - 1);
    settings.set_boolean ("lighting", !lighting);
    settings.set_string ("greeting", "hello, world");
    print ("Please start 'dconf-editor' and edit keys in /org/example/my-app/\n");
    new MainLoop ().run ();
}
Compile and Run
$ valac --pkg gio-2.0 gio-settings-demo.vala
$ ./gio-settings-demoStart dconf-editor and edit some keys in /org/example/my-app/. On some systems you have to install dconf-editor first, e.g. the dconf-tools package on Debian based distributions.  Vala/Examples Projects/Vala/GSettingsSample  (last edited 2013-11-22 16:48:26 by WilliamJonMcCann)
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
