Projects/Vala/IoChannelsSample - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
Projects/Vala/IoChannelsSampleHomeRecentChangesScheduleLogin
Using gio's IO channels to communicate through pipes
Vala port of example from http://www.linuxjournal.com/article/8545 Complete and working console application that uses IO channels to communicate across two pipes. The example will continuously read and write and spam your console.  You can stop the program via &lt;Ctrl&gt;-C. vala-test:examples/gio-channel.vala public class PipeTalker : Object {
        // reading callback
        private bool gio_in(IOChannel gio, IOCondition condition) {
                IOStatus ret;
                string msg;
                size_t len;
                if((condition &amp; IOCondition.HUP) == IOCondition.HUP)
                        print(&quot;Read end of pipe died!\n&quot;);
                try {
                        ret = gio.read_line(out msg, out len, null);
                }
                catch(IOChannelError e) {
                        print(&quot;Error reading: %s\n&quot;, e.message);
                }
                catch(ConvertError e) {
                        print(&quot;Error reading: %s\n&quot;, e.message);
                }
                print(&quot;Read %u bytes: %s\n&quot;, (uint)len, msg);
                return true;
        }
        // writing callback
        private bool gio_out(IOChannel gio, IOCondition condition) {
                string msg = &quot;The price of greatness is responsibility.\n&quot;;
                IOStatus ret;
                size_t len;
                if((condition &amp; IOCondition.HUP) == IOCondition.HUP)
                        print(&quot;Write end of pipe died!\n&quot;);
                try {
                        ret = gio.write_chars((char[])msg, out len);
                }
                catch(IOChannelError e) {
                        print(&quot;Error writing: %s\n&quot;, e.message);
                }
                catch(ConvertError e) {
                        print(&quot;Error writing: %s\n&quot;, e.message);
                }
                print(&quot;Wrote %u bytes.\n&quot;, (uint)len);
                return true;
        }
        public void init_channels() {
                IOChannel io_read, io_write;
                int[] fd = new int[2]; // file descriptor
                int ret;
                // setup a pipe
                ret = Posix.pipe(fd);
                if(ret == -1) {
                        print(&quot;Creating pipe failed: %s\n&quot;, strerror(errno));
                        return;
                }
                // setup iochannels
                io_read  = new IOChannel.unix_new(fd[0]);
                io_write = new IOChannel.unix_new(fd[1]);
                if((io_read == null) || (io_write == null)) {
                        print(&quot;Cannot create new IOChannel!\n&quot;);
                        return;
                }
                // The watch calls the gio_in function, if there data is available for 
                // reading without locking
                if(!(io_read.add_watch(IOCondition.IN | IOCondition.HUP, gio_in) != 0)) {
                        print(&quot;Cannot add watch on IOChannel!\n&quot;);
                        return;
                }
                // The watch calls the gio_out function if there data is available for 
                // writing without locking
                if(!(io_write.add_watch(IOCondition.OUT | IOCondition.HUP, gio_out) != 0)) {
                        print(&quot;Cannot add watch on IOChannel!\n&quot;);
                        return;
                }
        }
        public static int main() {
                var loop = new MainLoop(null, false);
                var pt = new PipeTalker();
                pt.init_channels();
                loop.run();
                return 0;
        }
}
Compile and Run
$ valac --pkg posix giochanneltest.vala
$ ./giochanneltest Vala/Examples Projects/Vala/IoChannelsSample  (last edited 2013-11-22 16:48:31 by WilliamJonMcCann)
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
