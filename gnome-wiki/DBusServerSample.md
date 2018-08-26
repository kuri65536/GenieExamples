# Projects/Vala/DBusServerSample - GNOME Wiki!

Vala D-Bus Examples

Contents
- Vala D-Bus Examples
- Using GDBus
- Server
- Client
- Type Table
- Debugging D-Bus Applications
- D-Feet
- dbus-monitor

Service with D-Bus property change notifications Vala supports D-Bus
inter-process communication using the GDBus API that is part of GLib/GIO since
version 2.26. Vala automatically transforms Vala style lower_case_names to D-Bus
style CamelCaseNames behind the scenes.  You can use methods, signals,
properties in D-Bus objects as if they were Vala objects.

## Using GDBus

### Server

```genie
// vala-test:examples/gdbus-demo-server.vala
/* Note: this attribute specifies the _interface_ name.  It
 * is called 'name =' for historical reasons.
 */
[indent=4]
[DBus (name = "org.example.Demo")]
class DemoServer: Object
    counter: int
    def ping(msg: string): int raises GLib.Error
        stdout.printf ("%s\n", msg);
        return counter++;

    def ping_with_signal(msg: string): int raises GLib.Error
        stdout.printf ("%s\n", msg);
        pong(counter, msg);
        return counter++;

    /* Including any parameter of type GLib.BusName won't be added to the
       interface and will return the dbus sender name
       (who is calling the method) */
    def ping_with_sender(msg: string, sender: GLib.BusName): int \
            raises GLib.Error
        stdout.printf ("%s, from: %s\n", msg, sender);
        return counter++;

    def ping_error() raises Error
        raise new DemoError.SOME_ERROR ("There was an error!");

    event pong(count: int, msg: string)

[DBus (name = "org.example.DemoError")]
exception DemoError
    SOME_ERROR

def on_bus_aquired(conn: DBusConnection)
    try
        conn.register_object ("/org/example/demo", new DemoServer ());
    except e: IOError
        stderr.printf ("Could not register service\n");

def dummy()
    pass

def error()
    stderr.printf("Could not aquire name\n")

init
    Bus.own_name (BusType.SESSION, "org.example.Demo", BusNameOwnerFlags.NONE,
                  on_bus_aquired,
                  dummy, error)
    new MainLoop ().run ();
```

```shell
$ valac --pkg=gio-2.0 gdbus-demo-server.vala
```


### Client
The methods of the client interface must be defined with throws IOError.

```genie
// vala-test:examples/gdbus-demo-client.vala
[indent=4]
[DBus (name = "org.example.Demo")]
interface Demo: Object
    def abstract ping(msg: string): int raises GLib.Error
    def abstract ping_with_sender(msg: string):int raises GLib.Error
    def abstract ping_with_signal(msg: string):int raises GLib.Error
    event pong(count: int, msg: string)

init
    /* Needed only if your client is listening to signals; you can omit it otherwise */
    var loop = new MainLoop();
    /* Important: keep demo variable out of try/catch scope not lose signals! */
    demo: Demo? = null;
    try
        demo = Bus.get_proxy_sync (BusType.SESSION, "org.example.Demo",
                                                    "/org/example/demo");
        /* Connecting to signal pong! */
        demo.pong += def(c, m)
            stdout.printf ("Got pong %d for msg '%s'\n", c, m);
            loop.quit ();
        var reply = demo.ping ("Hello from Vala");
        stdout.printf ("%d\n", reply);
        reply = demo.ping_with_sender ("Hello from Vala with sender");
        stdout.printf ("%d\n", reply);
        reply = demo.ping_with_signal ("Hello from Vala with signal");
        stdout.printf ("%d\n", reply);
    except e: GLib.Error
        stderr.printf ("%s\n", e.message);
    loop.run();
```

