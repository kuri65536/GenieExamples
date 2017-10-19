[indent=4]

uses
    SDL
    SDLGraphics

class SDLSample: Object
    const SCREEN_WIDTH: int = 640
    const SCREEN_HEIGHT: int = 480
    const DELAY: int = 100

    // prop window: Video.Window    // don't do this, you will get sigv.
    window: Video.Window
    render: Video.Renderer
    rand: GLib.Rand
    running: bool
    flag: bool

    construct()
        stderr.printf("construct\n")
        self.rand = new GLib.Rand()
        self.running = true

    def run()
        stderr.printf("run\n")
        init_video()

        stderr.printf("loop\n")
        while self.running
            draw()
            process_events()
            SDL.Timer.delay(DELAY)

    def init_video()
        // stderr.printf("window.\n")
        window = new Video.Window("Genie SDL Demo",
                                  Video.Window.POS_CENTERED,
                                  Video.Window.POS_CENTERED,
                                  SCREEN_WIDTH, SCREEN_HEIGHT,
                                  Video.WindowFlags.RESIZABLE)
        assert self.window != null

        // stderr.printf("renderer.\n")
        self.render = Video.Renderer.create(
            self.window, -1,
            Video.RendererFlags.ACCELERATED |
            Video.RendererFlags.PRESENTVSYNC)
        assert self.render != null

        // stderr.printf("show.\n")
        self.window.show()

    def draw()
        w: int
        h: int
        self.window.get_size(out w, out h);
        var x = (int16)rand.int_range(0, w)
        var y = (int16)rand.int_range(0, h)
        var radius = (int16)rand.int_range(0, 100)
        var color = rand.next_int()

        Circle.fill_color(self.render, x, y, radius, color)
        Circle.outline_color_aa(self.render, x, y, radius, color)

        self.render.present();

    def process_events()
        ev: Event
        while Event.poll(out ev) == 1
            case ev.type
                when EventType.QUIT
                    stderr.printf("quit.\n")
                    self.running = false
                when EventType.KEYDOWN
                    stderr.printf("keydown.\n")
                    this.on_keyboard_event(ev.key)

    def on_keyboard_event(event: KeyboardEvent)
        if (is_alt_enter(event.keysym))
            if this.flag
                this.flag = false
                window.set_fullscreen(Video.WindowFlags.FULLSCREEN)
            else
                self.flag = true
                window.set_fullscreen(0)

    def is_alt_enter(key: SDL.Input.Key): bool
        return (((key.mod & Input.Keymod.LALT) != 0)
                and (key.sym == Input.Keycode.RETURN
                     or key.sym == Input.Keycode.KP_ENTER))


init
    SDL.init(InitFlag.EVERYTHING | SDLImage.InitFlags.ALL)

    var sample = new SDLSample()
    sample.run()

    SDL.quit()

// vi: ft=genie
