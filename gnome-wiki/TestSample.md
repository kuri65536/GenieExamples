# Projects/Vala/TestSample - GNOME Wiki!

## Unit tests in Vala

Simple test

```genie
// vala-test:examples/test-simple.vala
[indent=4]
def test1()
    assert ("foo" + "bar" == "foobar");

def add_foo_tests()
    Test.add_func("/vala/test", test1)

init  //  (string[] args) {
    Test.init (ref args);
    add_foo_tests ();
    Test.run ();
```

Compile this with:

```shell
$ valac unit-test.vala
```


## Test using GTK+

```genie
// vala-test:examples/test-gtk.vala
[indent=4]
def test1()
    var widget = new Gtk.Button ();
    assert(widget isa Gtk.Button)

def add_foo_tests()
    Test.add_func ("/vala/test", test1)

def idle(): bool
    Test.run ();
    Gtk.main_quit ();
    return false;

init  //  (string[] args) {
    Gtk.init (ref args);
    Test.init (ref args);
    add_foo_tests ();
    Idle.add(idle)
    Gtk.main ();
```

Compile this with:

```shell
$ valac --pkg=gtk+-3.0 unit-test-gtk.vala
```


Vala/Examples Projects/Vala/TestSample
    (last edited 2013-11-22 16:48:25 by WilliamJonMcCann)
