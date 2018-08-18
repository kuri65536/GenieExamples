# Projects/Vala/LoudmouthSample - GNOME Wiki!

## Loudmouth Synchronous Sample

```genie
// vala-test:examples/lm-send-sync.vala
/*
 * Copyright (C) 2004 Imendio AB
 * Copyright (C) 2009 Harley Laue <losinggeneration@gmail.com>
 * Copyright (C) 2018 Shimoda kuri65536 _at_ hot mail _dot_ com
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
[indent=4]
uses Lm

class LmSyncDemo
    server: static string = null
    message: static string = null
    username: static string = null
    password: static string = null
    recipient: static string = null
    resource: static string
    port: static uint
    const options: array of OptionEntry = {
        { "server", 's', 0, OptionArg.STRING, ref server, "Server to connect to. You need to have a valid login on that server.", "server.org" },
        { "username", 'u', 0, OptionArg.STRING, ref username, "Username to used for the server you selected.", "some_username" },
        { "password", 'p', 0, OptionArg.STRING, ref password, "Password to use for entered username.", "some_password" },
        { "recipient",'t', 0, OptionArg.STRING, ref recipient, "User to send message to.", "someone@server.org" },
        { "message", 'm', 0, OptionArg.STRING, ref message, "Message to send to recipient.", "\"some message to send\"" },
        { "resource", 'r', OptionFlags.OPTIONAL_ARG, OptionArg.STRING, ref resource, "Resource to use when connecting.", "jabber-send" },
        { "port", 'o', OptionFlags.OPTIONAL_ARG, OptionArg.INT, ref port, "Port to use when connecting to selected server.", "5222" },
        { null }
    }

    def static run(args: array of string): int
        resource = "jabber-send";
        port = Connection.DEFAULT_PORT;
        try
            var opt_context = new OptionContext ("- Loudmouth Synchronous Sample");
            opt_context.set_help_enabled (true);
            opt_context.add_main_entries (options, null);
            opt_context.parse (ref args);
            if (server == null or message == null or recipient == null
                               or username == null or password == null)
                print ("You must provide at least username, password, server, recipient, and message\n");
                print ("%s", opt_context.get_help (true, null));
                return 1;
        except e: OptionError
            stdout.printf ("%s\n", e.message);
            stdout.printf ("Run '%s --help' to see a full list of available command line options.\n", args[0]);
            return 1;

        var connection = new Connection (server);
        try
            print ("Connecting to %s\n", server);
            connection.open_and_block ();
            print ("Authenticating as '%s' with '%s' and the resource '%s'\n",
                   username, password, resource);
            connection.authenticate_and_block (username, password, resource);
            var m = new Message (recipient, MessageType.MESSAGE);
            m.node.add_child ("body", message);
            print ("Sending message '%s' to %s\n", message, recipient);
            connection.send (m);
            print ("Closing connection\n");
            connection.close ();
        except e: GLib.Error
            stderr.printf ("Error: %s\n", e.message);
            return 1;
        finally
            /* This will become a lot easier with RAII support in
               Loudmouth 1.5.x. You won't need to manually close the connection
               and the whole 'finally' block will become unnecessary, since
               the connection will get closed by its destructor if it's open. */
            if connection.is_open()
                finally_close (connection);
        return 0;

    def static finally_close(connection: Connection)
        try
            connection.close ();
        except e: GLib.Error
            error ("Can't close connection.");

init
    LmSyncDemo.run(args)
```

### Compile and run

```shell
$ valac --pkg=loudmouth-1.0 lm-send-sync.vala
$ ./lm-send-sync -s jabber.org -u myusername -p mypassword -m "message to send" -t someone_else@jabber.org
```


## Loudmouth Asynchronous Sample

```genie
// vala-test:examples/lm-send-async.vala
using Gtk;
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
        this.title = "jabber-send";
        create_widgets ();
        this.destroy.connect (on_quit);
        this.send.clicked.connect (send_message);
        this.dconnect.clicked.connect (do_connect);
    }
    private void create_widgets () {
        var hboxbut = new HBox (false, 5);
        status = new Label ("");
        dconnect = new Button.with_label ("Connect");
        send = new Button.with_label ("Send Message");
        server = new Entry ();
        username = new Entry ();
        password = new Entry ();
        resource = new Entry ();
        recipient = new Entry ();
        message = new Entry ();
        send.sensitive = false;
        status.label = "Disconnected";
        resource.text = "jabber-send";
        hboxbut.add (dconnect);
        hboxbut.add (send);
        var vbox = new VBox (false, 5);
        vbox.pack_start (hbox ("Server:", server), false, false, 0);
        vbox.pack_start (hbox ("Username:", username), false, false, 0);
        vbox.pack_start (hbox ("Password:", password), false, false, 0);
        vbox.pack_start (hbox ("Resource:", resource), false, false, 0);
        vbox.pack_start (hbox ("Recipient:", recipient), false, false, 0);
        vbox.pack_start (hbox ("Message:", message), false, false, 0);
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
            status.label = "Opened connection and authenticated";
            dconnect.label = "Disconnect";
            dconnect.clicked.disconnect (do_connect);
            dconnect.clicked.connect (do_disconnect);
            send.sensitive = true;
        } else {
            status.label = "Authentication failed";
        }
        dconnect.sensitive = true;
    }
    private void send_message () {
        var m = new Message (recipient.text, Lm.MessageType.MESSAGE);
        m.node.add_child ("body", message.text);
        try {
            cn.send (m);
            status.label = "Message sent";
        } catch (GLib.Error e) {
            status.label = "Error: " + e.message;
        }
    }
    private void auth (Connection connection, bool success) {
        if (!success) {
            status.label = "Connection failed";
            dconnect.sensitive = true;
            return;
        }
        status.label = "Authenticating with " + server.text;
        try {
            connection.authenticate (username.text, password.text,
                                     resource.text, connected, null);
        } catch (GLib.Error e) {
            status.label = "Error: " + e.message;
        }
    }
    private void do_connect () {
        if (cn != null &amp;&amp; cn.is_open ()) {
            try {
                cn.close ();
            } catch (GLib.Error e) {
                status.label = "Error: " + e.message;
                return;
            }
        }
        cn = new Connection (server.text);
        try {
            cn.open (auth, null);
            status.label = "Loading connection to " + server.text;
            dconnect.sensitive = false;
        } catch (GLib.Error e) {
            status.label = "Error: " + e.message;
        }
    }
    private void do_disconnect () {
        try {
            cn.close ();
            status.label = "Disconnected";
            dconnect.clicked.disconnect (do_disconnect);
            dconnect.clicked.connect (do_connect);
            dconnect.label = "Connect";
            send.sensitive = false;
        } catch (GLib.Error e) {
            status.label = "Error: " + e.message;
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
```

### Compile and run

```shell
$ valac --pkg=loudmouth-1.0 --pkg=gtk+-2.0 lm-send-async.vala
$ ./lm-send-async
```

Vala/Examples Projects/Vala/LoudmouthSample
    (last edited 2013-11-22 16:48:32 by WilliamJonMcCann)

