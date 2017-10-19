[indent=4]

uses
    SDL
    SDLGraphics

class SDLSample: Object
    const SCREEN_WIDTH: int = 640
    const SCREEN_HEIGHT: int = 480
    const SCREEN_BPP: int = 32
    const DELAY: int = 10

    // prop screen: weak Video.Window;
    window: Video.Window
    render: Video.Renderer
    prop rand: weak GLib.Rand;
    prop done: bool;
    prop flag: int = 0;

    construct()
        stderr.printf("construct\n")
        self.rand = new GLib.Rand()
        self.done = false

    def run()
        stderr.printf("run\n")
        init_video()

        stderr.printf("loop\n")
        while !this.done
            draw()
            process_events()
            SDL.Timer.delay(DELAY)

    def init_video()
        // var video_flags = (SurfaceFlag.DOUBLEBUF
        //                    | SurfaceFlag.HWACCEL
        //                    | SurfaceFlag.HWSURFACE)

        // this.screen = Screen.set_video_mode(SCREEN_WIDTH, SCREEN_HEIGHT,
        //                                     SCREEN_BPP, video_flags)
        // stderr.printf("window.\n")
        window = new Video.Window("Genie SDL Demo",
                                       Video.Window.POS_CENTERED,
                                       Video.Window.POS_CENTERED,
                                       SCREEN_WIDTH, SCREEN_HEIGHT,
                                       Video.WindowFlags.RESIZABLE)
                                       // | Video.WindowFlags.SHOWN)

        // if (this.screen == null)
        //     stderr.printf("Could not set video mode.\n")
        //     return

        // stderr.printf("renderer.\n")
        this.render = Video.Renderer.create(
            this.window, -1,
            Video.RendererFlags.ACCELERATED |
            Video.RendererFlags.PRESENTVSYNC);
        // if (this.render == null)
        //     stderr.printf("Could not set video mode.\n")
        //     this.screen.show()
        //     return

        // stderr.printf("show.\n")
        this.window.show()
        // stderr.printf("init_video complete.\n")
        // SDL.WindowManager.set_caption("Genie SDL Demo", "")

    def draw()
        w: int
        h: int
        self.window.get_size(out w, out h);
        var x = (int16)rand.int_range(0, w)
        var y = (int16)rand.int_range(0, h)
        var radius = (int16)rand.int_range(0, 100)
        var color = rand.next_int()

        Circle.fill_color(this.render, x, y, radius, color)
        Circle.outline_color_aa(this.render, x, y, radius, color)

        // this.screen.flip()
        this.render.present();

    def process_events()
        // this.done = false
        // var ev = Event()
        ev: Event
        while Event.poll(out ev) == 1
            case ev.type
                when EventType.QUIT
                    stderr.printf("quit.\n")
                    this.done = true
                when EventType.KEYDOWN
                    stderr.printf("keydown.\n")
                    this.on_keyboard_event(ev.key)

    def on_keyboard_event(event: KeyboardEvent)
        if (is_alt_enter(event.keysym))
            if this.flag == 0
                this.flag = 1
                window.set_fullscreen(Video.WindowFlags.FULLSCREEN)
            else
                this.flag = 0
                window.set_fullscreen(0)
            // WindowManager.toggle_fullscreen(screen)

    def is_alt_enter(key: SDL.Input.Key): bool
        return (((key.mod & Input.Keymod.LALT) != 0)
                and (key.sym == Input.Keycode.RETURN
                     or key.sym == Input.Keycode.KP_ENTER))


init
    // SDL.init(InitFlag.VIDEO)
    SDL.init(InitFlag.EVERYTHING | SDLImage.InitFlags.ALL)
    // SDL.init(InitFlag.EVERYTHING)

    var sample = new SDLSample()
    sample.run()

    SDL.quit()

// vi: ft=genie
