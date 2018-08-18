Projects/Vala/DBusServerSample - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
Projects/Vala/DBusServerSampleHomeRecentChangesScheduleLogin
Vala D-Bus Examples
Contents
Vala D-Bus Examples
Using GDBus
Server
Client
Type Table
Debugging D-Bus Applications
D-Feet
dbus-monitor
Service with D-Bus property change notifications Vala supports D-Bus inter-process communication using the GDBus API that is part of GLib/GIO since version 2.26. Vala automatically transforms Vala style lower_case_names to D-Bus style CamelCaseNames behind the scenes.  You can use methods, signals, properties in D-Bus objects as if they were Vala objects. 
Using GDBus
Server
vala-test:examples/gdbus-demo-server.vala /* Note: this attribute specifies the _interface_ name.  It
 * is called 'name =' for historical reasons.
 */
[DBus (name = "org.example.Demo")]
public class DemoServer : Object {
    private int counter;
    public int ping (string msg) {
        stdout.printf ("%s\n", msg);
        return counter++;
    }
    public int ping_with_signal (string msg) {
        stdout.printf ("%s\n", msg);
        pong(counter, msg);
        return counter++;
    }
    /* Including any parameter of type GLib.BusName won't be added to the
       interface and will return the dbus sender name (who is calling the method) */
    public int ping_with_sender (string msg, GLib.BusName sender) {
        stdout.printf ("%s, from: %s\n", msg, sender);
        return counter++;
    }
    public void ping_error () throws Error {
        throw new DemoError.SOME_ERROR ("There was an error!");
    }
    public signal void pong (int count, string msg);
}
[DBus (name = "org.example.DemoError")]
public errordomain DemoError
{
    SOME_ERROR
}
void on_bus_aquired (DBusConnection conn) {
    try {
        conn.register_object ("/org/example/demo", new DemoServer ());
    } catch (IOError e) {
        stderr.printf ("Could not register service\n");
    }
}
void main () {
    Bus.own_name (BusType.SESSION, "org.example.Demo", BusNameOwnerFlags.NONE,
                  on_bus_aquired,
                  () => {},
                  () => stderr.printf ("Could not aquire name\n"));
    new MainLoop ().run ();
}
$ valac --pkg gio-2.0 gdbus-demo-server.vala
Client
The methods of the client interface must be defined with throws IOError. vala-test:examples/gdbus-demo-client.vala [DBus (name = "org.example.Demo")]
interface Demo : Object {
    public abstract int ping (string msg) throws IOError;
    public abstract int ping_with_sender (string msg) throws IOError;
    public abstract int ping_with_signal (string msg) throws IOError;
    public signal void pong (int count, string msg);
}
void main () {
    /* Needed only if your client is listening to signals; you can omit it otherwise */
    var loop = new MainLoop();
    /* Important: keep demo variable out of try/catch scope not lose signals! */
    Demo demo = null;
    try {
        demo = Bus.get_proxy_sync (BusType.SESSION, "org.example.Demo",
                                                    "/org/example/demo");
        /* Connecting to signal pong! */
        demo.pong.connect((c, m) => {
            stdout.printf ("Got pong %d for msg '%s'\n", c, m);
            loop.quit ();
        });
        int reply = demo.ping ("Hello from Vala");
        stdout.printf ("%d\n", reply);
        reply = demo.ping_with_sender ("Hello from Vala with sender");
        stdout.printf ("%d\n", reply);
        reply = demo.ping_with_signal ("Hello from Vala with signal");
        stdout.printf ("%d\n", reply);
    } catch (IOError e) {
        stderr.printf ("%s\n", e.message);
    }
    loop.run();
}
$ valac --pkg gio-2.0 gdbus-demo-client.vala
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
   a{sv} maps to HashTable<string, Variant> 
   ()        
   a struct type 
   Struct      
   a(ii) maps to Foo[] where Foo might be defined as
struct Foo { public int a; public int b };
A struct representing a(tsav) might look like
struct Bar { public uint64 a; public string b; public Variant[] c;} 
Debugging D-Bus Applications
D-Feet
D-Feet is a graphical D-Bus debugger.  This is what our little D-Bus service looks like in D-Feet:  
dbus-monitor
Open a terminal and enter: $ dbus-monitorExcerpt from the output showing a property change notification: signal sender=:1.454 -> dest=(null destination) serial=9 path=/org/example/demo; interface=org.freedesktop.DBus.Properties; member=PropertiesChanged
   string "org.example.Demo"
   array [
      dict entry(
         string "pubprop"
         variant             string "1018873421"
      )
   ]
   array [
   ]
Service with D-Bus property change notifications
This example will setup a D-Bus service that can send notifications on the change of properties. (example code partly by Faheem) The timeout will change the property every few seconds. The notifications can be visualized by the terminal program 'dbus-monitor' that comes with most distributions.  [DBus (name = "org.example.Demo")]
public class DemoServer : Object {
    public string pubprop { owned get; set; }
    private weak DBusConnection conn;
    public DemoServer (DBusConnection conn) {
        this.conn = conn;
        this.notify.connect (send_property_change);
    }
    private void send_property_change (ParamSpec p) {
        var builder = new VariantBuilder (VariantType.ARRAY);
        var invalid_builder = new VariantBuilder (new VariantType ("as"));
        if (p.name == "pubprop") {
            Variant i = pubprop;
            builder.add ("{sv}", "pubprop", i);
        }
        try {
            conn.emit_signal (null, 
                              "/org/example/demo", 
                              "org.freedesktop.DBus.Properties", 
                              "PropertiesChanged", 
                              new Variant ("(sa{sv}as)", 
                                           "org.example.Demo", 
                                           builder, 
                                           invalid_builder)
                              );
        } catch (Error e) {
            stderr.printf ("%s\n", e.message);
        }
    }
}
public class NotificationsTest : Object {
    private DemoServer dserver;
    public NotificationsTest () {
        Bus.own_name (BusType.SESSION, "org.example.Demo", BusNameOwnerFlags.NONE,
                      on_bus_acquired, on_name_acquired, on_name_lost);
    }
    private void on_bus_acquired (DBusConnection conn) {
        print ("bus acquired\n");
        try {
            this.dserver = new DemoServer (conn);
            conn.register_object ("/org/example/demo", this.dserver);
        } catch (IOError e) {
            print ("%s\n", e.message);
        }
    }
    private void on_name_acquired () {
        print ("name acquired\n");
    }  
    private void on_name_lost () {
        print ("name_lost\n");
    }
    public void setup_timeout () {
        Timeout.add_seconds (4, () => {
            dserver.pubprop = Random.next_int ().to_string ();
            return true;
        });
    }
}
void main () {
    var nt = new NotificationsTest ();
    nt.setup_timeout ();
    new MainLoop ().run ();
}
$ valac --pkg gio-2.0 gdbus-change-notificationst.vala Vala/Examples Projects/Vala/DBusServerSample  (last edited 2013-11-22 16:48:26 by WilliamJonMcCann)
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
