Projects/Vala/GIOCompressionSample - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
Projects/Vala/GIOCompressionSampleHomeRecentChangesScheduleLogin
GIO Compression Sample
Deflate and inflate a file in gzip format. Requires GLib/GIO &gt;= 2.24 vala-test:examples/gio-compression.vala const ZlibCompressorFormat FORMAT = ZlibCompressorFormat.GZIP;
void compress (File source, File dest) throws Error {
    convert (source, dest, new ZlibCompressor (FORMAT));
}
void decompress (File source, File dest) throws Error {
    convert (source, dest, new ZlibDecompressor (FORMAT));
}
void convert (File source, File dest, Converter converter) throws Error {
    var src_stream = source.read ();
    var dst_stream = dest.replace (null, false, 0);
    var conv_stream = new ConverterOutputStream (dst_stream, converter);
    // 'splice' pumps all data from an InputStream to an OutputStream
    conv_stream.splice (src_stream, 0);
}
int main (string[] args) {
    if (args.length &lt; 2) {
        stdout.printf (&quot;Usage: %s FILE\n&quot;, args[0]);
        return 0;
    }
    var infile = File.new_for_commandline_arg (args[1]);
    if (!infile.query_exists ()) {
        stderr.printf (&quot;File '%s' does not exist.\n&quot;, args[1]);
        return 1;
    }
    var zipfile = File.new_for_commandline_arg (args[1] + &quot;.gz&quot;);
    var outfile = File.new_for_commandline_arg (args[1] + &quot;_out&quot;);
    try {
        compress (infile, zipfile);
        decompress (zipfile, outfile);
    } catch (Error e) {
        stderr.printf (&quot;%s\n&quot;, e.message);
        return 1;
    }
    return 0;
}
Compile
$ valac --pkg gio-2.0 gio-compression.vala
$ ./gio-compression FILENAME Vala/Examples Projects/Vala/GIOCompressionSample  (last edited 2013-11-22 16:48:30 by WilliamJonMcCann)
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
