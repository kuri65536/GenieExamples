# Projects/Vala/GStreamerSamples - GNOME Wiki!
# Genie GStreamer Samples

## GstDiscoverer
Requires Vala >= 0.10.2

```genie
// vala-test:examples/gstreamer-discoverer.vala
/* GStreamer
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
[indent=4]
uses Gst

struct Globals
    _INFORMATION_QUARK: static Quark
    _STREAMS_QUARK: static Quark
    _CAPS_QUARK: static Quark
    _TAGS_QUARK: static Quark
    _STREAM_TYPE_QUARK: static Quark
    _DURATION_QUARK: static Quark
    d: static Discoverer
    args: static array of string
    tab: static int
    asynch: static bool
    silent: static bool
    verbose: static bool
    timeout: static uint64
    const options: array of OptionEntry = {
            {"async", 'a', 0, OptionArg.NONE, ref Globals.asynch,
                    "Run asynchronously", null},
            {"silent", 's', 0, OptionArg.NONE, ref Globals.silent,
                    "Don't output the information structure", null},
            {"verbose", 'v', 0, OptionArg.NONE, ref Globals.verbose,
                    "Verbose properties", null},
            { "timeout", 't', 0, OptionArg.INT, ref Globals.timeout,
                    "Specify timeout (in seconds, default 10)", "T" },
            { null }
    };

    def static init()
        Globals._INFORMATION_QUARK      = Quark.from_string("information");
        Globals._STREAMS_QUARK          = Quark.from_string("streams");
        Globals._CAPS_QUARK             = Quark.from_string("caps");
        Globals._TAGS_QUARK             = Quark.from_string("tags");
        Globals._STREAM_TYPE_QUARK      = Quark.from_string("stream-type");
        Globals._DURATION_QUARK         = Quark.from_string("duration");

def static gst_stream_audio_information_to_string(
        info: Gst.DiscovererAudioInfo): string
    var s = new StringBuilder()
    if info == null
        return (string)null;
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("Codec:\n");
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("  %s\n", info.get_caps().to_string());
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("Additional info:\n");
    s.append_printf ("%*s", 2*Globals.tab, " ");
    if info.get_misc() != null
        s.append_printf ("  %s\n", info.get_misc().to_string());
    else
        s.append_printf ("  None\n");
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("Channels: %u\n", info.get_channels());
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("Sample rate: %u\n", info.get_sample_rate());
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("Depth: %u\n", info.get_depth());
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("Bitrate: %u\n", info.get_bitrate());
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("Max bitrate: %u\n", info.get_max_bitrate());
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("Tags:\n");
    s.append_printf ("%*s", 2*Globals.tab, " ");
    if info.get_tags() != null
        s.append_printf ("  %s\n",
                ((Gst.Structure)info.get_tags()).to_string());
    else
        s.append_printf ("  None\n");
    return s.str;

def static gst_stream_video_information_to_string(
            info: Gst.DiscovererVideoInfo): string?
    var s = new StringBuilder()
    if info == null
        return (string)null;
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("Codec:\n");
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("  %s\n", info.get_caps().to_string());
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("Additional info:\n");
    s.append_printf ("%*s", 2*Globals.tab, " ");
    if info.get_misc() != null
        s.append_printf ("  %s\n", info.get_misc().to_string());
    else
        s.append_printf ("  None\n");
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("Width: %u\n", info.get_width());
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("Height: %u\n", info.get_height());
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("Depth: %u\n", info.get_depth());
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("Frame rate: %u/%u\n",
            info.get_framerate_num(),
            info.get_framerate_denom());
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("Pixel aspect ratio: %u/%u\n",
            info.get_par_num(),
            info.get_par_denom());
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("Interlaced: %s\n",
                    info.is_interlaced() ? "true" : "false");
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("Bitrate: %u\n", info.get_bitrate());
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("Max bitrate: %u\n", info.get_max_bitrate());
    s.append_printf ("%*s", 2*Globals.tab, " ");
    s.append_printf ("Tags:\n");
    s.append_printf ("%*s", 2*Globals.tab, " ");
    if info.get_tags() != null
        s.append_printf ("  %s\n",
                    ((Gst.Structure)info.get_tags()).to_string());
    else
        s.append_printf ("  None\n");
    return s.str;

def print_tabs()
    var i = 0
    while i < 2 * Globals.tab
        stdout.printf(" ");
        i += 1

def print_stream_info(info: DiscovererStreamInfo)
    desc: string? = null
    if info.get_caps() != null
        if info.get_caps().is_fixed() and !Globals.verbose
            desc = pb_utils_get_codec_description(info.get_caps());
        else
            desc = info.get_caps().to_string();
    print_tabs();
    stdout.printf("%s: %s\n", info.get_stream_type_nick(),
            desc);
    if desc != null
        free(desc);
    if Globals.verbose
        if info isa DiscovererAudioInfo
            Globals.tab++;
            stdout.printf("%s",
                            gst_stream_audio_information_to_string(
                                    (DiscovererAudioInfo)info));
            Globals.tab--;
        else if info isa DiscovererVideoInfo
            Globals.tab++;
            stdout.printf("%s",
                            gst_stream_video_information_to_string(
                                    (DiscovererVideoInfo)info));
            Globals.tab--;
    stdout.printf("\n");

def print_topology(info: DiscovererStreamInfo)
    print_stream_info (info);
    if info.get_next() != null
        Globals.tab++;
        print_topology(info.get_next());
        Globals.tab--;
    else if info isa DiscovererContainerInfo
        var l = (list of DiscovererStreamInfo)(((DiscovererContainerInfo)info).get_streams());
        for t in l
            Globals.tab++;
            print_topology(t)
            Globals.tab--;

def print_list(info: Gst.DiscovererInfo)
    for i in info.get_stream_list()
        print_stream_info(i);

def print_info(info: Gst.DiscovererInfo)
    stdout.printf("Done discovering %s\n", info.get_uri());
    if info != null
        stdout.printf ("\nTopology:\n");
        print_topology(info.get_stream_info());
        if !Globals.silent
            stdout.printf("\nStream list:\n");
            print_list(info);
            stdout.printf("\nDuration:\n");
            print_tabs();
            stdout.printf(Gst.TIME_FORMAT + "\n",
                            info.get_duration().args());
    stdout.printf("\n");

def on_discovered(info: Gst.DiscovererInfo, err: GLib.Error)
    print_info(info);

def static process_file(filename: string)
    uri: string
    path: string
    if !Gst.uri_is_valid (filename)
        try
            var dir = GLib.Dir.open(filename)
            if dir != null
                entry: unowned string = dir.read_name()
                while entry != null
                    process_file (GLib.Path.build_filename
                                            (filename,
                                            entry));
                    entry = dir.read_name()
                return;
        except e: Error
            /* Pass-through */
            pass
        if !GLib.Path.is_absolute(filename)
            var cur_dir = GLib.Environment.get_current_dir();
            path = GLib.Path.build_filename (cur_dir, filename);
        else
            path = filename;
        try
            uri = GLib.Filename.to_uri(path);
        except e: Error
            stdout.printf("Couldn't convert filename to URI:%s\n",
                          e.message);
            return;
    else
        uri = filename;
    if Globals.asynch
        Globals.d.discover_uri_async(uri);
    else
        stdout.printf("Analyzing %s\n", uri);
        try
            var info = Globals.d.discover_uri(uri);
            print_info(info);
        except e: Error
            stderr.printf("Error: %s\n", e.message);

def run(): bool
    var i = 1
    while i < Globals.args.length
        process_file(Globals.args[i]);
        i += 1
    return false;

init  // args[]
    var loop = new MainLoop(null, false);
    var ctx = new OptionContext(
        "- discover files with GstDiscoverer using Genie bindings");
    Globals.timeout = 10;
    Globals.asynch = false;
    Globals.tab = 1;
    ctx.add_main_entries(Globals.options, null);
    ctx.add_group(Gst.init_get_option_group());
    if args.length < 2
        stderr.printf("Error: you need to specify at least 1 URI\n");
        return  // -1;
    Globals.init()
    try
        ctx.parse(ref args);
    except e: Error
        stderr.printf("Error initializing: %s\n", e.message);
    Globals.d = new Discoverer((ClockTime)(Globals.timeout*Gst.SECOND));
    Globals.args = args;
    if Globals.asynch
        Idle.add(run);
        Globals.d.discovered.connect(on_discovered);
        Globals.d.finished.connect(loop.quit);
        Globals.d.start();
        loop.run();
        Globals.d.stop();
    else
        run();
    // TODO(shimoda): return 0; in init()
```

```shell
$ valac --pkg=gstreamer-pbutils-0.10 --pkg=gee-0.8 gstreamer-discoverer.gs
$ ./gstreamer-discoverer <uris>
```

Vala/Examples Projects/Vala/GStreamerSamples
    (last edited 2013-11-22 16:48:29 by WilliamJonMcCann)
