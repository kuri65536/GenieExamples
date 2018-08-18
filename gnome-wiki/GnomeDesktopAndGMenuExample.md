Projects/Vala/GnomeDesktopAndGMenuExample - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
Projects/Vala/GnomeDesktopAndGMenuExampleHomeRecentChangesScheduleLogin
Gnome-Desktop and GMenu Example
vala-test:examples/gnome-desktop-and-menu.vala public class GMenuExample {
    public List&lt;GMenu.TreeDirectory&gt; get_main_directories () {
        var tree = GMenu.Tree.lookup (&quot;applications.menu&quot;, GMenu.TreeFlags.INCLUDE_EXCLUDED);
        var root = tree.get_root_directory ();
        var dirs = new List&lt;GMenu.TreeDirectory&gt; ();
        foreach (GMenu.TreeItem item in root.get_contents ()) {
            if (item.get_type () == GMenu.TreeItemType.DIRECTORY) {
                dirs.append ((GMenu.TreeDirectory) item);
            }
        }
        return dirs;
    }
    public List&lt;GMenu.TreeEntry&gt; get_entries_flat (GMenu.TreeDirectory directory) {
        var entries = new List&lt;GMenu.TreeEntry&gt; ();
        foreach (GMenu.TreeItem item in directory.get_contents ()) {
            switch (item.get_type ()) {
            case GMenu.TreeItemType.DIRECTORY:
                entries.concat (get_entries_flat ((GMenu.TreeDirectory) item));
                break;
            case GMenu.TreeItemType.ENTRY:
                entries.append ((GMenu.TreeEntry) item);
                break;
            }
        }
        return entries;
    }
    public DesktopAppInfo get_desktop_app_info (GMenu.TreeEntry entry) {
        return new DesktopAppInfo.from_filename (entry.get_desktop_file_path ());
    }
    /* Launch an application described in DesktopAppInfo */
    public void launch_desktop_app_info (DesktopAppInfo info) {
        try {
            info.launch (null, new AppLaunchContext ());
        } catch (Error error) {
            stdout.printf (&quot;Error: %s\n&quot;, error.message);
        }
    }
}
static int main (string[] args) {
    var sample = new GMenuExample ();
    stdout.printf (&quot;\nGet all main directories:\n&quot;);
    var directories = sample.get_main_directories ();
    foreach (var directory in directories) {
        stdout.printf (&quot;%s\n&quot;, directory.get_name ());
    }
    stdout.printf (&quot;\nGet all entries/directories for the first directory:\n&quot;);
    var entries = sample.get_entries_flat (directories.nth_data (0));
    foreach (var entry in entries) {
        stdout.printf (&quot;%s\n&quot;, entry.get_name ());
    }
    stdout.printf (&quot;\nGet desktop item for first menu entry via GIO and display\n&quot;);
    stdout.printf (&quot;name, description and icon name:\n&quot;);
    var app_info = sample.get_desktop_app_info (entries.nth_data (0));
    stdout.printf (&quot;Name: %s\n&quot;, app_info.get_name ());
    stdout.printf (&quot;Comment: %s\n&quot;, app_info.get_description ());
    stdout.printf (&quot;Exec: %s\n&quot;, app_info.get_commandline ());
    stdout.printf (&quot;Icon: %s\n&quot;, app_info.get_icon ().to_string ());
    return 0;
}
Compile and Run
valac --pkg gio-unix-2.0 --pkg libgnome-menu -o gnomemenusample GnomeMenuSample.vala -X &quot;-DGMENU_I_KNOW_THIS_IS_UNSTABLE&quot;
$ ./gnomemenusample Vala/Examples Projects/Vala/GnomeDesktopAndGMenuExample  (last edited 2013-11-22 16:48:31 by WilliamJonMcCann)
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
