# Projects/Vala/WebKitSample - GNOME Wiki!

## Vala WebKit Sample

Requires Vala >= 0.11.0

```genie
// vala-test:examples/webkit-sample.vala
using Gtk;
using WebKit;

public class ValaBrowser : Window {
    private const string TITLE = "Vala Browser";
    private const string HOME_URL = "http://acid3.acidtests.org/";
    private const string DEFAULT_PROTOCOL = "http";
    private Regex protocol_regex;
    private Entry url_bar;
    private WebView web_view;
    private Label status_bar;
    private ToolButton back_button;
    private ToolButton forward_button;
    private ToolButton reload_button;
    public ValaBrowser () {
        this.title = ValaBrowser.TITLE;
        set_default_size (800, 600);
        try {
            this.protocol_regex = new Regex (".*://.*");
        } catch (RegexError e) {
            critical ("%s", e.message);
        }
        create_widgets ();
        connect_signals ();
        this.url_bar.grab_focus ();
    }
    private void create_widgets () {
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
    }
    private void connect_signals () {
        this.destroy.connect (Gtk.main_quit);
        this.url_bar.activate.connect (on_activate);
        this.web_view.title_changed.connect ((source, frame, title) => {
            this.title = "%s - %s".printf (title, ValaBrowser.TITLE);
        });
        this.web_view.load_committed.connect ((source, frame) => {
            this.url_bar.text = frame.get_uri ();
            update_buttons ();
        });
        this.back_button.clicked.connect (this.web_view.go_back);
        this.forward_button.clicked.connect (this.web_view.go_forward);
        this.reload_button.clicked.connect (this.web_view.reload);
    }
    private void update_buttons () {
        this.back_button.sensitive = this.web_view.can_go_back ();
        this.forward_button.sensitive = this.web_view.can_go_forward ();
    }
    private void on_activate () {
        var url = this.url_bar.text;
        if (!this.protocol_regex.match (url)) {
            url = "%s://%s".printf (ValaBrowser.DEFAULT_PROTOCOL, url);
        }
        this.web_view.open (url);
    }
    public void start () {
        show_all ();
        this.web_view.open (ValaBrowser.HOME_URL);
    }
    public static int main (string[] args) {
        Gtk.init (ref args);
        var browser = new ValaBrowser ();
        browser.start ();
        Gtk.main ();
        return 0;
    }
}
```

### Compile and Run
Currently, Vala doesn't come with bindings for WebKitGTK+ 3.0. To compile it
with WebKitGTK+ 1.0, you'll have to also use GTK+ 2.0, like this:

```shell
$ valac --pkg gtk+-2.0 --pkg webkit-1.0 --thread webkit-sample.vala
$ ./webkit-sample
```

If you'd rather use GTK+ 3.0, you can easily create your own .vapi and .deps
files. Follow instructions here. The above

Vala/Examples Projects/Vala/WebKitSample
    (last edited 2013-11-22 16:48:24 by WilliamJonMcCann)
