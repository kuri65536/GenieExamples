Projects/Vala/GStreamerSample - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
Projects/Vala/GStreamerSampleHomeRecentChangesScheduleLogin
Vala GStreamer Audio Example
vala-test:examples/gstreamer-square-beep.vala using Gst;
void main (string[] args) {
    // Initializing GStreamer
    Gst.init (ref args);
    // Creating pipeline and elements
    var pipeline = new Pipeline ("test");
    var src = ElementFactory.make ("audiotestsrc", "my_src");
    var sink = ElementFactory.make ("autoaudiosink", "my_sink");
    // Adding elements to pipeline
    pipeline.add_many (src, sink);
    // Linking source to sink
    src.link (sink);
    // Setting waveform to square
    src.set ("wave", 1);
    // Set pipeline state to PLAYING
    pipeline.set_state (State.PLAYING);
    // Creating and starting a GLib main loop
    new MainLoop ().run ();
}
Tip: You can also declare a GStreamer Element as dynamic and set its properties directly:     dynamic Element src = ElementFactory.make ("audiotestsrc", "my_src");
    // ...
    src.wave = 1;
Compile and Run
$ valac --pkg gstreamer-0.10 gst-squarebeep.vala
$ ./gst-squarebeep
Vala GStreamer Audio Stream Example
vala-test:examples/gstreamer-audio-player.vala using Gst;
public class StreamPlayer {
    private MainLoop loop = new MainLoop ();
    private void foreach_tag (Gst.TagList list, string tag) {
        switch (tag) {
        case "title":
            string tag_string;
            list.get_string (tag, out tag_string);
            stdout.printf ("tag: %s = %s\n", tag, tag_string);
            break;
        default:
            break;
        }
    }
    private bool bus_callback (Gst.Bus bus, Gst.Message message) {
        switch (message.type) {
        case MessageType.ERROR:
            GLib.Error err;
            string debug;
            message.parse_error (out err, out debug);
            stdout.printf ("Error: %s\n", err.message);
            loop.quit ();
            break;
        case MessageType.EOS:
            stdout.printf ("end of stream\n");
            break;
        case MessageType.STATE_CHANGED:
            Gst.State oldstate;
            Gst.State newstate;
            Gst.State pending;
            message.parse_state_changed (out oldstate, out newstate,
                                         out pending);
            stdout.printf ("state changed: %s->%s:%s\n",
                           oldstate.to_string (), newstate.to_string (),
                           pending.to_string ());
            break;
        case MessageType.TAG:
            Gst.TagList tag_list;
            stdout.printf ("taglist found\n");
            message.parse_tag (out tag_list);
            tag_list.foreach ((TagForeachFunc) foreach_tag);
            break;
        default:
            break;
        }
        return true;
    }
    public void play (string stream) {
        dynamic Element play = ElementFactory.make ("playbin", "play");
        play.uri = stream;
        Bus bus = play.get_bus ();
        bus.add_watch (0, bus_callback);
        play.set_state (State.PLAYING);
        loop.run ();
    }
}
const string DEFAULT_STREAM = "http://streamer-dtc-aa02.somafm.com:80/stream/1018";
int main (string[] args) {
    Gst.init (ref args);
    var player = new StreamPlayer ();
    player.play (args.length > 1 ? args[1] : DEFAULT_STREAM);
    return 0;
}
Compile and Run
$ valac --pkg gstreamer-1.0 gst-play-stream.vala
$ ./gst-play-stream
Vala GStreamer Video Example
Requires gtk+-3.0 and gstreamer-1.0 (with gstreamer1.0-plugins-bad >= 1.7.91 for 'gtksink' element) vala-test:examples/gstreamer-videotest.vala using Gtk;
using Gst;
public class VideoSample : Window {
        Element playbin;
        construct {
                Widget video_area;
                playbin = ElementFactory.make ("playbin", "bin");
                playbin["uri"] = "http://www.w3schools.com/html/mov_bbb.mp4";
                var gtksink = ElementFactory.make ("gtksink", "sink");
                gtksink.get ("widget", out video_area);
                playbin["video-sink"] = gtksink;
                var vbox = new Box (Gtk.Orientation.VERTICAL, 0);
                vbox.pack_start (video_area);
                var play_button = new Button.from_icon_name ("media-playback-start", Gtk.IconSize.BUTTON);
                play_button.clicked.connect (on_play);
                var stop_button = new Button.from_icon_name ("media-playback-stop", Gtk.IconSize.BUTTON);
                stop_button.clicked.connect (on_stop);
                var quit_button = new Button.from_icon_name ("application-exit", Gtk.IconSize.BUTTON);
                quit_button.clicked.connect (Gtk.main_quit);
                var bb = new ButtonBox (Orientation.HORIZONTAL);
                bb.add (play_button);
                bb.add (stop_button);
                bb.add (quit_button);
                vbox.pack_start (bb, false);
                add (vbox);
        }
        void on_play() {
                playbin.set_state (Gst.State.PLAYING);
        }
        void on_stop() {
                playbin.set_state (Gst.State.READY);
        }
        public static int main (string[] args) {
                Gst.init (ref args);
                Gtk.init (ref args);
                var sample = new VideoSample ();
                sample.show_all ();
                Gtk.main ();
                return 0;
        }
}
Compile and Run
$ valac --pkg gtk+-3.0 --pkg gstreamer-1.0 gst-videotest.vala
$ ./gst-videotest
Vala Gstreamer-PocketSphinx Example
//# Copyright (c) 2008 Carnegie Mellon University.
//#
//# You may modify and redistribute this file under the same terms as
//# the CMU Sphinx system.  See
//# http://cmusphinx.sourceforge.net/html/LICENSE for more information.
// valac --pkg gstreamer-0.10 --pkg gtk+-2.0 shpinx_livedemo.vala
using Gtk;
using Gst;
public class DemoApp : GLib.Object {
    private Gtk.Window window;
    private Gtk.TextBuffer textbuf;
    private dynamic Gst.Element asr;
    private dynamic Gst.Pipeline pipeline;
    private Gst.Element vader;
    private Gtk.TextView text;
    private Gtk.ToggleButton button;
    ////GStreamer/PocketSphinx Demo Application//
    public DemoApp() {
        ////Initialize a DemoApp object//
        this.init_gui();
        this.init_gst();
    }
    private void init_gui() {
        ////Initialize the GUI components//
        this.window = new Gtk.Window();
        this.window.delete_event.connect( () => { Gtk.main_quit(); return false; });
        this.window.set_default_size(400,200);
        this.window.set_border_width(10);
        var vbox        = new Gtk.VBox(false, 0);
        this.textbuf    = new Gtk.TextBuffer(null);
        text            = new Gtk.TextView.with_buffer(this.textbuf);
        text.set_wrap_mode(WrapMode.WORD);
        vbox.pack_start(text, true, true, 0);
        button = new Gtk.ToggleButton.with_label("Speak");
        button.clicked.connect(this.button_clicked);
        vbox.pack_start(button, false, false, 5);
        this.window.add(vbox);
        this.window.show_all();
    }
    private void init_gst() {
        ////Initialize the speech components//
        try {
            this.pipeline =
            (Gst.Pipeline) Gst.parse_launch("gconfaudiosrc ! audioconvert ! audioresample ! vader name=vad auto-threshold=true ! pocketsphinx name=asr !                      fakesink");
        }
        catch(Error e) {
            print("%s\n", e.message);
        }
        this.asr = this.pipeline.get_by_name("asr");
        this.asr.partial_result.connect(this.asr_partial_result);
        this.asr.result.connect(this.asr_result);
        this.asr.set_property("configured", true);
        var bus = this.pipeline.get_bus();
        bus.add_signal_watch();
        bus.message.connect(this.application_message);
//        bus.message.connect(this.application_message);
        this.pipeline.set_state(Gst.State.PAUSED);
    }
    private void asr_partial_result(Gst.Element sender, string text, string uttid) {
        //Forward partial result signals on the bus to the main thread.//
        var gststruct = new Gst.Structure.empty("partial_result");
        gststruct.set_value("hyp", text);
        gststruct.set_value("uttid", uttid);
        asr.post_message(new Gst.Message.application(this.asr, gststruct));
    }
    private void asr_result(Gst.Element sender, string text, string uttid) {
        //Forward result signals on the bus to the main thread.//
        var gststruct = new Gst.Structure.empty("result");
        gststruct.set_value("hyp", text);
        gststruct.set_value("uttid", uttid);
        asr.post_message(new Gst.Message.application(this.asr, gststruct));
    }
    private void application_message(Gst.Bus bus, Gst.Message msg) {
        //Receive application messages from the bus.//
        if(msg.type != Gst.MessageType.APPLICATION)
            return;
        if(msg.get_structure() == null)
            return;
        string msgtype = msg.get_structure().get_name();
        if(msgtype == "partial_result") {
            GLib.Value hy = msg.get_structure().get_value("hyp");
            GLib.Value ut = msg.get_structure().get_value("uttid");
            this.partial_result(hy, ut);
        }
        else if(msgtype == "result") {
            GLib.Value hy = msg.get_structure().get_value("hyp");
            GLib.Value ut = msg.get_structure().get_value("uttid");
            this.final_result(hy, ut);
            this.pipeline.set_state(Gst.State.PAUSED);
            this.button.set_active(false);
        }
    }
    private void partial_result(GLib.Value hyp, GLib.Value uttid) {
        //Delete any previous selection, insert text and select it.//
        // All this stuff appears as one single action
        this.textbuf.begin_user_action();
        this.textbuf.delete_selection(true, this.text.get_editable());
        this.textbuf.insert_at_cursor((string)hyp, ((string)hyp).length);
        var ins     = this.textbuf.get_insert();
        Gtk.TextIter iter;
        this.textbuf.get_iter_at_mark(out iter, ins);
//        var iter    = this.textbuf.get_iter_at_mark(ins);
        iter.backward_chars(((string)hyp).length);
        this.textbuf.move_mark(ins, iter);
        this.textbuf.end_user_action();
    }
    private void final_result(GLib.Value hyp, GLib.Value uttid) {
        //Insert the final result.//
        // All this stuff appears as one single action
        this.textbuf.begin_user_action();
        this.textbuf.delete_selection(true, this.text.get_editable());
        this.textbuf.insert_at_cursor(((string)hyp), ((string)hyp).length);
        this.textbuf.end_user_action();
    }
    private void button_clicked(Gtk.Widget sender) {
        //Handle button presses.//
        if(((ToggleButton)sender).get_active()) {
            ((ToggleButton)sender).set_label("Stop");
            this.pipeline.set_state(Gst.State.PLAYING);
        }
        else {
            ((ToggleButton)sender).set_label("Speak");
            vader = this.pipeline.get_by_name("vad");
            vader.set_property("silent", true);
        }
    }
}
void main(string[] args) {
    Gtk.init(ref args);
    Gst.init(ref args);
    var app = new DemoApp();
    Gtk.main();
}
Compile and run
valac --pkg gstreamer-0.10 --pkg gtk+-2.0 shpinx_livedemo.vala
./sphinx_livedemo Vala/Examples Projects/Vala/GStreamerSample  (last edited 2016-04-14 10:36:32 by YannickInizan)
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
