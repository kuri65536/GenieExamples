# Projects/Vala/DBusClientSamples/Waiting - GNOME Wiki!

Waiting for a DBus service to become available (outdated example)

## About
Sometimes you want to wait for a service to become available, then as soon as
you see it appearing immediately start using it. And letting go of it as soon as
the service disappears. You do this by listening for NameOwnerChanged, and
initially by checking out the list using ListNames. This sample is based on the
spec being proposed at Evolution/Metadata

```genie
// vala-test:examples/dbus-client-waiting.vala
[indent=4]
uses DBus

// [DBus (name = "org.gnome.evolution.metadata.Manager")]
// public interface Manager : GLib.Object {
//    public abstract void Register (DBus.ObjectPath registrar_path, uint last_checkout);
// }
[DBus (name = "org.gnome.evolution.metadata.Registrar")]
class Registrar: GLib.Object
    def Set(subject: string, predicates: array of string,
            values: array of string) raises GLib.Error
        print ("set: %s\n", subject);

    def Cleanup() raises GLib.Error
        print ("cleanup\n");

    def SetMany(subjects: array of string,
                predicates: array of string,  // TODO: string[][],
                values: array of string) raises GLib.Error  // TODO: string[][]
        var len = subjects.length
        var i = 0
        print ("setmany: %d\n", subjects.length);
        while i < len
            message ("setmany: " + subjects[i]);
//
//              There's a bug in Vala that makes lengths of inner arrays of a 
//              stacked array being wrong (apparently the inner array is no 
//              longer NULL terminated after demarshalign, which makes calcu-
//              lating the length impossible)
//
//              uint plen = 7; // strv_length (predicates[i]); 
//              uint y;
//
//              for (y = 0; y < plen; y++) {
//                      if (predicates[i][y] != null && values[i][y] != null) {
//                              print ("\t%s=%s\n", predicates[i][y], values[i][y]);
//                      }
//              }

    def UnsetMany(subjects: array of string) raises GLib.Error
        print ("unsetmany %d\n", subjects.length);

    def Unset(subject: string) raises GLib.Error
        message ("unset: %s\n" + subject);


class MyApplication: GLib.Object
    stored_time: uint
    conn: DBus.Connection
    registrar: Registrar
    bus: dynamic DBus.Object

    def on_reply(e: GLib.Error)
        pass

    def deactivate()
        registrar = null;

    def activate()
        obj: DBus.Object  // vala: dynamic
        path: DBus.ObjectPath
        registrar = new Registrar ();
        conn = DBus.Bus.get (DBus.BusType .SESSION);
        path = new DBus.ObjectPath ("/my/application/evolution_registrar");
        obj = conn.get_object ("org.gnome.evolution",
                               "/org/gnome/evolution/metadata/Manager",
                               "org.gnome.evolution.metadata.Manager");
        conn.register_object (path, registrar);
        try
            obj.Register (path, stored_time, on_reply);
        except e: GLib.Error
            message ("Can't register: %s", e.message);

    def on_name_owner_changed(sender: DBus.Object, name: string,
                              old_owner: string,
                              new_owner: string)
        if name == "org.gnome.evolution"
            if new_owner != "" and old_owner == ""
                activate ();
            if old_owner != "" and new_owner == ""
                deactivate ();

    def list_names_reply_cb(names: array of string, e: GLib.Error)
        for name in names
            if name == "org.gnome.evolution"
                activate();
                break;

    def on_ready(): bool
        try
            print ("...\n");
            bus.list_names (list_names_reply_cb);
        except e: GLib.Error
            message ("Can't list: %s", e.message);
        return false;

    def setup(stored_time: uint) raises DBus.Error, GLib.Error
        this.stored_time = stored_time;
        conn = DBus.Bus.get (DBus.BusType. SESSION);
        bus = conn.get_object ("org.freedesktop.DBus",
                               "/org/freedesktop/DBus",
                               "org.freedesktop.DBus");
        bus.NameOwnerChanged += on_name_owner_changed;
        Idle.add (on_ready);

init  // (string[] args) {
    var loop = new MainLoop (null, false);
    var app = new MyApplication ();
    try
        var a = (uint)0
        if args.length > 1
            a = (uint) args[1].to_ulong();
        else
            a = 0;
        app.setup (a);
    except e: DBus.Error
        stderr.printf ("Failed to initialise");
        return  // 1;
    except
        stderr.printf ("Dynamic method failure");
        return  // 1;
    loop.run ();
```


### Compile and Run

```shell
$ valac --pkg=dbus-glib-1 -o dbussample DBusSample.vala
$ ./dbussample
...
```

Vala/Examples Projects/Vala/DBusClientSamples/Waiting
    (last edited 2013-11-22 16:48:31 by WilliamJonMcCann)
