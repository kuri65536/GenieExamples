Projects/Vala/GSFSample - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
Projects/Vala/GSFSampleHomeRecentChangesScheduleLogin
Vala GSF Samples
ZIP Archive decompression
This sample shows usage of LibGSF to deflate a ZIP archive.  Requires Vala 0.8.0 &amp; LibGSF 1.14.17 vala-test:examples/gsf-sample.vala int main () {
        // declare objects
        Gsf.InputStdio file;
        Gsf.InfileZip zipfile;
        Gsf.OutfileStdio folder;
        // load the ZIP file
    try { file = new Gsf.InputStdio ("myarchive.zip"); }
    catch { stderr.printf ("File \"myarchive.zip\" not found");
            return 1; }
        //
    try { zipfile = new Gsf.InfileZip (file); }
    catch { stderr.printf ("Not a ZIP file");
            return 1; }
        // create the destination directory
    try { folder = new Gsf.OutfileStdio ("myarchive"); }
    catch { stderr.printf ("Cannot write to current directory");
            return 1; }
        // get the number of root items in the archive
        // and iterate through them, writing each one
        // to the destination directory
    int num_items = zipfile.num_children ();
    for (int i = 0; i < num_items; i++)
    {
        var item = zipfile.child_by_index (i);
        var itemfile = Gsf.StructuredBlob.read (item);
        itemfile.write (folder);
    }
    return 0;
}
Compile and Run
Put a zip archive named "myarchive.zip" in current folder and : $ valac --pkg libgsf-1 gsf-sample.vala
$ ./gsf-sample Vala/Examples Projects/Vala/GSFSample  (last edited 2013-11-22 16:48:26 by WilliamJonMcCann)
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
