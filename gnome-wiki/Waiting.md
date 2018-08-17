







Projects/Vala/DBusClientSamples/Waiting - GNOME Wiki!



<!--
var search_hint = "Search";
//-->




























Projects/Vala/DBusClientSamples/WaitingHomeRecentChangesScheduleLogin








Waiting for a DBus service to become available (outdated example)

About
Sometimes you want to wait for a service to become available, then as soon as you see it appearing immediately start using it. And letting go of it as soon as the service disappears. You do this by listening for NameOwnerChanged, and initially by checking out the list using ListNames. This sample is based on the spec being proposed at Evolution/Metadata vala-test:examples/dbus-client-waiting.vala using DBus;

// [DBus (name = &quot;org.gnome.evolution.metadata.Manager&quot;)]
// public interface Manager : GLib.Object {
//    public abstract void Register (DBus.ObjectPath registrar_path, uint last_checkout);
// }

[DBus (name = &quot;org.gnome.evolution.metadata.Registrar&quot;)]
public class Registrar: GLib.Object {

    public void Set (string subject, string[] predicates, string[] values) {
        print (&quot;set: %s\n&quot;, subject);
    }

    public void Cleanup () {
        print (&quot;cleanup\n&quot;);
    }

    public void SetMany (string[] subjects, string[][] predicates, string[][] values) {


        uint len = subjects.length;
        uint i;

        print (&quot;setmany: %d\n&quot;, subjects.length);


        for (i = 0; i &lt; len; i++) {
                message (&quot;setmany: &quot; + subjects[i]);
//
//              There's a bug in Vala that makes lengths of inner arrays of a 
//              stacked array being wrong (apparently the inner array is no 
//              longer NULL terminated after demarshalign, which makes calcu-
//              lating the length impossible)
//
//              uint plen = 7; // strv_length (predicates[i]); 
//              uint y;
//
//              for (y = 0; y &lt; plen; y++) {
//                      if (predicates[i][y] != null &amp;&amp; values[i][y] != null) {
//                              print (&quot;\t%s=%s\n&quot;, predicates[i][y], values[i][y]);
//                      }
//              }
        }
   }

    public void UnsetMany (string[] subjects) {
        print (&quot;unsetmany %d\n&quot;, subjects.length);

    }

    public void Unset (string subject) {
        message (&quot;unset: %s\n&quot; + subject);
    }
}

public class MyApplication : GLib.Object {

    public uint stored_time;
    private DBus.Connection conn;
    private Registrar registrar;
    private dynamic DBus.Object bus;

    private void on_reply (GLib.Error e) {
    }

    private void deactivate () {
        registrar = null;
    }

    private void activate () {
        dynamic DBus.Object obj;

        DBus.ObjectPath path;

        registrar = new Registrar ();

        conn = DBus.Bus.get (DBus.BusType .SESSION);

        path = new DBus.ObjectPath (&quot;/my/application/evolution_registrar&quot;);

        obj = conn.get_object (&quot;org.gnome.evolution&quot;,
                               &quot;/org/gnome/evolution/metadata/Manager&quot;,
                               &quot;org.gnome.evolution.metadata.Manager&quot;);

        conn.register_object (path, registrar);

        try {
                obj.Register (path, stored_time, on_reply);
        } catch (GLib.Error e) {
                message (&quot;Can't register: %s&quot;, e.message);
        }
    }

    private void on_name_owner_changed (DBus.Object sender, string name, string old_owner, string new_owner) {
        if (name == &quot;org.gnome.evolution&quot;) {
                if (new_owner != &quot;&quot; &amp;&amp; old_owner == &quot;&quot;)
                        activate ();
                if (old_owner != &quot;&quot; &amp;&amp; new_owner == &quot;&quot;)
                        deactivate ();
        }
    }

    private void list_names_reply_cb (string[] names, GLib.Error e) {
        foreach (string name in names) {
                if (name == &quot;org.gnome.evolution&quot;) {
                        activate();
                        break;
                }
        }
    }

    private bool on_ready () {

        try {
                print (&quot;...\n&quot;);
                bus.list_names (list_names_reply_cb);
        } catch (GLib.Error e) {
                message (&quot;Can't list: %s&quot;, e.message);
        }

        return false;
    }

    public void setup (uint stored_time) throws DBus.Error, GLib.Error {

        this.stored_time = stored_time;

        conn = DBus.Bus.get (DBus.BusType. SESSION);

        bus = conn.get_object (&quot;org.freedesktop.DBus&quot;,
                               &quot;/org/freedesktop/DBus&quot;,
                               &quot;org.freedesktop.DBus&quot;);

        bus.NameOwnerChanged += on_name_owner_changed;

        Idle.add (on_ready);
    }

    static int main (string[] args) {
        var loop = new MainLoop (null, false);

        var app = new MyApplication ();

        try {
            uint a = 0;

            if (args.length &gt; 1)
                a = (uint) args[1].to_ulong();
            else
                a = 0;

            app.setup (a);

        } catch (DBus.Error e) {
            stderr.printf (&quot;Failed to initialise&quot;);
            return 1;
        } catch {
            stderr.printf (&quot;Dynamic method failure&quot;);
            return 1;
        }

        loop.run ();

        return 0;
    }
}

Compile and Run
$ valac --pkg dbus-glib-1 -o dbussample DBusSample.vala
$ ./dbussample
... Vala/Examples Projects/Vala/DBusClientSamples/Waiting  (last edited 2013-11-22 16:48:31 by WilliamJonMcCann)











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



