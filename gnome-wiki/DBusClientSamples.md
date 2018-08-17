







Projects/Vala/DBusClientSamples - GNOME Wiki!



<!--
var search_hint = "Search";
//-->




























Projects/Vala/DBusClientSamplesHomeRecentChangesScheduleLogin







Contents
Vala D-Bus Client Examples
BlueZ - Bluetooth Discovery
Purple - Instant Messaging
Skype status client
Waiting for a service to become available (outdated example)
Generating a vala interface from an existing DBus interface 
Vala D-Bus Client Examples
These examples require Vala &gt;= 0.9.2 and GLib/GIO &gt;= 2.26 Rules for writing Vala D-Bus interfaces: annotate the interface with [DBus&nbsp;(name&nbsp;=&nbsp;&quot;...&quot;)] convert DBusCamelCaseNames to vala_lower_case_names add throws&nbsp;IOError to each interface method 
BlueZ - Bluetooth Discovery
vala-test:examples/dbus-bluez.vala [DBus (name = &quot;org.bluez.Adapter&quot;)]
interface Bluez : Object {
    public signal void discovery_started ();
    public signal void discovery_completed ();
    public signal void remote_device_found (string address, uint klass, int rssi);
    public signal void remote_name_updated (string address, string name);

    public abstract void discover_devices () throws IOError;
}

MainLoop loop;

void on_remote_device_found (string address, uint klass, int rssi) {
    stdout.printf (&quot;Remote device found (%s, %u, %d)\n&quot;,
                   address, klass, rssi);
}

void on_discovery_started () {
    stdout.printf (&quot;Discovery started\n&quot;);
}

void on_remote_name_updated (string address, string name) {
    stdout.printf (&quot;Remote name updated (%s, %s)\n&quot;, address, name);
}

void on_discovery_completed () {
    stdout.printf (&quot;Discovery completed\n&quot;);
    loop.quit ();
}

int main () {
    Bluez bluez;
    try {
        bluez = Bus.get_proxy_sync (BusType.SYSTEM, &quot;org.bluez&quot;,
                                                          &quot;/org/bluez/hci0&quot;);

        // Connect to D-Bus signals
        bluez.remote_device_found.connect (on_remote_device_found);
        bluez.discovery_started.connect (on_discovery_started);
        bluez.discovery_completed.connect (on_discovery_completed);
        bluez.remote_name_updated.connect (on_remote_name_updated);

        // Async D-Bus call
        bluez.discover_devices ();
    } catch (IOError e) {
        stderr.printf (&quot;%s\n&quot;, e.message);
        return 1;
    }

    loop = new MainLoop ();
    loop.run ();

    return 0;
}

Compile and Run
$ valac --pkg gio-2.0 dbus-bluez.vala
$ ./dbus-bluez
Purple - Instant Messaging
vala-test:examples/dbus-purple.vala [DBus (name = &quot;im.pidgin.purple.PurpleInterface&quot;)]
interface Purple : Object {
    public signal void received_im_msg (int account, string sender, string msg,
                                        int conv, uint flags);

    public abstract int[] purple_accounts_get_all_active () throws IOError;
    public abstract string purple_account_get_username (int account) throws IOError;
}

int main () {
    try {
        Purple purple = Bus.get_proxy_sync (BusType.SESSION,
                                            &quot;im.pidgin.purple.PurpleService&quot;,
                                            &quot;/im/pidgin/purple/PurpleObject&quot;);

        var accounts = purple.purple_accounts_get_all_active ();
        foreach (int account in accounts) {
            string username = purple.purple_account_get_username (account);
            stdout.printf (&quot;Account %s\n&quot;, username);
        }

        purple.received_im_msg.connect ((account, sender, msg) =&gt; {
            stdout.printf (@&quot;Message received $sender: $msg\n&quot;);
        });

        var loop = new MainLoop ();
        loop.run ();

    } catch (IOError e) {
        stderr.printf (&quot;%s\n&quot;, e.message);
        return 1;
    }

    return 0;
}

Compile and Run
$ valac --pkg gio-2.0 dbus-purple.vala
$ ./dbus-purple
Skype status client
vala-test:examples/dbus-skype.vala [DBus (name = &quot;com.Skype.API&quot;)]
interface Skype : Object {
    public abstract string invoke (string cmd) throws IOError;
}

string send (Skype skype, string cmd) throws IOError {
    return skype.invoke (cmd);
}

void send_check (Skype skype, string cmd, string expected) throws IOError {
    string actual = send (skype, cmd);
    if (actual != expected) {
        stderr.printf (&quot;Bad result '%s', expected '%s'\n&quot;, actual, expected);
    }
}

int main (string[] args) {
    try {

        Skype skype = Bus.get_proxy_sync (BusType.SESSION,
                                          &quot;com.Skype.API&quot;, &quot;/com/Skype&quot;);

        send_check (skype, &quot;NAME skype-status-client&quot;, &quot;OK&quot;);
        send_check (skype, &quot;PROTOCOL 2&quot;, &quot;PROTOCOL 2&quot;);

        // if no arguments given, show current status, otherwise update
        // status to first argument
        if (args.length &lt; 2) {
            stdout.printf (&quot;%s\n&quot;, send (skype, &quot;GET USERSTATUS&quot;));
        } else {
            // possible statuses: ONLINE OFFLINE SKYPEME AWAY NA DND INVISIBLE
            send_check (skype, &quot;SET USERSTATUS &quot; + args[1], &quot;USERSTATUS &quot; + args[1]);
        }

    } catch (IOError e) {
        stderr.printf (&quot;%s\n&quot;, e.message);
        return 1;
    }

    return 0;
}

Compile and Run
$ valac --pkg gio-2.0 dbus-skype.vala
$ ./dbus-skype
USERSTATUS ONLINE
$ ./dbus-skype AWAY
$ ./dbus-skype
USERSTATUS AWAY
Waiting for a service to become available (outdated example)
Waiting for a service to become available (outdated example) 
Generating a vala interface from an existing DBus interface
When making an interface based on an existing DBus interface the vala-dbus-binding-tool can be used. This tool will create a interface based on an XML-file describing the DBus interface. For objects that implement the introspectable interface this file is easy to obtain.  use dbus-send to get the XML printed to the screen dbus-send --print-reply --type=method_call --dest=busname objectpath org.freedesktop.DBus.Introspectable.Introspectalternatively d-foot can be used as a gui to browse DBus and send commands. The vala-dbus-binding-tool can be used on the obtained XML file. In it’s most basic form the command looks like this: vala-dbus-binding-tool --api-path=”path_to_xml_file”This will create a vala file for all interfaces provided by the object.  Vala/Examples Projects/Vala/DBusClientSamples  (last edited 2016-06-23 10:59:14 by JoostFock)











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



