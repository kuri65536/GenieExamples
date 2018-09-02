# Projects/Vala/DBusClientSamples - GNOME Wiki!

## Contents
- Vala D-Bus Client Examples
- BlueZ - Bluetooth Discovery
- Purple - Instant Messaging
- Skype status client
- Waiting for a service to become available (outdated example)
- Generating a vala interface from an existing DBus interface 


## Vala D-Bus Client Examples
These examples require Vala >= 0.9.2 and GLib/GIO >= 2.26 Rules for writing Vala
D-Bus interfaces: annotate the interface with [DBus (name = "...")] convert
DBusCamelCaseNames to vala_lower_case_names add throws IOError to each interface
method


## BlueZ - Bluetooth Discovery

```genie
// vala-test:examples/dbus-bluez.vala
[indent=4]
[DBus (name = "org.bluez.Adapter")]
interface Bluez: Object
    event discovery_started()
    event discovery_completed()
    event remote_device_found(address: string, klass: uint, rssi: int)
    event remote_name_updated(address: string, name: string);
    def abstract discover_devices() raises IOError

loop: MainLoop

def on_remote_device_found(address: string, klass: uint, rssi: int)
    stdout.printf ("Remote device found (%s, %u, %d)\n",
                   address, klass, rssi);

def on_discovery_started()
    stdout.printf ("Discovery started\n");

def on_remote_name_updated(address: string, name: string)
    stdout.printf ("Remote name updated (%s, %s)\n", address, name);

def on_discovery_completed()
    stdout.printf ("Discovery completed\n");
    loop.quit ();

init  // () {
    bluez: Bluez
    try
        bluez = Bus.get_proxy_sync (BusType.SYSTEM, "org.bluez",
                                                          "/org/bluez/hci0");
        // Connect to D-Bus signals
        bluez.remote_device_found.connect (on_remote_device_found);
        bluez.discovery_started.connect (on_discovery_started);
        bluez.discovery_completed.connect (on_discovery_completed);
        bluez.remote_name_updated.connect (on_remote_name_updated);
        // Async D-Bus call
        bluez.discover_devices ();
    except e: IOError
        stderr.printf ("%s\n", e.message);
        return

    loop = new MainLoop ();
    loop.run ();
```

### Compile and Run

```shell
$ valac --pkg=gio-2.0 dbus-bluez.gs
$ ./dbus-bluez
```


## Purple - Instant Messaging

```genie
// vala-test:examples/dbus-purple.vala
[indent=4]
[DBus (name = "im.pidgin.purple.PurpleInterface")]
interface Purple: Object
    event received_im_msg(account: int, sender: string, msg: string,
                          conv: int, flags: uint)
    def abstract purple_accounts_get_all_active(): array of int raises IOError
    def abstract purple_account_get_username(account: int): string raises IOError

init  // () {
    try
        purple: Purple = Bus.get_proxy_sync(BusType.SESSION,
                                            "im.pidgin.purple.PurpleService",
                                            "/im/pidgin/purple/PurpleObject");
        var accounts = purple.purple_accounts_get_all_active ();
        for account in accounts
            var username = purple.purple_account_get_username(account)
            stdout.printf ("Account %s\n", username);
        purple.received_im_msg += def(account, sender, msg)
            stdout.printf (@"Message received $sender: $msg\n");
        var loop = new MainLoop ();
        loop.run ();
    except e: IOError
        stderr.printf ("%s\n", e.message);
```

### Compile and Run

```shell
$ valac --pkg=gio-2.0 dbus-purple.gs
$ ./dbus-purple
```


## Skype status client

```genie
// vala-test:examples/dbus-skype.vala
[indent=4]
[DBus (name = "com.Skype.API")]
interface Skype: Object
    def abstract invoke(cmd: string): string raises IOError

def send(skype: Skype, cmd: string): string raises IOError
    return skype.invoke (cmd);

def send_check(skype: Skype, cmd: string, expected: string) raises IOError
    var actual = send (skype, cmd)
    if actual != expected
        stderr.printf ("Bad result '%s', expected '%s'\n", actual, expected);

init  // (string[] args) {
    try
        skype: Skype = Bus.get_proxy_sync(BusType.SESSION,
                                          "com.Skype.API", "/com/Skype");
        send_check (skype, "NAME skype-status-client", "OK");
        send_check (skype, "PROTOCOL 2", "PROTOCOL 2");
        // if no arguments given, show current status, otherwise update
        // status to first argument
        if args.length < 2
            stdout.printf ("%s\n", send (skype, "GET USERSTATUS"));
        else
            // possible statuses: ONLINE OFFLINE SKYPEME AWAY NA DND INVISIBLE
            send_check (skype, "SET USERSTATUS " + args[1], "USERSTATUS " + args[1]);
    except e: IOError
        stderr.printf ("%s\n", e.message);
```

### Compile and Run

```shell
$ valac --pkg=gio-2.0 dbus-skype.gs
$ ./dbus-skype
USERSTATUS ONLINE
$ ./dbus-skype AWAY
$ ./dbus-skype
USERSTATUS AWAY
```


### Waiting for a service to become available (outdated example)
Generating a vala interface from an existing DBus interface
When making an interface based on an existing DBus interface the
vala-dbus-binding-tool can be used.

This tool will create a interface based on an XML-file describing the DBus
interface. For objects that implement the introspectable interface this file is
easy to obtain.  use dbus-send to get the XML printed to the screen

```
dbus-send --print-reply --type=method_call --dest=busname objectpath
org.freedesktop.DBus.Introspectable.Introspectalternatively
```

d-foot can be used as a gui to browse DBus and send commands. The
vala-dbus-binding-tool can be used on the obtained XML file. In it’s most basic
form the command looks like this:
`vala-dbus-binding-tool --api-path="path_to_xml_file"`

This will create a vala file for all interfaces provided by the object.

Vala/Examples Projects/Vala/DBusClientSamples
    (last edited 2016-06-23 10:59:14 by JoostFock)