```shell
$ valac --pkg=gio-2.0 gdbus-demo-client.vala
Type Table
   D-Bus 
   Vala        
   Description 
   Example 
   b         
   bool            
   Boolean     
   y         
   uint8           
   Byte        
   i         
   int             
   Integer     
   u         
   uint            
   Unsigned Integer 
   n         
   int16           
   16-bit Integer 
   q         
   uint16          
   Unsigned 16-bit Integer 
   x         
   int64           
   64-bit Integer 
   t         
   uint64          
   Unsigned 64-bit Integer 
   d         
   double          
   Double      
   s         
   string          
   String      
   v         
   GLib.Variant    
   Variant     
   o         
   GLib.ObjectPath 
   Object Path 
   a         
   []              
   Array       
   ai maps to int[] 
   a{}       
   GLib.HashTable<,> 
   Dictionary  
   a{sv} maps to HashTable<string, Variant> ()        
   a struct type Struct      
   a(ii) maps to Foo[] where Foo might be defined as
```
struct Foo { public int a; public int b };
A struct representing a(tsav) might look like
struct Bar { public uint64 a; public string b; public Variant[] c;} 
Debugging D-Bus Applications

## D-Feet
D-Feet is a graphical D-Bus debugger.  This is what our little D-Bus service
looks like in D-Feet:

dbus-monitor
Open a terminal and enter: $ dbus-monitorExcerpt from the output showing a
property change notification: signal sender=:1.454 -> dest=(null destination)
serial=9 path=/org/example/demo; interface=org.freedesktop.DBus.Properties;
member=PropertiesChanged

```
   string "org.example.Demo"
   array [
      dict entry(
         string "pubprop"
         variant             string "1018873421"
      )
   ]
   array [
   ]
```


## Service with D-Bus property change notifications
This example will setup a D-Bus service that can send notifications on the
change of properties. (example code partly by Faheem) The timeout will change
the property every few seconds. The notifications can be visualized by the
terminal program 'dbus-monitor' that comes with most distributions.

```genie
[indent=4]
[DBus (name = "org.example.Demo")]
class DemoServer: Object
    _pubprop: string
    prop pubprop: string
        owned get
            return _pubprop
        set
            _pubprop = value
    conn: weak DBusConnection

    construct(conn: DBusConnection)
        this.conn = conn;
        this.notify += def(p)
            var builder = new VariantBuilder (VariantType.ARRAY);
            var invalid_builder = new VariantBuilder (new VariantType ("as"));
            if p.name == "pubprop"
                i: Variant = this.pubprop
                builder.add ("{sv}", "pubprop", i);

            try
                this.conn.emit_signal (null,
                                "/org/example/demo",
                                "org.freedesktop.DBus.Properties",
                                "PropertiesChanged",
                                new Variant ("(sa{sv}as)",
                                            "org.example.Demo",
                                            builder,
                                            invalid_builder)
                                );
            except e: Error
                stderr.printf ("%s\n", e.message);
    /*
        this.notify.connect(send_property_change);

    def send_property_change(p: ParamSpec)
        var builder = new VariantBuilder (VariantType.ARRAY);
        var invalid_builder = new VariantBuilder (new VariantType ("as"));
        if p.name == "pubprop"
            i: Variant = pubprop
            builder.add ("{sv}", "pubprop", i);

        try
            conn.emit_signal (null,
                              "/org/example/demo",
                              "org.freedesktop.DBus.Properties",
                              "PropertiesChanged",
                              new Variant ("(sa{sv}as)",
                                           "org.example.Demo",
                                           builder,
                                           invalid_builder)
                              );
        except e: Error
            stderr.printf ("%s\n", e.message);
    */

class NotificationsTest: Object
    dserver: DemoServer

    construct()
        print("request dbus...")
        Bus.own_name (BusType.SESSION, "org.example.Demo", BusNameOwnerFlags.NONE,
                      on_bus_acquired, on_name_acquired, on_name_lost);

    def on_bus_acquired(conn: DBusConnection)
        print ("bus acquired\n");
        try
            this.dserver = new DemoServer (conn);
            conn.register_object ("/org/example/demo", this.dserver);
        except e: IOError
            print ("%s\n", e.message);

    def on_name_acquired()
        print ("name acquired\n");

    def on_name_lost()
        print ("name_lost\n");

    def add_seconds(): bool
        dserver.pubprop = Random.next_int().to_string()
        return true

    def setup_timeout()
        Timeout.add_seconds(4, add_seconds)

init
    var nt = new NotificationsTest ();
    nt.setup_timeout ();
    new MainLoop ().run ();
```

```shell
$ valac --pkg=gio-2.0 gdbus-change-notificationst.vala
```

Vala/Examples Projects/Vala/DBusServerSample
    (last edited 2013-11-22 16:48:26 by WilliamJonMcCann)

