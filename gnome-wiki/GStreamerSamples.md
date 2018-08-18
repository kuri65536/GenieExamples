Projects/Vala/GStreamerSamples - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
Projects/Vala/GStreamerSamplesHomeRecentChangesScheduleLogin
Vala GStreamer Samples
GstDiscoverer
Requires Vala &gt;= 0.10.2 vala-test:examples/gstreamer-discoverer.vala /* GStreamer
 * Copyright (C) 2009 Collabora Multimedia
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Library General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Library General Public License for more details.
 *
 * You should have received a copy of the GNU Library General Public
 * License along with this library; if not, write to the
 * Free Software Foundation, Inc., 59 Temple Place - Suite 330,
 * Boston, MA 02111-1307, USA.
 */
using Gst;
struct Globals {
        static Quark _INFORMATION_QUARK;
        static Quark _STREAMS_QUARK;
        static Quark _CAPS_QUARK;
        static Quark _TAGS_QUARK;
        static Quark _STREAM_TYPE_QUARK;
        static Quark _DURATION_QUARK;
        static Discoverer d;
        static string[] args;
        static int tab;
        static bool asynch;
        static bool silent;
        static bool verbose;
        static uint64 timeout;
        public static const OptionEntry[] options = {
                { &quot;async&quot;, 'a', 0, OptionArg.NONE, ref Globals.asynch,
                        &quot;Run asynchronously&quot;, null },
                {&quot;silent&quot;, 's', 0, OptionArg.NONE, ref Globals.silent,
                        &quot;Don't output the information structure&quot;, null},
                {&quot;verbose&quot;, 'v', 0, OptionArg.NONE, ref Globals.verbose,
                        &quot;Verbose properties&quot;, null},
                { &quot;timeout&quot;, 't', 0, OptionArg.INT, ref Globals.timeout,
                        &quot;Specify timeout (in seconds, default 10)&quot;, &quot;T&quot; },
                { null }
        };
}
private void init()
{
        Globals._INFORMATION_QUARK      = Quark.from_string(&quot;information&quot;);
        Globals._STREAMS_QUARK          = Quark.from_string(&quot;streams&quot;);
        Globals._CAPS_QUARK             = Quark.from_string(&quot;caps&quot;);
        Globals._TAGS_QUARK             = Quark.from_string(&quot;tags&quot;);
        Globals._STREAM_TYPE_QUARK      = Quark.from_string(&quot;stream-type&quot;);
        Globals._DURATION_QUARK         = Quark.from_string(&quot;duration&quot;);
}
static string
gst_stream_audio_information_to_string(Gst.DiscovererAudioInfo info)
{
        StringBuilder s = new StringBuilder();
        if (info == null)
                return (string)null;
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;Codec:\n&quot;);
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;  %s\n&quot;, info.get_caps().to_string());
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;Additional info:\n&quot;);
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        if (info.get_misc() != null) {
                s.append_printf (&quot;  %s\n&quot;, info.get_misc().to_string());
        } else {
                s.append_printf (&quot;  None\n&quot;);
        }
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;Channels: %u\n&quot;, info.get_channels());
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;Sample rate: %u\n&quot;, info.get_sample_rate());
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;Depth: %u\n&quot;, info.get_depth());
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;Bitrate: %u\n&quot;, info.get_bitrate());
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;Max bitrate: %u\n&quot;, info.get_max_bitrate());
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;Tags:\n&quot;);
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        if (info.get_tags() != null) {
                s.append_printf (&quot;  %s\n&quot;,
                        ((Gst.Structure)info.get_tags()).to_string());
        } else {
                s.append_printf (&quot;  None\n&quot;);
        }
        return s.str;
}
static string
gst_stream_video_information_to_string (Gst.DiscovererVideoInfo info)
{
        StringBuilder s = new StringBuilder();
        if (info == null)
                return (string)null;
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;Codec:\n&quot;);
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;  %s\n&quot;, info.get_caps().to_string());
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;Additional info:\n&quot;);
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        if (info.get_misc() != null) {
                s.append_printf (&quot;  %s\n&quot;, info.get_misc().to_string());
        } else {
                s.append_printf (&quot;  None\n&quot;);
        }
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;Width: %u\n&quot;, info.get_width());
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;Height: %u\n&quot;, info.get_height());
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;Depth: %u\n&quot;, info.get_depth());
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;Frame rate: %u/%u\n&quot;,
                info.get_framerate_num(),
                info.get_framerate_denom());
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;Pixel aspect ratio: %u/%u\n&quot;,
                info.get_par_num(),
                info.get_par_denom());
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;Interlaced: %s\n&quot;,
                        info.is_interlaced() ? &quot;true&quot; : &quot;false&quot;);
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;Bitrate: %u\n&quot;, info.get_bitrate());
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;Max bitrate: %u\n&quot;, info.get_max_bitrate());
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        s.append_printf (&quot;Tags:\n&quot;);
        s.append_printf (&quot;%*s&quot;, 2*Globals.tab, &quot; &quot;);
        if (info.get_tags() != null) {
                s.append_printf (&quot;  %s\n&quot;,
                        ((Gst.Structure)info.get_tags()).to_string());
        } else {
                s.append_printf (&quot;  None\n&quot;);
        }
        return s.str;
}
private void print_tabs()
{
        for (int i = 0; i &lt; 2*Globals.tab; i++)
                stdout.printf(&quot; &quot;);
}
private void print_stream_info(DiscovererStreamInfo info)
{
        string desc = null;
        if (info.get_caps() != null) {
                if (info.get_caps().is_fixed() &amp;&amp; !Globals.verbose)
                        desc = pb_utils_get_codec_description(info.get_caps());
                else
                        desc = info.get_caps().to_string();
        }
        print_tabs();
        stdout.printf(&quot;%s: %s\n&quot;, info.get_stream_type_nick(),
                desc);
        if (desc != null)
                free(desc);
        if (Globals.verbose) {
                if (info is DiscovererAudioInfo) {
                        Globals.tab++;
                        stdout.printf(&quot;%s&quot;,
                                gst_stream_audio_information_to_string(
                                        (DiscovererAudioInfo)info));
                        Globals.tab--;
                } else if (info is DiscovererVideoInfo) {
                        Globals.tab++;
                        stdout.printf(&quot;%s&quot;,
                                gst_stream_video_information_to_string(
                                        (DiscovererVideoInfo)info));
                        Globals.tab--;
                }
        }
        stdout.printf(&quot;\n&quot;);
}
private void print_topology(DiscovererStreamInfo info)
{
        print_stream_info (info);
        if (info.get_next() != null) {
                Globals.tab++;
                print_topology(info.get_next());
                Globals.tab--;
        } else if (info is DiscovererContainerInfo) {
                GLib.List&lt;DiscovererStreamInfo&gt; l =
                        (GLib.List&lt;DiscovererStreamInfo&gt;)((DiscovererContainerInfo)info).get_streams();
                unowned GLib.List&lt;DiscovererStreamInfo&gt; t;
                for (t = l; t != null; t = t.next) {
                        Globals.tab++;
                        print_topology(t.data);
                        Globals.tab--;
                }
        }
}
private void print_list(Gst.DiscovererInfo info)
{
        foreach (Gst.DiscovererStreamInfo i in info.get_stream_list())
                print_stream_info(i);
}
private void print_info(Gst.DiscovererInfo info)
{
        stdout.printf(&quot;Done discovering %s\n&quot;, info.get_uri());
        if (info != null) {
                stdout.printf (&quot;\nTopology:\n&quot;);
                print_topology(info.get_stream_info());
                if (!Globals.silent) {
                        stdout.printf(&quot;\nStream list:\n&quot;);
                        print_list(info);
                        stdout.printf(&quot;\nDuration:\n&quot;);
                        print_tabs();
                        stdout.printf(Gst.TIME_FORMAT + &quot;\n&quot;,
                                        info.get_duration().args());
                }
        }
        stdout.printf(&quot;\n&quot;);
}
private void on_discovered(Gst.DiscovererInfo info, GLib.Error err)
{
        print_info(info);
}
static void process_file (string filename)
{
        string uri, path;
        if (!Gst.uri_is_valid (filename)) {
                try {
                        GLib.Dir dir = GLib.Dir.open (filename);
                        if (dir != null) {
                                unowned string entry;
                                while ((entry = dir.read_name()) != null) {
                                        process_file (GLib.Path.build_filename
                                                                (filename,
                                                                entry));
                                }
                                return;
                        }
                } catch (Error e) {
                        /* Pass-through */
                }
                if (!GLib.Path.is_absolute(filename)) {
                        string cur_dir = GLib.Environment.get_current_dir();
                        path = GLib.Path.build_filename (cur_dir, filename);
                } else {
                        path = filename;
                }
                try {
                        uri = GLib.Filename.to_uri(path);
                } catch (Error e) {
                        stdout.printf(&quot;Couldn't convert filename to URI:%s\n&quot;,
                                      e.message);
                        return;
                }
        } else {
                uri = filename;
        }
        if (Globals.asynch) {
                Globals.d.discover_uri_async(uri);
        } else {
                DiscovererInfo info;
                stdout.printf(&quot;Analyzing %s\n&quot;, uri);
                try {
                        info = Globals.d.discover_uri(uri);
                        print_info(info);
                } catch (Error e) {
                        stderr.printf(&quot;Error: %s\n&quot;, e.message);
                }
        }
}
private bool run()
{
        for (int i = 1; i &lt; Globals.args.length; i++) {
                process_file(Globals.args[i]);
        }
        return false;
}
public int main(string[] argv)
{
        MainLoop loop = new MainLoop(null, false);
        OptionContext ctx = new OptionContext(&quot;- discover files with GstDiscoverer using Vala bindings&quot;);
        Globals.timeout = 10;
        Globals.asynch = false;
        Globals.tab = 1;
        ctx.add_main_entries(Globals.options, null);
        ctx.add_group(Gst.init_get_option_group());
        if (argv.length &lt; 2) {
                stderr.printf(&quot;Error: you need to specify at least 1 URI\n&quot;);
                return -1;
        }
        init();
        try {
                ctx.parse(ref argv);
        } catch (Error e) {
                stderr.printf(&quot;Error initializing: %s\n&quot;, e.message);
        }
        Globals.d = new Discoverer((ClockTime)(Globals.timeout*Gst.SECOND));
        Globals.args = argv;
        if (Globals.asynch) {
                Idle.add(run);
                Globals.d.discovered.connect(on_discovered);
                Globals.d.finished.connect(loop.quit);
                Globals.d.start();
                loop.run();
                Globals.d.stop();
        } else {
                run();
        }
        return 0;
}
$ valac --pkg gstreamer-pbutils-0.10 gstreamer-discoverer.vala
$ ./gstreamer-discoverer &lt;uris&gt; Vala/Examples Projects/Vala/GStreamerSamples  (last edited 2013-11-22 16:48:29 by WilliamJonMcCann)
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
