# Projects/Vala/ListSample - GNOME Wiki!

# Vala List Example

This sample uses the List class from GLib.  There is also various container
classes in libgee, which are often easier to use or more powerful. See
../GeeSamples

```genie
// vala-test:examples/list.vala
[indent=4]
init  // (string[] args) {
    var lst = new list of string
    lst.add("one")
    lst.add("two")
    lst.add("three")
    stdout.printf("list.length () = %u\n", lst.size)
    // traditional iteration
    var i = 0
    while i < lst.size
        stdout.printf("%s\n", lst[i])
        i += 1
    // comfortable iteration
    for element in lst
        stdout.printf ("%s\n", element);
    // return 0;
```

### Compile and Run

```shell
$ valac -o list --pkg=gee-0.8 list.vala
$ ./list
```

Vala/Examples Projects/Vala/ListSample
    (last edited 2013-11-22 16:48:25 by WilliamJonMcCann)
