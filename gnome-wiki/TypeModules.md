# Projects/Vala/TypeModules - GNOME Wiki!

This example shows how to use modules (plugins) within your program and how to
write such modules (plugins) with Vala. The first thing needed is a common
interface that will describe the interface between the main program and other
modules / plugins. Interface (plugin-interface.vala):

```genie
// vala-test:examples/type-modules-interface.vala
[indent=4]
interface TestPlugin: Object
    def abstract hello()
```

This should be put into its own file that is then shared between the main
program and plugins. Main program (main.vala):

```genie
// vala-test:examples/type-modules-main.vala
[indent=4]
class PluginRegistrar of T: Object
    prop readonly path: string
    type: Type
    module: Module
    delegate RegisterPluginFunction(module: Module): Type

    construct(name: string)
        assert (Module.supported ());
        this._path = Module.build_path(Environment.get_variable("PWD"), name)

    def load(): bool
        stdout.printf ("Loading plugin with path: '%s'\n", path);
        module = Module.open (path, ModuleFlags.BIND_LAZY);
        if module == null
            return false;
        stdout.printf ("Loaded module: '%s'\n", module.name ());
        function: void*
        module.symbol ("register_plugin", out function);
        register_plugin: unowned RegisterPluginFunction = \
            (RegisterPluginFunction)function
        type = register_plugin (module);
        stdout.printf ("Plugin type: %s\n\n", type.name ());
        return true;

    def new_object (): T
        return Object.new (type);

init
    var registrar = new PluginRegistrar of TestPlugin("plugin2")
    registrar.load ();
    var plugin = registrar.new_object ();
    plugin.hello ();
```

PluginRegistrar is a tool class that wraps registering, loading and creating new
instances of TestPlugin class which are implemented in other classes contained
in other modules.

### Compiling:

```shell
$ valac --pkg gmodule-2.0 main.vala plugin-interface.vala -o main
```

A module must provide its own implementation of TestPlugin and a register_plugin
method which is used to register the class in the main program.


## Example of a plugin (plugin.vala):

```genie
// vala-test:examples/type-modules-myplugin.vala
[indent=4]
class MyPlugin: Object implements TestPlugin
    def hello()
        stdout.printf ("Hello world!\n");

def register_plugin(module: Module): Type
    // types are registered automatically
    return typeof (MyPlugin);
```

### Compiling:

```shell
$ valac --pkg=gmodule-2.0 -C plugin.vala plugin-interface.vala
$ gcc -shared -fPIC \
   $(pkg-config --cflags --libs glib-2.0 gmodule-2.0) -o libplugin.so plugin.c
```


## Real World Example(s)
A real world Vala application that uses this code as the base for its plugin
loading is Rygel.


Vala/Examples Projects/Vala/TypeModules
    (last edited 2013-11-22 16:48:32 by WilliamJonMcCann)

