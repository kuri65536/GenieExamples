[indent=4]

uses
    SDL
    SDLGraphics

class SDLSample: Object
    const SCREEN_WIDTH: int = 640
    const SCREEN_HEIGHT: int = 480
    const DELAY: int = 1

    const keys: array of Input.Scancode = {
        Input.Scancode.UP,
        Input.Scancode.DOWN,
        Input.Scancode.LEFT,
        Input.Scancode.RIGHT,
        Input.Scancode.S,
        Input.Scancode.Q}

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
    seq: array of int

    construct()
        stderr.printf("construct\n")
        self.rand = new GLib.Rand()
        self.speed = 1
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

        self.seq = new array of int[5]

        stderr.printf("loop\n")
        while self.running
            draw(tx)
            getkeys(self.seq)
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
        f: bool = false
        if self.rect.x > self.wWin
            f = true
        if self.rect.x < -(int)self.rectSrc.w
            f = true
        if self.rect.y > self.hWin
            f = true
        if self.rect.y < -(int)self.rectSrc.h
            f = true
        if f
            self.rect.x = 0
            self.rect.y = (int16)rand.int_range(0, self.hWin)

        self.render.clear()
        self.render.copy(tx, self.rectSrc, self.rect)
        self.render.present()

    def getkeys(seq: array of int
    )
        Event.pump()
        var buf = Input.Keyboard.get_raw_state()

        i: int = 0
        for key in keys
            seq[i] = buf[key]
            if (seq[i] & 1) != buf[key]
                seq[i] = seq[i] | 2
            i += 1

        if seq[0] != 0
            self.rect.y -= self.speed
        if seq[1] != 0
            self.rect.y += self.speed
        if seq[2] != 0
            self.rect.x -= self.speed
        if seq[3] != 0
            self.rect.x += self.speed
        if seq[4] != 0
            self.speed += 1
            if self.speed > (int)self.rectSrc.h
                self.speed = 1
        if seq[5] != 0
            self.running = false


init
    SDL.init(InitFlag.EVERYTHING | SDLImage.InitFlags.ALL)

    var sample = new SDLSample()
    sample.run()

    SDL.quit()

// vi: ft=genie
