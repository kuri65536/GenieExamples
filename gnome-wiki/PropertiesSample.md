# Projects/Vala/PropertiesSample - GNOME Wiki!

## Properties Example

```genie
// vala-test:examples/properties.vala
[indent=4]
class PropertyDemo: Object
    /* Property-backing fields */
    _name: string
    _read_only: string
    /* Properties */
    automatic: string
    prop name: string
        get
            return _name
        set
            _name = value

    prop read_only: string
        get
            return _read_only

    construct(name: string)
        this.automatic = "InitialAutomatic";
        _name = name;
        _read_only = "InitialReadOnly";

init  //  () {
    var demo = new PropertyDemo ("InitialName");
    // Every class derived from 'Object' has a 'notify' signal that gets
    // emitted every time a property changes
    demo.notify += def(s, p)
        stdout.printf ("property '%s' has changed!\n", p.name);
    demo.automatic = "TheNewAutomatic";
    demo.name = "TheNewName";
    // The following statement would be rejected:
    // demo.read_only = "TheNewReadOnly";
    stdout.printf ("automatic: %s\n", demo.automatic);
    stdout.printf ("name: %s\n", demo.name);
    stdout.printf ("read_only: %s\n", demo.read_only);
```

### Compile and Run

```shell
$ valac prop_sample.vala
$ ./prop_sample
```

## Construction steps for gobject-style construction scheme

```genie
// vala-test:examples/properties-construction.vala
[indent=4]
class MyProperty: Object
    step: static uint = 0

    /* Property-backing fields */
    _c_g_s_prop: int
    _c_o_prop: int
    _g_s_prop: int

    /* Properties */
    /*
    prop construct_only_prop: int
        construct
            stdout.printf ("---- Step %u: construct_only ----\n", step);
            stdout.printf ("construct_only (before): %d\n", _c_o_prop);
            _c_o_prop = value;
            stdout.printf ("construct_only (after): %d\n\n", _c_o_prop);
            step++;
        get
            return _c_o_prop;

    prop construct_get_set_prop: int
        construct set
            stdout.printf ("---- Step %u: construct_get_set ----\n", step);
            stdout.printf ("construct_get_set (before): %d\n", _c_g_s_prop);
            _c_g_s_prop = value;
            stdout.printf ("construct_get_set (after): %d\n\n", _c_g_s_prop);
            step++;
        get
            return _c_g_s_prop;
     */

    prop get_set_prop: int
        set
            stdout.printf ("---- Step %u: get_set ----\n", step);
            stdout.printf ("get_set_prop (before): %d\n", _g_s_prop);
            _g_s_prop = value;
            stdout.printf ("get_set_prop (after): %d\n\n", _g_s_prop);
            step++;
        get
            return _g_s_prop;

    /* Creation method */
    construct with3(a: int, b: int, c: int)
        _c_o_prop = a    // prop construct
        _c_g_s_prop = b  // prop construct set
        // Object (construct_only_prop: a, construct_get_set_prop: b);
        this.get_set_prop = c;

    /* Construct block */
    construct()
        stdout.printf ("++++++++++ construct block +++++++++++++++\n\n");
        this.get_set_prop = 5;
        stdout.printf ("++++++++++ end of construct block ++++++++\n\n");

init  //  () {
    stdout.printf ("===== Construction process: MyProperty (1, 2, 3) ====\n\n");
    var demo = new MyProperty.with3(1, 2, 3);
    stdout.printf ("===== End of construction process ===================\n\n");
    // demo.construct_get_set_prop = 222;
    demo.get_set_prop = 333;
```

### Compile and Run

```shell
$ valac prop_construction.vala
$ ./prop_construction
```

Vala/Examples Projects/Vala/PropertiesSample
    (last edited 2013-11-22 16:48:25 by WilliamJonMcCann)
