# Projects/Vala/WebKitSample - GNOME Wiki!

## Genie WebKit Sample

Requires Vala >= 0.11.0

```genie
// vala-test:examples/webkit-sample.vala
[indent=4]
uses Gtk
uses WebKit

class GenieBrowser: Window
    const TITLE: string = "Genie Browser"
    const HOME_URL: string = "http://acid3.acidtests.org/"
    const DEFAULT_PROTOCOL: string = "http"
    protocol_regex: Regex
    url_bar: Entry
    web_view: WebView
    status_bar: Label
    back_button: ToolButton
    forward_button: ToolButton
    reload_button: ToolButton

    construct()
        this.title = GenieBrowser.TITLE;
        set_default_size (800, 600);
        try
            this.protocol_regex = new Regex (".*://.*");
        except e: RegexError
            critical ("%s", e.message);
        create_widgets ();
        connect_signals ();
        this.url_bar.grab_focus ();

    def create_widgets()
        var toolbar = new Toolbar ();
        this.back_button = new ToolButton.from_stock (Stock.GO_BACK);
        this.forward_button = new ToolButton.from_stock (Stock.GO_FORWARD);
        this.reload_button = new ToolButton.from_stock (Stock.REFRESH);
        toolbar.add (this.back_button);
        toolbar.add (this.forward_button);
        toolbar.add (this.reload_button);
        this.url_bar = new Entry ();
        this.web_view = new WebView ();
        var scrolled_window = new ScrolledWindow (null, null);
        scrolled_window.set_policy (PolicyType.AUTOMATIC, PolicyType.AUTOMATIC);
        scrolled_window.add (this.web_view);
        this.status_bar = new Label ("Welcome");
        this.status_bar.xalign = 0;
        var vbox = new VBox (false, 0);
        vbox.pack_start (toolbar, false, true, 0);
        vbox.pack_start (this.url_bar, false, true, 0);
        vbox.add (scrolled_window);
        vbox.pack_start (this.status_bar, false, true, 0);
        add (vbox);

    def connect_signals()
        this.destroy.connect (Gtk.main_quit);
        this.url_bar.activate.connect (on_activate);
        this.web_view.title_changed += def(source, frame, title)
            this.title = "%s - %s".printf (title, GenieBrowser.TITLE);
        this.web_view.load_committed += def(source, frame)
            this.url_bar.text = frame.get_uri ();
            update_buttons ();
        this.back_button.clicked.connect (this.web_view.go_back);
        this.forward_button.clicked.connect (this.web_view.go_forward);
        this.reload_button.clicked.connect (this.web_view.reload);

    def update_buttons()
        this.back_button.sensitive = this.web_view.can_go_back ();
        this.forward_button.sensitive = this.web_view.can_go_forward ();

    def on_activate()
        var url = this.url_bar.text;
        if !this.protocol_regex.match(url)
            url = "%s://%s".printf (GenieBrowser.DEFAULT_PROTOCOL, url);
        this.web_view.open (url);

    def start()
        show_all ();
        this.web_view.open (GenieBrowser.HOME_URL);

init  // atic int main (string[] args) {
    Gtk.init (ref args);
    var browser = new GenieBrowser ();
    browser.start ();
    Gtk.main ();
```

### Compile and Run
Currently, Genie doesn't come with bindings for WebKitGTK+ 3.0. To compile it
with WebKitGTK+ 1.0, you'll have to also use GTK+ 2.0, like this:

```shell
$ valac --pkg=gtk+-2.0 --pkg=webkit-1.0 --thread webkit-sample.gs
$ ./webkit-sample
```

If you'd rather use GTK+ 3.0, you can easily create your own .vapi and .deps
files. Follow instructions here. The above

Vala/Examples Projects/Vala/WebKitSample
    (last edited 2013-11-22 16:48:24 by WilliamJonMcCann)
