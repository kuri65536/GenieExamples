# Projects/Vala/PulseAudioSamples - GNOME Wiki!

## Vala PulseAudio playback Example
This is a simple test example using pulseaudio's asynchronous API.  It opens a
connection to the audio device and plays a sine wave.  Notice that you have to
check the state on a context to see that it is ready BEFORE attempting to do
stream.connect_playback(); Get the libpulse vapi's at http://www.pulseaudio.org/
or using:

```
$ git clone git://git.0pointer.de/pulseaudio.git
$ valac --pkg libpulse --pkg posix --pkg gtk+-2.0 \
    --pkg libpulse-mainloop-glib pulse.vala
```

```genie
[indent=4]
uses PulseAudio

class AudioDevice: GLib.Object
    loop: PulseAudio.GLibMainLoop;
    context: PulseAudio.Context
    cflags: Context.Flags
    spec: PulseAudio.SampleSpec
    attr: PulseAudio.Stream.BufferAttr
    m_amp: double =0.3
    m_freq: double = 500
    m_time: ulong = 0
    twopi_over_sr: double

    construct()
        GLib.Object();
    // construct {  // vala code was separated constructor and construct
        this.spec = PulseAudio.SampleSpec() {
            format = PulseAudio.SampleFormat.S16LE,
            channels = 2,
            rate =  44100
        };
        twopi_over_sr = (2.0 * Math.PI) / (double)spec.rate;

    def start()
        this.loop = new PulseAudio.GLibMainLoop(); // there are other loops that can be used if you are not using glib/gtk main
        this.context = new PulseAudio.Context(loop.get_api(), null);
        this.cflags = Context.Flags.NOFAIL;
        this.context.set_state_callback(this.cstate_cb);
        // Connect the context
        if this.context.connect(null, this.cflags, null) < 0
            print("pa_context_connect() failed: %s\n",
                  PulseAudio.strerror(context.errno()));

    def stream_over_cb(stream: Stream)
        print("AudioDevice: stream overflow...\n");

    def stream_under_cb(stream: Stream)
        print("AudioDevice: stream underflow...\n");

    // this is main callback that will be called when audio data is needed
    // I assume the data is interleaved for each audio channel, but don't know for sure
    def write_cb(stream: Stream, nbytes: size_t)
        /* If you are curious to see what is in an attr
        Stream.BufferAttr attr = stream.get_buffer_attr();
        print("attr.maxlength:%u, tlength:%u, prebuf:%u, minreq:%u, fragsize:%u\n",
                        attr.maxlength,
                        attr.tlength,
                        attr.prebuf,
                        attr.minreq,
                        attr.fragsize);
                */
        var len = (uint)(nbytes / sizeof(int16));
        var data = new array of int16[len]
        // white noise generator
        //for (int i=0;i<len;i++) {
        //      data[i]= (int16)Random.int_range (-32768, 32767);
        //}
        // sine wave generator
        var samps = 0
        var i = 0
        while i < len
            var val = (int16)(32767.0 * m_amp * Math.sin(
                m_freq * m_time  * twopi_over_sr));
            var j = 0
            while j < spec.channels
                data[i + j] = val
                samps++;
                j++
            this.m_time++;
            i += spec.channels

        // write to the device here with our data
        stream.write((void *)data, sizeof(int16) * data.length);

    // state callback, don't connect_playback until we are ready here.
    def cstate_cb(context: Context)
        var state = context.get_state();
        case state
            when Context.State.UNCONNECTED
                print("state UNCONNECTED\n")
                return
            when Context.State.CONNECTING
                print("state CONNECTING\n")
                return
            when Context.State.AUTHORIZING
                print("state AUTHORIZING,\n")
                return
            when Context.State.SETTING_NAME
                print("state SETTING_NAME\n")
                return
            when Context.State.FAILED
                print("state FAILED,\n")
                return
            when Context.State.TERMINATED
                print("state TERMINATED\n")
                return
            when Context.State.READY
                print("state READY\n")
            default
                return

        // when Context.State.READY
        this.attr = PulseAudio.Stream.BufferAttr();
        fragment_size: size_t =0
        n_fragments: size_t = 0
        var flags = Stream.Flags.INTERPOLATE_TIMING \
                    | Stream.Flags.AUTO_TIMING_UPDATE \
                    | Stream.Flags.EARLY_REQUESTS
        var stream = new PulseAudio.Stream(context, "", this.spec)
        stream.set_write_callback(write_cb);
        stream.set_overflow_callback(this.stream_over_cb);
        stream.set_underflow_callback(this.stream_over_cb);
        fs: size_t = spec.frame_size();
        // Don't fix things more than necessary
        if (fragment_size % fs) == 0 and n_fragments >= 2 \
           and fragment_size > 0
            print("something went wrong\n");
            return ;
        // Number of fragments set?
        if n_fragments < 2
            if fragment_size > 0
                n_fragments = (spec.bytes_per_second() / 2 / fragment_size);
                if (n_fragments < 2)
                    n_fragments = 2;
            else
                n_fragments = 12;
        // Fragment size set?
        if fragment_size <= 0
            fragment_size = spec.bytes_per_second() / 2 / n_fragments;
            if (fragment_size < 1024)
                fragment_size = 1024;
        print("fragment_size: %s, n_fragments: %s, fs: %s\n", fragment_size.to_string(), n_fragments.to_string(), fs.to_string());
        attr.maxlength = (uint32) (fragment_size * (n_fragments+1));
        attr.tlength = (uint32) (fragment_size * n_fragments);
        attr.prebuf = (uint32) fragment_size;
        attr.minreq = (uint32) fragment_size;
        var tmp = stream.connect_playback(null, attr, flags, null, null)
        if tmp < 0
            print("connect_playback returned %s\n", tmp.to_string());
            print(": pa_stream_connect_playback() failed: %s\n", PulseAudio.strerror(context.errno() ));

init  // (string[] args) {
    Gtk.init (ref args);
    var adev = new AudioDevice();
    adev.start();
    Gtk.main ();
```

### Compile and Run

```shell
$ valac --pkg=libpulse --pkg=posix --pkg=gtk+-2.0 \
    --pkg=libpulse-mainloop-glib pulse.vala
```

Vala/Examples Projects/Vala/PulseAudioSamples
    (last edited 2013-11-22 16:48:28 by WilliamJonMcCann)
