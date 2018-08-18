Projects/Vala/DBusServerSamplePassingObjects - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
Projects/Vala/DBusServerSamplePassingObjectsHomeRecentChangesScheduleLogin
Contents
Simple example
Each client gets its own delegate
The other way around, passing an object to the service Note the below example will not compile with valac > 0.14.x as dbus-glib usage has been removed (deprecated as of 0.10.x), instead check the examples that use GDBus 
Simple example
This sample doesn't require state. There are only two instances registered on the bus: the service and the delegate. The life-cycle of both is controlled by the service. The client just gets the delegate by asking for it, and invokes on it. vala-test:examples/dbus-server-passing-object1.vala using GLib;
[DBus (name = "org.gnome.TestDelegate")]
public class TestDelegate : Object {
    int64 counter;
    public int64 ping (string msg) {
        message ("%s", msg);
        return counter++;
    }
}
[DBus (name = "org.gnome.TestServer")]
public class TestServer : Object {
        public void GetDelegate (out DBus.ObjectPath path) {
                path = new DBus.ObjectPath ("/org/gnome/delegate");
        }
}
void main () {
    var loop = new MainLoop (null, false);
    try {
        var conn = DBus.Bus.get (DBus.BusType. SESSION);
        dynamic DBus.Object bus = conn.get_object ("org.freedesktop.DBus",
                                                   "/org/freedesktop/DBus",
                                                   "org.freedesktop.DBus");
        // try to register service in session bus
        uint request_name_result = bus.request_name ("org.gnome.TestService", (uint) 0);
        if (request_name_result == DBus.RequestNameReply.PRIMARY_OWNER) {
            // start server
            var server = new TestServer ();
            var deleg = new TestDelegate ();
            conn.register_object ("/org/gnome/test", server);
            conn.register_object ("/org/gnome/delegate", deleg);
            loop.run ();
        } else {        
            // client   
            DBus.ObjectPath deleg_path;
            dynamic DBus.Object test_server_object = conn.get_object ("org.gnome.TestService",
                                                                      "/org/gnome/test",
                                                                      "org.gnome.TestServer");
            test_server_object.GetDelegate (out deleg_path);
            dynamic DBus.Object test_deleg_object = conn.get_object ("org.gnome.TestService",
                                                                      deleg_path,
                                                                      "org.gnome.TestDelegate");
            int64 pong = test_deleg_object.ping ("Hello from Vala");
            message ("%lli", pong);
        }
    } catch (Error e) {
        stderr.printf ("Oops: %s\n", e.message);
    }
}
Each client gets its own delegate
This example requires state at the service, which we store in delegs. This example also deals with clients that get disconnected before Unregister-ing themselves. The NameOwnerChanged signal is used for this. A typical use-case for this pattern is to implement an observer / observable or a register D-Bus pattern. vala-test:examples/dbus-server-passing-object2.vala using GLib;
using Gee;
public HashMap <string, TestDelegate> delegs;
public DBus.Connection conn;
[DBus (name = "org.gnome.TestDelegate")]
public class TestDelegate : Object {
    int64 counter;
    public int64 ping (string msg) {
        message ("%s", msg);
        return counter++;
    }
}
[DBus (name = "org.gnome.TestServer")]
public class TestServer : Object {
        public void GetDelegate (DBus.BusName sender, out DBus.ObjectPath path) {
                var deleg = new TestDelegate ();
                path = new DBus.ObjectPath ("/org/gnome/delegate/"+delegs.size.to_string());
                conn.register_object (path, deleg);
                message ("store:");
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
        delegs = new HashMap <string, TestDelegate> ();
        dynamic DBus.Object bus = conn.get_object ("org.freedesktop.DBus",
                                                   "/org/freedesktop/DBus",
                                                   "org.freedesktop.DBus");
        // try to register service in session bus
        uint request_name_result = bus.request_name ("org.gnome.TestService", (uint) 0);
        if (request_name_result == DBus.RequestNameReply.PRIMARY_OWNER) {
            // start server
            var server = new TestServer ();
            conn.register_object ("/org/gnome/test", server);
            bus.NameOwnerChanged += on_client_lost;
            loop.run ();
        } else {        
            // client   
            int i = 0;
            DBus.ObjectPath deleg_path;
            dynamic DBus.Object test_server_object = conn.get_object ("org.gnome.TestService",
                                                                      "/org/gnome/test",
                                                                      "org.gnome.TestServer");
            test_server_object.GetDelegate (out deleg_path);
            dynamic DBus.Object test_deleg_object = conn.get_object ("org.gnome.TestService",
                                                                      deleg_path,
                                                                      "org.gnome.TestDelegate");
            int64 pong;
            for (i = 0; i < 100000; i++) {
                    pong = test_deleg_object.ping ("Hello from Vala");
                    message ("%lli", pong);
            }
            test_server_object.Unregister (deleg_path);
        }
    } catch (Error e) {
        stderr.printf ("Oops: %s\n", e.message);
    }
}
The other way around, passing an object to the service
Here we pass an object to the service, from the client. The service will operate on it. A benefit of this pattern over the previous one is that the life-cycle of the delegate is controlled by the client. The service will just invoke on it when requested by the client. vala-test:examples/dbus-server-passing-object3.vala using GLib;
using Gee;
public DBus.Connection conn;
[DBus (name = "org.gnome.TestDelegate")]
public class TestDelegate : Object {
    int64 counter;
    public int64 ping (string msg) {
        message ("%s", msg);
        return counter++;
    }
}
[DBus (name = "org.gnome.TestServer")]
public class TestServer : Object {
        public void PerformOnDelegate (DBus.BusName sender, DBus.ObjectPath path) {
                 int i = 0;
                 dynamic DBus.Object test_deleg_object = conn.get_object (sender,
                                                                           path,
                                                                           "org.gnome.TestDelegate");
                 int64 pong;
                 for (i = 0; i < 1000; i++) {
                            pong = test_deleg_object.ping ("Hello from Vala");
                            message ("%lli", pong);
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
        dynamic DBus.Object bus = conn.get_object ("org.freedesktop.DBus",
                                                   "/org/freedesktop/DBus",
                                                   "org.freedesktop.DBus");
        // try to register service in session bus
        uint request_name_result = bus.request_name ("org.gnome.TestService", (uint) 0);
        if (request_name_result == DBus.RequestNameReply.PRIMARY_OWNER) {
            // start server
            var server = new TestServer ();
            conn.register_object ("/org/gnome/test", server);
            loop.run ();
        } else {        
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
        }
    } catch (Error e) {
        stderr.printf ("Oops: %s\n", e.message);
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
