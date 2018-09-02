# Projects/Vala/TypeModuleSample - GNOME Wiki!

## GLib.TypeModule based Plugin in Vala

This example shows you how to implement a GLib.TypeModule based plugin in Vala.
It also shows the usage of static construct/destruct block.


## Plugin itself:

```genie
// plugin.vala
[indent=4]
class MyClass: Object
    init
        message("MyClass init");

    final
        message("MyClass deinit");

[ModuleInit]
def plugin_init(type_modul: GLib.TypeModule): Type
    return typeof(MyClass);
```

```shell
$ valac --ccode plugin.vala
$ gcc -fPIC -shared -o libplugin.so plugin.c \
    $(pkg-config --libs --cflags gobject-2.0 gmodule-2.0)
```


## Plugin loader:

```genie
// loader.vala
[indent=4]
class MyModule: TypeModule
    [CCode (has_target = false)]
    delegate PluginInitFunc(module: TypeModule): Type
    module: GLib.Module = null
    name: string = null

    construct(name: string)
        this.name = name;

    def override load(): bool
        path: string = Module.build_path(null, name);
        module = Module.open(path, GLib.ModuleFlags.BIND_LAZY);
        if null == module
            error("Module not found");
        plugin_init: void* = null;
        if !module.symbol("plugin_init", out plugin_init)
            error("No such symbol");
        ((PluginInitFunc) plugin_init)(this);
        message("Library loaded")  // output twice...?
        return true;

    def override unload()
        module = null;
        message("Library unloaded");

// Never unref instance of GTypeModule
// http://www.lanedo.com/~mitch/module-system-talk-guadec-2006/
//      Module-System-Talk-Guadec-2006.pdf
module: static TypeModule = null;

init
    module = new MyModule("plugin");
    module.load();
    var o = GLib.Object.new(Type.from_name("MyClass"));
    // free last instance, plugin unload
    o = null;
    module.unload()  // unload not called implicitly in my case.
```

### Build

```shell
$ valac -o loader loader.vala --pkg=gmodule-2.0
```

### Run

```
$ LD_LIBRARY_PATH=$PWD ./loader
** Message: plugin.vala:5: MyClass init
** Message: plugin.vala:10: MyClass deinit
** Message: loader.vala:37: Library unloaded
```


Vala/Examples Projects/Vala/TypeModuleSample
    (last edited 2013-11-22 16:48:25 by WilliamJonMcCann)
