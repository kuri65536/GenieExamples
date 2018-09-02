Projects/Vala/SDLSample - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
	   
	    
Projects/Vala/SDLSampleHomeRecentChangesScheduleLogin
SDL Vala Sample
vala-test:examples/sdl-sample.vala using SDL;
using SDLGraphics;
public class SDLSample : Object {
    private const int SCREEN_WIDTH = 640;
    private const int SCREEN_HEIGHT = 480;
    private const int SCREEN_BPP = 32;
    private const int DELAY = 10;
    private unowned SDL.Screen screen;
    private GLib.Rand rand;
    private bool done;
    public SDLSample () {
        this.rand = new GLib.Rand ();
    }
    public void run () {
        init_video ();
        while (!done) {
            draw ();
            process_events ();
            SDL.Timer.delay (DELAY);
        }
    }
    private void init_video () {
        uint32 video_flags = SurfaceFlag.DOUBLEBUF
                           | SurfaceFlag.HWACCEL
                           | SurfaceFlag.HWSURFACE;
        this.screen = Screen.set_video_mode (SCREEN_WIDTH, SCREEN_HEIGHT,
                                             SCREEN_BPP, video_flags);
        if (this.screen == null) {
            stderr.printf ("Could not set video mode.\n");
        }
        SDL.WindowManager.set_caption ("Vala SDL Demo", "");
    }
    private void draw () {
        int16 x = (int16) rand.int_range (0, screen.w);
        int16 y = (int16) rand.int_range (0, screen.h);
        int16 radius = (int16) rand.int_range (0, 100);
        uint32 color = rand.next_int ();
        Circle.fill_color (this.screen, x, y, radius, color);
        Circle.outline_color_aa (this.screen, x, y, radius, color);
        this.screen.flip ();
    }
    private void process_events () {
        Event event;
        while (Event.poll (out event) == 1) {
            switch (event.type) {
            case EventType.QUIT:
                this.done = true;
                break;
            case EventType.KEYDOWN:
                this.on_keyboard_event (event.key);
                break;
            }
        }
    }
    private void on_keyboard_event (KeyboardEvent event) {
        if (is_alt_enter (event.keysym)) {
            WindowManager.toggle_fullscreen (screen);
        }
    }
    private static bool is_alt_enter (Key key) {
        return ((key.mod & KeyModifier.LALT)!=0)
            && (key.sym == KeySymbol.RETURN
                    || key.sym == KeySymbol.KP_ENTER);
    }
    public static int main (string[] args) {
        SDL.init (InitFlag.VIDEO);
        var sample = new SDLSample ();
        sample.run ();
        SDL.quit ();
        return 0;
    }
}
Compile and Run
$ valac --pkg sdl --pkg sdl-gfx -X -lSDL_gfx -o sdlsample SDLSample.vala
$ ./sdlsample You might need to pass the include directory to the C compiler for it to find header files, $ valac --pkg sdl --pkg sdl-gfx -X -lSDL_gfx -o sdlsample SDLSample.vala --Xcc=-I/usr/include/SDL
$ ./sdlsample
SDLTTF Vala Sample
This sample shows how to display text, using a TrueType font with SDL. vala-test:examples/sdlttf-sample.vala using SDL;
using SDLTTF;
int main()
{
           // initialize SDL and SDLTTF
        SDL.init (InitFlag.VIDEO);
        SDLTTF.init ();
           // choose the video mode & window title
        unowned Screen screen;
        screen = Screen.set_video_mode (320, 240, 16, SurfaceFlag.HWSURFACE);
        SDL.WindowManager.set_caption ("Vala SDLTTF Demo","");
           // set font with size 56
        var font = new SDLTTF.Font ("myfont.ttf", 56);
           // set color red ({ R=255, G=0, B=0 })
        SDL.Color color = { 255,0,0 };
           // create and fill image surface, with the chosen text, font & color
        Surface image;
        image = font.render_utf8 ("Hello World !", color);
           // put image on screen
        image.blit (null, screen, null);
           // loop...
        bool quit = false;
        while (!quit)
        {
                screen.flip ();
                quit = process_events ();
                SDL.Timer.delay (10);
        }
        SDLTTF.quit ();
        SDL.quit ();
        return 0;
}
   // catch events
public bool process_events ()
{
        SDL.Event e;
        while (SDL.Event.poll (out e) == 1)
        {
                if (e.type == SDL.EventType.QUIT)
                 return true;
        }
        return false;
}
Compile and Run
Put a TrueType font file named "myfont.ttf" in the current folder and type : $ valac --pkg sdl --pkg sdl-ttf sdlttf-sample.vala
$ ./sdlttf-sample Vala/Examples Projects/Vala/SDLSample  (last edited 2013-11-22 16:48:31 by WilliamJonMcCann)
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
