# Projects/Vala/DBusServerSamplePassingObjects - GNOME Wiki!

Contents
- Simple example
- Each client gets its own delegate

The other way around, passing an object to the service Note the below example
will not compile with valac > 0.14.x as dbus-glib usage has been removed
(deprecated as of 0.10.x), instead check the examples that use GDBus

## Simple example
This sample doesn't require state. There are only two instances registered on
the bus: the service and the delegate. The life-cycle of both is controlled by
the service. The client just gets the delegate by asking for it, and invokes on
it.

```genie
// vala-test:examples/dbus-server-passing-object1.vala
[indent=4]
uses GLib

[DBus (name = "org.gnome.TestDelegate")]
class TestDelegate: Object
    counter: int64
    def ping(msg: string): int64
        message ("%s", msg);
        return counter++;

[DBus (name = "org.gnome.TestServer")]
class TestServer: Object
    def GetDelegate(out path: DBus.ObjectPath)
        path = new DBus.ObjectPath ("/org/gnome/delegate");

init
    var loop = new MainLoop (null, false);
    try
        var conn = DBus.Bus.get (DBus.BusType. SESSION);
        bus: dynamic DBus.Object = conn.get_object("org.freedesktop.DBus",
                                                   "/org/freedesktop/DBus",
                                                   "org.freedesktop.DBus");
        // try to register service in session bus
        request_name_result: uint = bus.request_name(
            "org.gnome.TestService", (uint) 0);
        if request_name_result == DBus.RequestNameReply.PRIMARY_OWNER
            // start server
            var server = new TestServer ();
            var deleg = new TestDelegate ();
            conn.register_object ("/org/gnome/test", server);
            conn.register_object ("/org/gnome/delegate", deleg);
            loop.run ();
        else
            // client
            deleg_path: DBus.ObjectPath
            test_server_object: dynamic DBus.Object = conn.get_object(
                "org.gnome.TestService",
                "/org/gnome/test",
                "org.gnome.TestServer");
            test_server_object.GetDelegate (out deleg_path);
            test_deleg_object: dynamic DBus.Object = conn.get_object(
                "org.gnome.TestService",
                deleg_path,
                "org.gnome.TestDelegate");
            var pong = test_deleg_object.ping ("Hello from Genie");
            message ("%lli", pong);
    except e: Error
        stderr.printf ("Oops: %s\n", e.message);
```

## Each client gets its own delegate
This example requires state at the service, which we store in delegs. This
example also deals with clients that get disconnected before Unregister-ing
themselves. The NameOwnerChanged signal is used for this. A typical use-case for
this pattern is to implement an observer / observable or a register D-Bus
pattern.

```genie
// vala-test:examples/dbus-server-passing-object2.vala
[indent=4]
uses GLib
uses Gee

delegs: HashMap of string, TestDelegate
conn: DBus.Connection

[DBus (name = "org.gnome.TestDelegate")]
class TestDelegate: Object
    counter: int64;
    def ping(msg: string): int64
        message ("%s", msg);
        return counter++;

[DBus (name = "org.gnome.TestServer")]
class TestServer: Object
    def GetDelegate(sender: DBus.BusName, out path: DBus.ObjectPath)
        var deleg = new TestDelegate ();
        path = new DBus.ObjectPath ("/org/gnome/delegate/"+delegs.size.to_string());
        conn.register_object (path, deleg);
        message ("store:");
        message (sender);
        delegs.set (sender, deleg);

    def Unregister(path: DBus.ObjectPath)
        delegs.remove (path);

def on_client_lost(sender: DBus.Object, name: string,
                   prev: string, newp: string)
        // We lost a client
    delegs.remove (prev);

init
    var loop = new MainLoop (null, false);
    try
        conn = DBus.Bus.get (DBus.BusType. SESSION);
        delegs = new HashMap <string, TestDelegate> ();
        dynamic DBus.Object bus = conn.get_object ("org.freedesktop.DBus",
                                                   "/org/freedesktop/DBus",
                                                   "org.freedesktop.DBus");
        // try to register service in session bus
        uint request_name_result = bus.request_name ("org.gnome.TestService", (uint) 0);
        if request_name_result == DBus.RequestNameReply.PRIMARY_OWNER
            // start server
            var server = new TestServer ();
            conn.register_object ("/org/gnome/test", server);
            bus.NameOwnerChanged += on_client_lost;
            loop.run ();
        else
            // client
            DBus.ObjectPath deleg_path;
            dynamic DBus.Object test_server_object = conn.get_object ("org.gnome.TestService",
                                                                      "/org/gnome/test",
                                                                      "org.gnome.TestServer");
            test_server_object.GetDelegate (out deleg_path);
            dynamic DBus.Object test_deleg_object = conn.get_object ("org.gnome.TestService",
                                                                      deleg_path,
                                                                      "org.gnome.TestDelegate");
            var i = 0
            while i < 100000
                var pong = test_deleg_object.ping ("Hello from Genie");
                message ("%lli", pong);
                i += 1
            test_server_object.Unregister (deleg_path);
    except e: Error
        stderr.printf ("Oops: %s\n", e.message);
```

