Projects/Vala/LoudmouthSample - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
Projects/Vala/LoudmouthSampleHomeRecentChangesScheduleLogin
Loudmouth Synchronous Sample
vala-test:examples/lm-send-sync.vala /*
 * Copyright (C) 2004 Imendio AB
 * Copyright (C) 2009 Harley Laue &lt;losinggeneration@gmail.com&gt;
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Library General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Library General Public License for more details.
 *
 * You should have received a copy of the GNU Library General Public
 * License along with this library; if not, write to the
 * Free Software Foundation, Inc., 59 Temple Place - Suite 330,
 * Boston, MA 02111-1307, USA.
 */
/*
 * Description:
 * A little program that let you send jabber messages to another person.
 * Note: The synchronous API is being removed in the 2.0 branch of Loudmouth.
 *
 * Build instructions:
 * valac --pkg loudmouth-1.0 lm-send-sync.vala
 */
using Lm;
class LmSyncDemo {
    static string server = null;
    static string message = null;
    static string username = null;
    static string password = null;
    static string recipient = null;
    static string resource;
    static uint port;
    const OptionEntry[] options = {
            { &quot;server&quot;, 's', 0, OptionArg.STRING, ref server, &quot;Server to connect to. You need to have a valid login on that server.&quot;, &quot;server.org&quot; },
            { &quot;username&quot;, 'u', 0, OptionArg.STRING, ref username, &quot;Username to used for the server you selected.&quot;, &quot;some_username&quot; },
            { &quot;password&quot;, 'p', 0, OptionArg.STRING, ref password, &quot;Password to use for entered username.&quot;, &quot;some_password&quot; },
            { &quot;recipient&quot;,'t', 0, OptionArg.STRING, ref recipient, &quot;User to send message to.&quot;, &quot;someone@server.org&quot; },
            { &quot;message&quot;, 'm', 0, OptionArg.STRING, ref message, &quot;Message to send to recipient.&quot;, &quot;\&quot;some message to send\&quot;&quot; },
            { &quot;resource&quot;, 'r', OptionFlags.OPTIONAL_ARG, OptionArg.STRING, ref resource, &quot;Resource to use when connecting.&quot;, &quot;jabber-send&quot; },
            { &quot;port&quot;, 'o', OptionFlags.OPTIONAL_ARG, OptionArg.INT, ref port, &quot;Port to use when connecting to selected server.&quot;, &quot;5222&quot; },
            { null }
        };
    static int main (string[] args) {
        resource = &quot;jabber-send&quot;;
        port = Connection.DEFAULT_PORT;
        try {
            var opt_context = new OptionContext (&quot;- Loudmouth Synchronous Sample&quot;);
            opt_context.set_help_enabled (true);
            opt_context.add_main_entries (options, null);
            opt_context.parse (ref args);
            if (server == null || message == null || recipient == null
                               || username == null || password == null)
            {
                print (&quot;You must provide at least username, password, server, recipient, and message\n&quot;);
                print (&quot;%s&quot;, opt_context.get_help (true, null));
                return 1;
            }
        } catch (OptionError e) {
            stdout.printf (&quot;%s\n&quot;, e.message);
            stdout.printf (&quot;Run '%s --help' to see a full list of available command line options.\n&quot;, args[0]);
            return 1;
        }
        var connection = new Connection (server);
        try {
            print (&quot;Connecting to %s\n&quot;, server);
            connection.open_and_block ();
            print (&quot;Authenticating as '%s' with '%s' and the resource '%s'\n&quot;,
                   username, password, resource);
            connection.authenticate_and_block (username, password, resource);
            var m = new Message (recipient, MessageType.MESSAGE);
            m.node.add_child (&quot;body&quot;, message);
            print (&quot;Sending message '%s' to %s\n&quot;, message, recipient);
            connection.send (m);
            print (&quot;Closing connection\n&quot;);
            connection.close ();
        } catch (GLib.Error e) {
            stderr.printf (&quot;Error: %s\n&quot;, e.message);
            return 1;
        } finally {
            /* This will become a lot easier with RAII support in
               Loudmouth 1.5.x. You won't need to manually close the connection
               and the whole 'finally' block will become unnecessary, since
               the connection will get closed by its destructor if it's open. */
            if (connection.is_open ()) {
                finally_close (connection);
            }
        }
        return 0;
    }
    static void finally_close (Connection connection) {
        try {
            connection.close ();
        } catch (GLib.Error e) {
            error (&quot;Can't close connection.&quot;);
        }
    }
}
Compile and run
$ valac --pkg loudmouth-1.0 lm-send-sync.vala
$ ./lm-send-sync -s jabber.org -u myusername -p mypassword -m &quot;message to send&quot; -t someone_else@jabber.org
Loudmouth Asynchronous Sample
vala-test:examples/lm-send-async.vala using Gtk;
using Lm;
class MainWindow : Window {
    private Label status;
    private Button dconnect;
    private Button send;
    private Entry server;
    private Entry message;
    private Entry recipient;
    private Entry username;
    private Entry password;
    private Entry resource;
    private Connection cn;
    public MainWindow () {
        this.title = &quot;jabber-send&quot;;
        create_widgets ();
        this.destroy.connect (on_quit);
        this.send.clicked.connect (send_message);
        this.dconnect.clicked.connect (do_connect);
    }
    private void create_widgets () {
        var hboxbut = new HBox (false, 5);
        status = new Label (&quot;&quot;);
        dconnect = new Button.with_label (&quot;Connect&quot;);
        send = new Button.with_label (&quot;Send Message&quot;);
        server = new Entry ();
        username = new Entry ();
        password = new Entry ();
        resource = new Entry ();
        recipient = new Entry ();
        message = new Entry ();
        send.sensitive = false;
        status.label = &quot;Disconnected&quot;;
        resource.text = &quot;jabber-send&quot;;
        hboxbut.add (dconnect);
        hboxbut.add (send);
        var vbox = new VBox (false, 5);
        vbox.pack_start (hbox (&quot;Server:&quot;, server), false, false, 0);
        vbox.pack_start (hbox (&quot;Username:&quot;, username), false, false, 0);
        vbox.pack_start (hbox (&quot;Password:&quot;, password), false, false, 0);
        vbox.pack_start (hbox (&quot;Resource:&quot;, resource), false, false, 0);
        vbox.pack_start (hbox (&quot;Recipient:&quot;, recipient), false, false, 0);
        vbox.pack_start (hbox (&quot;Message:&quot;, message), false, false, 0);
        vbox.pack_start (status, true, true, 0);
        vbox.pack_start (hboxbut, false, false, 0);
        add (vbox);
    }
    private HBox hbox (string label, Widget w) {
        var box = new HBox (false, 5);
        box.pack_start (new Label.with_mnemonic (label), false, false, 5);
        box.pack_start (w, true, true, 5);
        return box;
    }
    private void on_quit () {
        if (cn != null) {
            do_disconnect ();
        }
        Gtk.main_quit ();
    }
    private void connected (Connection connection, bool success) {
        if (success) {
            status.label = &quot;Opened connection and authenticated&quot;;
            dconnect.label = &quot;Disconnect&quot;;
            dconnect.clicked.disconnect (do_connect);
            dconnect.clicked.connect (do_disconnect);
            send.sensitive = true;
        } else {
            status.label = &quot;Authentication failed&quot;;
        }
        dconnect.sensitive = true;
    }
    private void send_message () {
        var m = new Message (recipient.text, Lm.MessageType.MESSAGE);
        m.node.add_child (&quot;body&quot;, message.text);
        try {
            cn.send (m);
            status.label = &quot;Message sent&quot;;
        } catch (GLib.Error e) {
            status.label = &quot;Error: &quot; + e.message;
        }
    }
    private void auth (Connection connection, bool success) {
        if (!success) {
            status.label = &quot;Connection failed&quot;;
            dconnect.sensitive = true;
            return;
        }
        status.label = &quot;Authenticating with &quot; + server.text;
        try {
            connection.authenticate (username.text, password.text,
                                     resource.text, connected, null);
        } catch (GLib.Error e) {
            status.label = &quot;Error: &quot; + e.message;
        }
    }
    private void do_connect () {
        if (cn != null &amp;&amp; cn.is_open ()) {
            try {
                cn.close ();
            } catch (GLib.Error e) {
                status.label = &quot;Error: &quot; + e.message;
                return;
            }
        }
        cn = new Connection (server.text);
        try {
            cn.open (auth, null);
            status.label = &quot;Loading connection to &quot; + server.text;
            dconnect.sensitive = false;
        } catch (GLib.Error e) {
            status.label = &quot;Error: &quot; + e.message;
        }
    }
    private void do_disconnect () {
        try {
            cn.close ();
            status.label = &quot;Disconnected&quot;;
            dconnect.clicked.disconnect (do_disconnect);
            dconnect.clicked.connect (do_connect);
            dconnect.label = &quot;Connect&quot;;
            send.sensitive = false;
        } catch (GLib.Error e) {
            status.label = &quot;Error: &quot; + e.message;
        }
    }
    static int main (string[] args) {
        Gtk.init (ref args);
        var window = new MainWindow ();
        window.show_all ();
        Gtk.main ();
        return 0;
    }
}
Compile and run
$ valac --pkg loudmouth-1.0 --pkg gtk+-2.0 lm-send-async.vala
$ ./lm-send-async Vala/Examples Projects/Vala/LoudmouthSample  (last edited 2013-11-22 16:48:32 by WilliamJonMcCann)
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
