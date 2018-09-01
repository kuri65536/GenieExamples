# Projects/Vala/ValueSample - GNOME Wiki!

## Vala Value Sample

```genie
// vala-test:examples/value.vala
[indent=4]
init
    v: Value  // a GLib.Value
    v = 5;  // an integer auto-boxed into a Value
    print ("value: %d\n", (int) v);  // unboxing via cast
    // reset to its default value
    v.reset ();
    print ("value: %d\n", (int) v);  // unboxing via cast
    v = "hello";  // a string auto-boxed into a Value
    print ("value: %s\n", (string) v);  // unboxing via cast
```

### Compile and Run

```shell
$ valac valuesample.vala
$ ./valuesample
```

Vala/Examples Projects/Vala/ValueSample
    (last edited 2013-11-22 16:48:30 by WilliamJonMcCann)