```shell
$ valac --pkg=dbus-glib-1 --pkg=gee-0.8 -o dbussample DBusSample.gs
```

## The other way around, passing an object to the service
Here we pass an object to the service, from the client. The service will operate
on it. A benefit of this pattern over the previous one is that the life-cycle of
the delegate is controlled by the client. The service will just invoke on it
when requested by the client.

```genie
// vala-test:examples/dbus-server-passing-object3.vala
[indent=4]
uses GLib
uses Gee

conn: DBus.Connection

[DBus (name = "org.gnome.TestDelegate")]
class TestDelegate: Object
    counter: int64
    def ping(msg: string): int64
        message ("%s", msg);
        return counter++;

[DBus (name = "org.gnome.TestServer")]
class TestServer: Object
    def PerformOnDelegate(sender: DBus.BusName, path: DBus.ObjectPath)
        dynamic DBus.Object test_deleg_object = conn.get_object (sender,
                                                               path,
                                                               "org.gnome.TestDelegate");
        int64 pong;
        var i = 0
        while i < 1000
            pong = test_deleg_object.ping ("Hello from Genie");
            message ("%lli", pong);
            i += 1

test_server_object: dynamic DBus.Object
path: DBus.ObjectPath

def start_it(): bool
    test_server_object.PerformOnDelegate (path);
    return false;

init  //  () {
    var loop = new MainLoop (null, false);
    try
        conn = DBus.Bus.get (DBus.BusType. SESSION);
        dynamic DBus.Object bus = conn.get_object ("org.freedesktop.DBus",
                                                   "/org/freedesktop/DBus",
                                                   "org.freedesktop.DBus");
        // try to register service in session bus
        uint request_name_result = bus.request_name(
                "org.gnome.TestService", (uint) 0);
        if request_name_result == DBus.RequestNameReply.PRIMARY_OWNER
            // start server
            var server = new TestServer ();
            conn.register_object ("/org/gnome/test", server);
            loop.run ();
        else
            // client
            test_server_object = conn.get_object ("org.gnome.TestService",
                                                                      "/org/gnome/test",
                                                                      "org.gnome.TestServer");
            var deleg = new TestDelegate ();
            path = new DBus.ObjectPath ("/org/gnome/delegate");
            conn.register_object (path, deleg);
            message ("PERFORM");
            Timeout.add_seconds (1, start_it);
            loop.run ();
    except e: Error
        stderr.printf ("Oops: %s\n", e.message);
```

```shell
$ valac --pkg=gio-2.0 sample.gs
```


Vala/Examples Projects/Vala/DBusServerSamplePassingObjects
    (last edited 2013-11-22 16:48:27 by WilliamJonMcCann)
