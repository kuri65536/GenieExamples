







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
[DBus (name = &quot;org.example.Demo&quot;)]
public class DemoServer : Object {

    private int counter;

    public int ping (string msg) {
        stdout.printf (&quot;%s\n&quot;, msg);
        return counter++;
    }

    public int ping_with_signal (string msg) {
        stdout.printf (&quot;%s\n&quot;, msg);
        pong(counter, msg);
        return counter++;
    }

    /* Including any parameter of type GLib.BusName won't be added to the
       interface and will return the dbus sender name (who is calling the method) */
    public int ping_with_sender (string msg, GLib.BusName sender) {
        stdout.printf (&quot;%s, from: %s\n&quot;, msg, sender);
        return counter++;
    }

    public void ping_error () throws Error {
        throw new DemoError.SOME_ERROR (&quot;There was an error!&quot;);
    }

    public signal void pong (int count, string msg);
}

[DBus (name = &quot;org.example.DemoError&quot;)]
public errordomain DemoError
{
    SOME_ERROR
}

void on_bus_aquired (DBusConnection conn) {
    try {
        conn.register_object (&quot;/org/example/demo&quot;, new DemoServer ());
    } catch (IOError e) {
        stderr.printf (&quot;Could not register service\n&quot;);
    }
}

void main () {
    Bus.own_name (BusType.SESSION, &quot;org.example.Demo&quot;, BusNameOwnerFlags.NONE,
                  on_bus_aquired,
                  () =&gt; {},
                  () =&gt; stderr.printf (&quot;Could not aquire name\n&quot;));

    new MainLoop ().run ();
}
$ valac --pkg gio-2.0 gdbus-demo-server.vala
Client
The methods of the client interface must be defined with throws IOError. vala-test:examples/gdbus-demo-client.vala [DBus (name = &quot;org.example.Demo&quot;)]
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
        demo = Bus.get_proxy_sync (BusType.SESSION, &quot;org.example.Demo&quot;,
                                                    &quot;/org/example/demo&quot;);

        /* Connecting to signal pong! */
        demo.pong.connect((c, m) =&gt; {
            stdout.printf (&quot;Got pong %d for msg '%s'\n&quot;, c, m);
            loop.quit ();
        });

        int reply = demo.ping (&quot;Hello from Vala&quot;);
        stdout.printf (&quot;%d\n&quot;, reply);

        reply = demo.ping_with_sender (&quot;Hello from Vala with sender&quot;);
        stdout.printf (&quot;%d\n&quot;, reply);

        reply = demo.ping_with_signal (&quot;Hello from Vala with signal&quot;);
        stdout.printf (&quot;%d\n&quot;, reply);

    } catch (IOError e) {
        stderr.printf (&quot;%s\n&quot;, e.message);
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
   GLib.HashTable&lt;,&gt; 
   Dictionary  
   a{sv} maps to HashTable&lt;string,&nbsp;Variant&gt; 

   ()        
   a struct type 
   Struct      
   a(ii) maps to Foo[] where Foo might be defined as
struct&nbsp;Foo&nbsp;{&nbsp;public&nbsp;int&nbsp;a;&nbsp;public&nbsp;int&nbsp;b&nbsp;};
A struct representing a(tsav) might look like
struct&nbsp;Bar&nbsp;{&nbsp;public&nbsp;uint64&nbsp;a;&nbsp;public&nbsp;string&nbsp;b;&nbsp;public&nbsp;Variant[]&nbsp;c;} 


Debugging D-Bus Applications

D-Feet
D-Feet is a graphical D-Bus debugger.  This is what our little D-Bus service looks like in D-Feet:  
dbus-monitor
Open a terminal and enter: $ dbus-monitorExcerpt from the output showing a property change notification: signal sender=:1.454 -&gt; dest=(null destination) serial=9 path=/org/example/demo; interface=org.freedesktop.DBus.Properties; member=PropertiesChanged
   string &quot;org.example.Demo&quot;
   array [
      dict entry(
         string &quot;pubprop&quot;
         variant             string &quot;1018873421&quot;
      )
   ]
   array [
   ]
Service with D-Bus property change notifications
This example will setup a D-Bus service that can send notifications on the change of properties. (example code partly by Faheem) The timeout will change the property every few seconds. The notifications can be visualized by the terminal program 'dbus-monitor' that comes with most distributions.  [DBus (name = &quot;org.example.Demo&quot;)]
public class DemoServer : Object {
    public string pubprop { owned get; set; }
    private weak DBusConnection conn;
    public DemoServer (DBusConnection conn) {
        this.conn = conn;
        this.notify.connect (send_property_change);
    }

    private void send_property_change (ParamSpec p) {
        var builder = new VariantBuilder (VariantType.ARRAY);
        var invalid_builder = new VariantBuilder (new VariantType (&quot;as&quot;));

        if (p.name == &quot;pubprop&quot;) {
            Variant i = pubprop;
            builder.add (&quot;{sv}&quot;, &quot;pubprop&quot;, i);
        }

        try {
            conn.emit_signal (null, 
                              &quot;/org/example/demo&quot;, 
                              &quot;org.freedesktop.DBus.Properties&quot;, 
                              &quot;PropertiesChanged&quot;, 
                              new Variant (&quot;(sa{sv}as)&quot;, 
                                           &quot;org.example.Demo&quot;, 
                                           builder, 
                                           invalid_builder)
                              );
        } catch (Error e) {
            stderr.printf (&quot;%s\n&quot;, e.message);
        }
    }
}

public class NotificationsTest : Object {

    private DemoServer dserver;

    public NotificationsTest () {
        Bus.own_name (BusType.SESSION, &quot;org.example.Demo&quot;, BusNameOwnerFlags.NONE,
                      on_bus_acquired, on_name_acquired, on_name_lost);
    }

    private void on_bus_acquired (DBusConnection conn) {
        print (&quot;bus acquired\n&quot;);
        try {
            this.dserver = new DemoServer (conn);
            conn.register_object (&quot;/org/example/demo&quot;, this.dserver);
        } catch (IOError e) {
            print (&quot;%s\n&quot;, e.message);
        }
    }

    private void on_name_acquired () {
        print (&quot;name acquired\n&quot;);
    }  

    private void on_name_lost () {
        print (&quot;name_lost\n&quot;);
    }

    public void setup_timeout () {
        Timeout.add_seconds (4, () =&gt; {
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



