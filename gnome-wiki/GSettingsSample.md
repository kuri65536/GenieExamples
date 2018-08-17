







Projects/Vala/GSettingsSample - GNOME Wiki!



<!--
var search_hint = "Search";
//-->




























Projects/Vala/GSettingsSampleHomeRecentChangesScheduleLogin








Vala Settings Sample
Requires Vala &gt;= 0.10.0 and GLib/GIO &gt;= 2.26 Create a GSettings schema file for your application settings, with filename extension .gschema.xml, e.g. org.example.my-app.gschema.xml: &lt;schemalist&gt;
  &lt;schema id=&quot;org.example.my-app&quot; path=&quot;/org/example/my-app/&quot; gettext-domain=&quot;my-app&quot;&gt;

    &lt;key name=&quot;greeting&quot; type=&quot;s&quot;&gt;
      &lt;default l10n=&quot;messages&quot;&gt;&quot;Hello, earthlings&quot;&lt;/default&gt;
      &lt;summary&gt;A greeting&lt;/summary&gt;
      &lt;description&gt;
        Greeting of the invading martians
      &lt;/description&gt;
    &lt;/key&gt;

    &lt;key name=&quot;bottles-of-beer&quot; type=&quot;i&quot;&gt;
      &lt;default&gt;99&lt;/default&gt;
      &lt;summary&gt;Bottles of beer&lt;/summary&gt;
      &lt;description&gt;
        Number of bottles of beer on the wall
      &lt;/description&gt;
    &lt;/key&gt;

    &lt;key name=&quot;lighting&quot; type=&quot;b&quot;&gt;
      &lt;default&gt;false&lt;/default&gt;
      &lt;summary&gt;Is the light switched on?&lt;/summary&gt;
      &lt;description&gt;
        State of an imaginary light switch.
      &lt;/description&gt;
    &lt;/key&gt;

  &lt;/schema&gt;
&lt;/schemalist&gt;Install it to a glib-2.0/schemas subdirectory of a XDG_DATA_DIRS directory and recompile all schema files of this directory with glib-compile-schemas: $ cp org.example.my-app.gschema.xml /usr/share/glib-2.0/schemas/
$ glib-compile-schemas /usr/share/glib-2.0/schemas/Compile and run the following demo program: vala-test:examples/gio-settings-demo.vala void main () {
    var settings = new Settings (&quot;org.example.my-app&quot;);

    // Getting keys
    var greeting = settings.get_string (&quot;greeting&quot;);
    var bottles = settings.get_int (&quot;bottles-of-beer&quot;);
    var lighting = settings.get_boolean (&quot;lighting&quot;);

    print (&quot;%s\n&quot;, greeting);
    print (&quot;%d bottles of beer on the wall\n&quot;, bottles);
    print (&quot;Is the light switched on? %s\n&quot;, lighting ? &quot;yes&quot; : &quot;no&quot;);

    // Change notification for any key in the schema
    settings.changed.connect ((key) =&gt; {
        print (&quot;Key '%s' changed\n&quot;, key);
    });

    // Change notification for a single key
    settings.changed[&quot;greeting&quot;].connect (() =&gt; {
        print (&quot;New greeting: %s\n&quot;, settings.get_string (&quot;greeting&quot;));
    });

    // Setting keys
    settings.set_int (&quot;bottles-of-beer&quot;, bottles - 1);
    settings.set_boolean (&quot;lighting&quot;, !lighting);
    settings.set_string (&quot;greeting&quot;, &quot;hello, world&quot;);

    print (&quot;Please start 'dconf-editor' and edit keys in /org/example/my-app/\n&quot;);

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



