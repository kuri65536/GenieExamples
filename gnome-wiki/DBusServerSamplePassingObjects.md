Projects/Vala/DBusServerSamplePassingObjects - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
Projects/Vala/DBusServerSamplePassingObjectsHomeRecentChangesScheduleLogin
Contents
Simple example
Each client gets its own delegate
The other way around, passing an object to the service Note the below example will not compile with valac &gt; 0.14.x as dbus-glib usage has been removed (deprecated as of 0.10.x), instead check the examples that use GDBus 
Simple example
This sample doesn't require state. There are only two instances registered on the bus: the service and the delegate. The life-cycle of both is controlled by the service. The client just gets the delegate by asking for it, and invokes on it. vala-test:examples/dbus-server-passing-object1.vala using GLib;
[DBus (name = &quot;org.gnome.TestDelegate&quot;)]
public class TestDelegate : Object {
    int64 counter;
    public int64 ping (string msg) {
        message (&quot;%s&quot;, msg);
        return counter++;
    }
}
[DBus (name = &quot;org.gnome.TestServer&quot;)]
public class TestServer : Object {
        public void GetDelegate (out DBus.ObjectPath path) {
                path = new DBus.ObjectPath (&quot;/org/gnome/delegate&quot;);
        }
}
void main () {
    var loop = new MainLoop (null, false);
    try {
        var conn = DBus.Bus.get (DBus.BusType. SESSION);
        dynamic DBus.Object bus = conn.get_object (&quot;org.freedesktop.DBus&quot;,
                                                   &quot;/org/freedesktop/DBus&quot;,
                                                   &quot;org.freedesktop.DBus&quot;);
        // try to register service in session bus
        uint request_name_result = bus.request_name (&quot;org.gnome.TestService&quot;, (uint) 0);
        if (request_name_result == DBus.RequestNameReply.PRIMARY_OWNER) {
            // start server
            var server = new TestServer ();
            var deleg = new TestDelegate ();
            conn.register_object (&quot;/org/gnome/test&quot;, server);
            conn.register_object (&quot;/org/gnome/delegate&quot;, deleg);
            loop.run ();
        } else {        
            // client   
            DBus.ObjectPath deleg_path;
            dynamic DBus.Object test_server_object = conn.get_object (&quot;org.gnome.TestService&quot;,
                                                                      &quot;/org/gnome/test&quot;,
                                                                      &quot;org.gnome.TestServer&quot;);
            test_server_object.GetDelegate (out deleg_path);
            dynamic DBus.Object test_deleg_object = conn.get_object (&quot;org.gnome.TestService&quot;,
                                                                      deleg_path,
                                                                      &quot;org.gnome.TestDelegate&quot;);
            int64 pong = test_deleg_object.ping (&quot;Hello from Vala&quot;);
            message (&quot;%lli&quot;, pong);
        }
    } catch (Error e) {
        stderr.printf (&quot;Oops: %s\n&quot;, e.message);
    }
}
Each client gets its own delegate
This example requires state at the service, which we store in delegs. This example also deals with clients that get disconnected before Unregister-ing themselves. The NameOwnerChanged signal is used for this. A typical use-case for this pattern is to implement an observer / observable or a register D-Bus pattern. vala-test:examples/dbus-server-passing-object2.vala using GLib;
using Gee;
public HashMap &lt;string, TestDelegate&gt; delegs;
public DBus.Connection conn;
[DBus (name = &quot;org.gnome.TestDelegate&quot;)]
public class TestDelegate : Object {
    int64 counter;
    public int64 ping (string msg) {
        message (&quot;%s&quot;, msg);
        return counter++;
    }
}
[DBus (name = &quot;org.gnome.TestServer&quot;)]
public class TestServer : Object {
        public void GetDelegate (DBus.BusName sender, out DBus.ObjectPath path) {
                var deleg = new TestDelegate ();
                path = new DBus.ObjectPath (&quot;/org/gnome/delegate/&quot;+delegs.size.to_string());
                conn.register_object (path, deleg);
                message (&quot;store:&quot;);
                message (sender);
                delegs.set (sender, deleg);
        }
        public void Unregister (DBus.ObjectPath path) {
                delegs.remove (path);
        }
}
void on_client_lost (DBus.Object sender, string name, string prev, string newp) {
        // We lost a client
        delegs.remove (prev);
}
void main () {
    var loop = new MainLoop (null, false);
    try {
        conn = DBus.Bus.get (DBus.BusType. SESSION);
        delegs = new HashMap &lt;string, TestDelegate&gt; ();
        dynamic DBus.Object bus = conn.get_object (&quot;org.freedesktop.DBus&quot;,
                                                   &quot;/org/freedesktop/DBus&quot;,
                                                   &quot;org.freedesktop.DBus&quot;);
        // try to register service in session bus
        uint request_name_result = bus.request_name (&quot;org.gnome.TestService&quot;, (uint) 0);
        if (request_name_result == DBus.RequestNameReply.PRIMARY_OWNER) {
            // start server
            var server = new TestServer ();
            conn.register_object (&quot;/org/gnome/test&quot;, server);
            bus.NameOwnerChanged += on_client_lost;
            loop.run ();
        } else {        
            // client   
            int i = 0;
            DBus.ObjectPath deleg_path;
            dynamic DBus.Object test_server_object = conn.get_object (&quot;org.gnome.TestService&quot;,
                                                                      &quot;/org/gnome/test&quot;,
                                                                      &quot;org.gnome.TestServer&quot;);
            test_server_object.GetDelegate (out deleg_path);
            dynamic DBus.Object test_deleg_object = conn.get_object (&quot;org.gnome.TestService&quot;,
                                                                      deleg_path,
                                                                      &quot;org.gnome.TestDelegate&quot;);
            int64 pong;
            for (i = 0; i &lt; 100000; i++) {
                    pong = test_deleg_object.ping (&quot;Hello from Vala&quot;);
                    message (&quot;%lli&quot;, pong);
            }
            test_server_object.Unregister (deleg_path);
        }
    } catch (Error e) {
        stderr.printf (&quot;Oops: %s\n&quot;, e.message);
    }
}
The other way around, passing an object to the service
Here we pass an object to the service, from the client. The service will operate on it. A benefit of this pattern over the previous one is that the life-cycle of the delegate is controlled by the client. The service will just invoke on it when requested by the client. vala-test:examples/dbus-server-passing-object3.vala using GLib;
using Gee;
public DBus.Connection conn;
[DBus (name = &quot;org.gnome.TestDelegate&quot;)]
public class TestDelegate : Object {
    int64 counter;
    public int64 ping (string msg) {
        message (&quot;%s&quot;, msg);
        return counter++;
    }
}
[DBus (name = &quot;org.gnome.TestServer&quot;)]
public class TestServer : Object {
        public void PerformOnDelegate (DBus.BusName sender, DBus.ObjectPath path) {
                 int i = 0;
                 dynamic DBus.Object test_deleg_object = conn.get_object (sender,
                                                                           path,
                                                                           &quot;org.gnome.TestDelegate&quot;);
                 int64 pong;
                 for (i = 0; i &lt; 1000; i++) {
                            pong = test_deleg_object.ping (&quot;Hello from Vala&quot;);
                            message (&quot;%lli&quot;, pong);
                 }
        }
}
public dynamic DBus.Object test_server_object;
public DBus.ObjectPath path;
bool start_it ()
{
        test_server_object.PerformOnDelegate (path);
        return false;
}
void main () {
    var loop = new MainLoop (null, false);
    try {
        conn = DBus.Bus.get (DBus.BusType. SESSION);
        dynamic DBus.Object bus = conn.get_object (&quot;org.freedesktop.DBus&quot;,
                                                   &quot;/org/freedesktop/DBus&quot;,
                                                   &quot;org.freedesktop.DBus&quot;);
        // try to register service in session bus
        uint request_name_result = bus.request_name (&quot;org.gnome.TestService&quot;, (uint) 0);
        if (request_name_result == DBus.RequestNameReply.PRIMARY_OWNER) {
            // start server
            var server = new TestServer ();
            conn.register_object (&quot;/org/gnome/test&quot;, server);
            loop.run ();
        } else {        
            // client   
            test_server_object = conn.get_object (&quot;org.gnome.TestService&quot;,
                                                                      &quot;/org/gnome/test&quot;,
                                                                      &quot;org.gnome.TestServer&quot;);
            var deleg = new TestDelegate ();
            path = new DBus.ObjectPath (&quot;/org/gnome/delegate&quot;);
            conn.register_object (path, deleg);
            message (&quot;PERFORM&quot;);
            Timeout.add_seconds (1, start_it);
            loop.run ();
        }
    } catch (Error e) {
        stderr.printf (&quot;Oops: %s\n&quot;, e.message);
    }
}
 Vala/Examples Projects/Vala/DBusServerSamplePassingObjects  (last edited 2013-11-22 16:48:27 by WilliamJonMcCann)
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
