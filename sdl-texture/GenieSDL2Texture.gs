[indent=4]

uses
    SDL
    SDLGraphics

class SDLSample: Object
    const SCREEN_WIDTH: int = 640
    const SCREEN_HEIGHT: int = 480
    const DELAY: int = 1

    // prop window: Video.Window    // don't do this, you will get sigv.
    window: Video.Window
    render: Video.Renderer
    rand: GLib.Rand
    running: bool
    flag: bool
    rect: Video.Rect
    rectSrc: Video.Rect
    hWin: int
    wWin: int
    speed: int

    construct()
        stderr.printf("construct\n")
        self.rand = new GLib.Rand()
        self.running = true

    def run()
        stderr.printf("run\n")
        init_video()

        var img = SDLImage.load("test.png")
        var tx = Video.Texture.create_from_surface(self.render, img)
        self.rect.x = 10000
        self.rect.y = 0
        self.rect.w = (uint)img.w
        self.rect.h = (uint)img.h

        self.window.get_size(out self.wWin, out self.hWin);

        self.rectSrc.x = 0
        self.rectSrc.y = 0
        self.rectSrc.w = self.rect.w
        self.rectSrc.h = self.rect.h

        stderr.printf("loop\n")
        while self.running
            draw(tx)
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

    def draw(tx: Video.Texture)
        if self.rect.x >= self.wWin
            self.rect.x = 0
            self.rect.y = (int16)rand.int_range(0, self.hWin)
            self.speed = rand.int_range(1, (int)self.rectSrc.w)
        else
            self.rect.x += self.speed

        self.render.clear()
        self.render.copy(tx, self.rectSrc, self.rect)
        self.render.present()

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
        if event.keysym.scancode == Input.Scancode.UP
            self.rect.y -= 1
        if event.keysym.scancode == Input.Scancode.DOWN
            self.rect.y += 1
        if event.keysym.scancode == Input.Scancode.LEFT
            self.rect.x -= 3
        if event.keysym.scancode == Input.Scancode.RIGHT
            self.rect.x -= 1
        if event.keysym.scancode == Input.Scancode.Q
            self.running = false

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
