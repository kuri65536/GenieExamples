# Projects/Vala/LuaSample - GNOME Wiki!

# Projects/Vala/LuaSampleHomeRecentChangesScheduleLogin

## Lua Sample
```genie
// vala-test:examples/lua-test.vala
[indent=4]
uses Lua

def my_func(vm: LuaVM): int
    stdout.printf ("Vala Code From Lua Code! (%f)\n", vm.to_number (1));
    return 1;

init
    var code = """
            print "Lua Code From Vala Code!"
            my_func(33)
        """;
    var vm = new LuaVM ();
    vm.open_libs ();
    vm.register ("my_func", my_func);
    vm.do_string (code);
    // return 0;
```

### Compile and Run

```shell
$ valac --pkg=lua luatest.vala -o luatest
$ ./luatest
Lua Code From Vala Code!
Vala Code From Lua Code! (33.000000)
```

Note: Some distributions such as Debian and
Ubuntu install the pkg-config information for Lua under a wrong name. Here's a
workaround: sudo ln -s /usr/lib/pkgconfig/lua5.1.pc
/usr/lib/pkgconfig/lua.pc

Alternatively, you can rename the vapi file.


## Lua Table Sample
Based on Simple Lua Api Example from lua-users.org.

```genie
// vala-test:examples/lua-table.vala
uses Lua
static int main () {
    var vm = new LuaVM ();
    vm.open_libs ();
    // Create a Lua table with name 'foo'
    vm.new_table ();
    for (int i = 1; i <= 5; i++) {
        vm.push_number (i);         // Push the table index
        vm.push_number (i * 2);     // Push the cell value
        vm.raw_set (-3);            // Stores the pair in the table
    }
    vm.set_global ("foo");
    // Ask Lua to run our little script
    vm.do_string ("""
        -- Receives a table, returns the sum of its components.
        io.write("The table the script received has:\n");
        x = 0
        for i = 1, #foo do
          print(i, foo[i])
          x = x + foo[i]
        end
        io.write("Returning data back to C\n");
        return x
    """);
    // Get the returned value at the top of the stack (index -1)
    var sum = vm.to_number (-1);
    stdout.printf ("Script returned: %.0f\n", sum);
    vm.pop (1);  // Take the returned value out of the stack
    return 0;
}
```

```shell
$ valac --pkg lua simplesample.vala -o simplesample
$ ./simplesample
```

Vala/Examples Projects/Vala/LuaSample
    (last edited 2013-11-22 16:48:28 by WilliamJonMcCann)
