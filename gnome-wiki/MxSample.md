







Projects/Vala/MxSample - GNOME Wiki!



<!--
var search_hint = "Search";
//-->






























Projects/Vala/MxSampleHomeRecentChangesScheduleLogin








Mx Toolkit
Mx is a widget toolkit based on Clutter originally designed for the Moblin/MeeGo netbook experience, but evolved into an independent project. To compile these examples you have to install Mx 1.x. 
Expander Demo
vala-test:examples/mx-expander-demo.vala using Mx;

int main (string[] args) {
    var init_rc = Clutter.init (ref args);

    if (init_rc != Clutter.InitError.SUCCESS) {
        stderr.printf(&quot;Clutter Init Error %i\n&quot;, init_rc);
        return init_rc;
    }

    var stage = new Clutter.Stage ();
    stage.set_title (&quot;Expander Demo&quot;);
    stage.set_size (640, 480);
    stage.user_resizable = true;

    stage.delete_event.connect (() =&gt; {
        stdout.printf(&quot;Bye!\n&quot;);
        Clutter.main_quit();
        return false;
    });

    var expander = new Mx.Expander ();
    expander.label = &quot;Expander&quot;;
    stage.add_actor (expander);
    expander.set_position (10, 10);

    expander.expand_complete.connect (() =&gt; {
        stdout.printf (&quot;Expand complete (%s)\n&quot;,
                       expander.expanded ? &quot;open&quot; : &quot;closed&quot;);
    });

    var scroll = new Mx.ScrollView ();
    expander.add_actor (scroll);
    scroll.set_size (320, 240);

    var grid = new Mx.Grid ();
    scroll.add_actor (grid);

    for (var i = 1; i &lt;= 50; i++) {
        grid.add_actor (new Mx.Button.with_label (@&quot;Button $i&quot;));
    }

    stage.show ();
    Clutter.main ();

    return 0;
}
$ valac --pkg mx-1.0 mx-expander-demo.vala
$ ./mx-expander-demo 
Widget Factory
vala-test:examples/mx-widget-factory.vala using Mx;

Clutter.Actor create_main_content () {
    var table = new Table ();
    table.column_spacing = 24;
    table.row_spacing = 24;

    /* button */
    var button = new Button.with_label (&quot;Button&quot;);
    table.add_actor_with_properties (button, 0, 0, &quot;y-fill&quot;, false);

    /* entry */
    var entry = new Entry.with_text (&quot;Entry&quot;);
    table.add_actor_with_properties (entry, 0, 1, &quot;y-fill&quot;, false);

    /* combo */
    var combo = new ComboBox ();
    combo.active_text = &quot;Combo Box&quot;;
    combo.append_text (&quot;Hello&quot;);
    combo.append_text (&quot;Dave&quot;);
    table.add_actor_with_properties (combo, 0, 2, &quot;y-fill&quot;, false);

    /* scrollbar */
    var adjustment = new Adjustment.with_values (0, 0, 10, 1, 1, 1);
    var scrollbar = new ScrollBar.with_adjustment (adjustment);
    scrollbar.height = 22.0f;
    table.add_actor_with_properties (scrollbar, 1, 0, &quot;y-fill&quot;, false);

    /* progress bar */
    var progressbar = new ProgressBar ();
    progressbar.progress = 0.7;
    table.add_actor_with_properties (progressbar, 1, 1, &quot;y-fill&quot;, false);

    /* slider */
    var slider = new Slider ();
    table.add_actor_with_properties (slider, 1, 2, &quot;y-fill&quot;, false);

    slider.notify[&quot;value&quot;].connect (() =&gt; {
        progressbar.progress = slider.value;
    });

    /* path bar */
    var pathbar = new PathBar ();
    pathbar.push (&quot;&quot;);
    pathbar.push (&quot;Path&quot;);
    pathbar.push (&quot;Bar&quot;);
    table.add_actor_with_properties (pathbar, 2, 0, &quot;y-fill&quot;, false);

    /* expander */
    var expander = new Expander ();
    table.add_actor_with_properties (expander, 2, 1, &quot;y-fill&quot;, false);
    expander.label = &quot;Expander&quot;;
    expander.add_actor (new Label.with_text (&quot;Hello&quot;));

    /* toggle */
    var toggle = new Toggle ();
    table.add_actor_with_properties (toggle, 2, 2, &quot;y-fill&quot;, false);

    /* toggle button */
    var togglebutton = new Button.with_label (&quot;Toggle&quot;);
    togglebutton.is_toggle = true;
    table.add_actor_with_properties (togglebutton, 3, 0, &quot;y-fill&quot;, false);

    /* check button */
    var checkbutton = new Button ();
    checkbutton.set_style_class (&quot;check-box&quot;);
    checkbutton.is_toggle = true;
    table.add_actor_with_properties (checkbutton, 3, 1, &quot;y-fill&quot;, false, &quot;x-fill&quot;, false);

    /* vertical scroll bar */
    adjustment = new Adjustment.with_values (0, 0, 10, 1, 1, 1);
    scrollbar = new ScrollBar.with_adjustment (adjustment);
    scrollbar.orientation = Orientation.VERTICAL;
    scrollbar.width = 22.0f;
    table.add_actor_with_properties (scrollbar, 0, 3, &quot;row-span&quot;, 3);

    var frame = new Frame ();
    frame.child = table;

    return frame;
}

int main (string [] args) {
    var app = new Mx.Application (ref args, &quot;Widget Factory&quot;, 0);
    var window = app.create_window ();
    window.clutter_stage.set_size (500, 300);

    var toolbar = window.get_toolbar ();
    var hbox = new BoxLayout ();
    toolbar.add_actor (hbox);

    var button = new Button.with_label (&quot;Click me&quot;);
    button.tooltip_text = &quot;Please click this button!&quot;;
    button.clicked.connect (() =&gt; {
        button.label = &quot;Thank you!&quot;;
    });

    var combo = new ComboBox ();
    combo.append_text (&quot;Africa&quot;);
    combo.append_text (&quot;Antarctica&quot;);
    combo.append_text (&quot;Asia&quot;);
    combo.append_text (&quot;Australia&quot;);
    combo.append_text (&quot;Europe&quot;);
    combo.append_text (&quot;North America&quot;);
    combo.append_text (&quot;South America&quot;);
    combo.index = 0;
    combo.notify[&quot;index&quot;].connect (() =&gt; {
        stdout.printf (&quot;Selected continent: %s\n&quot;, combo.active_text);
    });

    hbox.add (button, combo);
    window.child = create_main_content ();

    window.clutter_stage.show ();
    app.run ();

    return 0;
}
$ valac --pkg mx-1.0 mx-widget-factory.vala
$ ./mx-widget-factory  Vala/Examples Projects/Vala/MxSample  (last edited 2013-11-22 16:48:24 by WilliamJonMcCann)











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



