# Projects/Vala/SDLSample - GNOME Wiki!

## SDL Vala Sample

```genie
// vala-test:examples/sdl-sample.vala
[indent=4]
uses SDL
uses SDLGraphics

class SDLSample: Object
    const SCREEN_WIDTH: int = 640;
    const SCREEN_HEIGHT: int = 480;
    const SCREEN_BPP: int = 32;
    const DELAY: int = 10;
    screen: unowned SDL.Screen
    rand: GLib.Rand
    done: bool

    construct()
        this.rand = new GLib.Rand ();

    def run()
        init_video ();
        while !done
            draw ();
            process_events ();
            SDL.Timer.delay (DELAY);

    def init_video()
        var video_flags = SurfaceFlag.DOUBLEBUF \
                          | SurfaceFlag.HWACCEL \
                          | SurfaceFlag.HWSURFACE
        this.screen = Screen.set_video_mode (SCREEN_WIDTH, SCREEN_HEIGHT,
                                             SCREEN_BPP, video_flags);
        if this.screen == null
            stderr.printf ("Could not set video mode.\n");
        SDL.WindowManager.set_caption ("Vala SDL Demo", "");

    def draw()
        var x = (int16)rand.int_range(0, screen.w)
        var y = (int16)rand.int_range(0, screen.h)
        var radius = (int16) rand.int_range(0, 100)
        var color = (uint32)rand.next_int()
        Circle.fill_color (this.screen, x, y, radius, color);
        Circle.outline_color_aa (this.screen, x, y, radius, color);
        this.screen.flip ();

    def process_events()
        event: Event
        while Event.poll(out event) == 1
            case event.type
                when EventType.QUIT
                    this.done = true;
                when EventType.KEYDOWN
                    this.on_keyboard_event (event.key);

    def on_keyboard_event(event: KeyboardEvent)
        if is_alt_enter(event.keysym)
            WindowManager.toggle_fullscreen (screen);

    def static is_alt_enter(key: Key): bool
        return ((key.mod & KeyModifier.LALT) != 0) and \
                (key.sym == KeySymbol.RETURN or \
                 key.sym == KeySymbol.KP_ENTER);

    def static main(args: array of string): int
        SDL.init (InitFlag.VIDEO);
        var sample = new SDLSample ();
        sample.run ();
        SDL.quit ();
        return 0;
```

### Compile and Run

```shell
$ valac --pkg=sdl --pkg=sdl-gfx -X -lSDL_gfx -o sdlsample SDLSample.gs
$ ./sdlsample
```

You might need to pass the include directory to the C compiler for it to find
header files,

```
$ valac --pkg sdl --pkg sdl-gfx -X -lSDL_gfx -o sdlsample \
    SDLSample.gs --Xcc=-I/usr/include/SDL
$ ./sdlsample
```


## SDLTTF Vala Sample
This sample shows how to display text, using a TrueType font with SDL.

```genie
// vala-test:examples/sdlttf-sample.vala
[indent=4]
uses SDL
uses SDLTTF

init
    // initialize SDL and SDLTTF
    SDL.init (InitFlag.VIDEO);
    SDLTTF.init ();
    // choose the video mode & window title
    screen: unowned Screen = \
        Screen.set_video_mode(320, 240, 16, SurfaceFlag.HWSURFACE)
    SDL.WindowManager.set_caption ("Vala SDLTTF Demo","");
    // set font with size 56
    var font = new SDLTTF.Font ("myfont.ttf", 56);
    // set color red ({ R=255, G=0, B=0 })
    var color = SDL.Color() {r=255, g=0, b=0}
    // create and fill image surface, with the chosen text, font & color
    var image = font.render_utf8 ("Hello World !", color);
    // put image on screen
    image.blit (null, screen, null);

    // loop...
    message("enter the loop...")
    var quit = false;
    while !quit
        screen.flip ();
        quit = process_events ();
        SDL.Timer.delay (10);
    message("quit...")
    SDLTTF.quit ();
    SDL.quit ();

   // catch events
def process_events(): bool
    e: SDL.Event
    while SDL.Event.poll(out e) == 1
        if e.type == SDL.EventType.QUIT
            return true;
    return false;
```

### Compile and Run
Put a TrueType font file named "myfont.ttf" in the current folder and type :

```shell
$ valac --pkg=sdl --pkg=sdl-ttf -X -lSDL_ttf sdlttf-sample.gs
$ ./sdlttf-sample
```

Vala/Examples Projects/Vala/SDLSample
    (last edited 2013-11-22 16:48:31 by WilliamJonMcCann)
