# Projects/Vala/GnomeDesktopAndGMenuExample - GNOME Wiki!
# Gnome-Desktop and GMenu Example

```genie
// vala-test:examples/gnome-desktop-and-menu.vala
[indent=4]
class GMenuExample
    def get_main_directories(): list of GMenu.TreeDirectory
        var tree = GMenu.Tree.lookup ("applications.menu", GMenu.TreeFlags.INCLUDE_EXCLUDED);
        var root = tree.get_root_directory ();
        var dirs = new list of GMenu.TreeDirectory
        for item in root.get_contents()
            if item.get_type () == GMenu.TreeItemType.DIRECTORY
                dirs.add((GMenu.TreeDirectory) item);
        return dirs;

    def get_entries_flat(directory: GMenu.TreeDirectory
                         ): list of GMenu.TreeEntry
        var entries = new list of GMenu.TreeEntry
        for item in directory.get_contents()
            case (item.get_type())
                when GMenu.TreeItemType.DIRECTORY
                    entries.add_all(
                        get_entries_flat((GMenu.TreeDirectory)item));
                when GMenu.TreeItemType.ENTRY
                    entries.add((GMenu.TreeEntry)item)
        return entries;

    def get_desktop_app_info(entry: GMenu.TreeEntry): DesktopAppInfo
        return new DesktopAppInfo.from_filename (entry.get_desktop_file_path ());

    /* Launch an application described in DesktopAppInfo */
    def launch_desktop_app_info(info: DesktopAppInfo)
        try
            info.launch (null, new AppLaunchContext ());
        except error: Error
            stdout.printf ("Error: %s\n", error.message);

init  // string[] args) {
    var sample = new GMenuExample ();
    stdout.printf ("\nGet all main directories:\n");
    var directories = sample.get_main_directories ();
    for directory in directories
        stdout.printf ("%s\n", directory.get_name ());
    stdout.printf ("\nGet all entries/directories for the first directory:\n");
    var entries = sample.get_entries_flat(directories.first());
    for entry in entries
        stdout.printf ("%s\n", entry.get_name ());
    stdout.printf ("\nGet desktop item for first menu entry via GIO and display\n");
    stdout.printf ("name, description and icon name:\n");
    var app_info = sample.get_desktop_app_info(entries.first());
    stdout.printf ("Name: %s\n", app_info.get_name ());
    stdout.printf ("Comment: %s\n", app_info.get_description ());
    stdout.printf ("Exec: %s\n", app_info.get_commandline ());
    stdout.printf ("Icon: %s\n", app_info.get_icon ().to_string ());
    // TODO(shimoda): return 0; in init
```

### Compile and Run

```shell
$ valac --pkg=gio-unix-2.0 --pkg=libgnome-menu --pkg=gee-0.8 \
    -o gnomemenusample \
    GnomeMenuSample.gs -X "-DGMENU_I_KNOW_THIS_IS_UNSTABLE"
$ ./gnomemenusample
```

Vala/Examples Projects/Vala/GnomeDesktopAndGMenuExample
    (last edited 2013-11-22 16:48:31 by WilliamJonMcCann)
