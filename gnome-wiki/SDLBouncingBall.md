# Projects/Vala/SDLBouncingBall - GNOME Wiki!

## SDL Bouncing Ball
Based on SDLSample Please take into consideration that I, WolterHellmund, am
starting to learn this language, and therefore you shall not take this example
as a base for your Vala coding.

```genie
// World.vala
[indent=4]
uses GLib

class World: GLib.Object
    prop gravity: float
    prop air_res: float
    prop wind: float
    prop friction: float

    construct()
        // Set default values
        this.gravity = 9.8f;
        this.air_res = 0.05f;
        this.wind = 0.2f;
        this.friction = 0.03f;
```

```genie
// Window.vala
[indent=4]
uses GLib;
uses SDL;
uses SDLGraphics;

class Window: GLib.Object
    // ATTRIBUTES
    // Window data
    screen_width: uint16
    screen_height: uint16
    screen_bpp: uint16
    screen: unowned SDL.Screen
    caption: string

    // Game core data
    prop delay: int
    keep_running: bool = true
    // Ball placeholder
    balls: array of Ball = new array of Ball?[6]

    // METHODS
    def video_init()
        // Make the window with the specified data
        video_flags: uint32 = SurfaceFlag.DOUBLEBUF \
                              | SurfaceFlag.HWACCEL \
                              | SurfaceFlag.HWSURFACE
        this.screen = Screen.set_video_mode (this.screen_width,
                this.screen_height,
                this.screen_bpp,
                video_flags);
        if this.screen == null
            stderr.printf ("Unable to set video mode.\n");
        // If window is succesfully created, set secondary data
        SDL.WindowManager.set_caption (this.caption,"");

    delegate screen_update_delegate(window: Window)
    screen_update: screen_update_delegate

    def run()
        // First, start the window
        //this.video_init ();
        // Main loop of the Window
        while this.keep_running
            this.screen_update (this);
            this.event_process ();
            SDL.Timer.delay (this.delay);

    def event_process()
        event: Event
        while Event.poll(out event) == 1
            case event.type
                when EventType.QUIT
                    this.keep_running = false;
                when EventType.KEYDOWN
                    stderr.printf ("TODO: event_keydown function not yet implemented.\n");
                    //this.event_keydown (event.key);

    def event_keydown(event: KeyboardEvent)
        var key = event.keysym;
        // etc...

    // CONSTRUCTOR
    construct(width: uint16 = 800,
              height: uint16  = 640,
              bpp: uint16 = 32,
              caption: string = "Untitled Window")
        // Make window
        this.screen_width = width;
        this.screen_height = height;
        this.screen_bpp = bpp;
        this.caption = caption;
        this.delay = 5;
        //video_init ();
```

```genie
// Ball.vala
[indent=4]
uses GLib
uses SDL
uses SDLGraphics

class Ball: GLib.Object
    // ATTRIBUTES
    // Vital attributes (Var. | Prop.)
    prop mass: float
    prop elast: float
    // Position:
    prop posx: float
    prop posy: float
    // Velocity:
    prop velx: float
    prop vely: float
    vely_term: float
    // Acceleration:
    prop accelx: float
    prop accely: float
    // Appearance
    prop radius: uint
    prop color: uint32
    // World attributes
    world: unowned World

    // Rendered values
    gravity_rend: float
    air_res_rend: float
    wind_rend: float
    friction_rend: float

    // Window data
    window: unowned Window

    // METHODS
    // Re-render values (temporary)
    def recalc_values()
        // Vt = sqrt ([2 × m × g] ÷ [density × surface × drag])
        this.vely_term = (float) Math.sqrt ( (2*this.mass*world.gravity) / (1.2*(2*(float) this.radius/100)*0.47) );
        stdout.printf ("Terminal velocity: %f\n", this.vely_term);

    // Calculate velocities based on vectors
    def cvel()
        // Add acceleration
        this.velx += this.accelx;
        this.vely += this.accely;
        // Perform other worldly calculations

        // Gravity
        this.vely += this.gravity_rend;
        // Air resistance
        if this.velx > 0
            this.velx -= this.air_res_rend
        else
            this.velx += this.air_res_rend

        // Limit (terminal velocity)
        if this.vely > this.vely_term
            this.vely = this.vely_term

    // Bounce in X
    def bouncex()
        this.velx *= -1;
        // Use elasticity
        stdout.printf ("Ball bounced in X\n");
        if this.velx > 0
            this.velx -= this.elast;
            this.velx -= this.friction_rend;
        else
            this.velx += this.elast;

    // Bounce in Y
    def bouncey()
        this.vely *= -1;
        // Use elasticity
        // NOTE: Its obvius that the vely is negative when the ball bounces off
        this.vely += this.elast;
        // Use friction (in X)
        if this.velx > 0
            this.velx -= this.friction_rend;
        else
            this.velx += this.friction_rend;

    // Make the ball collide (and bounce)
    def collision_detection()
        // Screen level
        // For Y
        if (this.posy + this.radius) >= (float)window.screen_height
            this.posy = window.screen_height - this.radius;
            this.bouncey ();
        // For X
        if this.posx-this.radius <= 0
            this.posx = this.radius;
            bouncex ();
        else if (this.posx + this.radius) >= window.screen_width
            this.posx = window.screen_width-this.radius;
            bouncex ();

    // Gluepoint of all motion functions
    def move()
        // Detect collisions
        this.collision_detection ();
        // Calculate velocities
        this.cvel ();
        // Move in X
        this.posx += this.velx;
        // Move in Y
        this.posy += this.vely;

    // Draws the ball on the screen
    def draw()
        // Draw as a circle on the screen
        Circle.fill_color (window.screen,
          (int16) this.posx,
          (int16) this.posy,
          (int16) this.radius,
          this.color);

    // Gluepoint of previous 2 functions
    def represent()
        this.move ();
        this.draw ();

    // CONSTRUCTOR
    construct(world: World, window: Window)
        // Select world
        this.world = world;
        // Select window
        this.window = window;
        // Assign attributes
        this.mass = 1.0f;
        this.elast = 0.5f;
        this.radius = 5;
        this.color = (uint32)0xAFFF00FF
        // Define vectors
        this.posx = (float) (window.screen_width-this.radius) / 2;
        this.posy = (float) 10;
        //this.posy = (float) (window.screen_height-this.radius) / 2;
        this.velx = 0.0f;
        this.vely = 0.0f;
        this.accelx = 0.0f;
        this.accely = 0.0f;
        // Calculate variables
        this.recalc_values ();
        this.gravity_rend = (world.gravity*(float) window.delay/200);
        this.air_res_rend = (world.air_res*(float) window.delay/200);
        this.friction_rend = (world.friction*(float) window.delay/200);
        // Assign self to window
        var iter = 0
        while iter <= window.balls.length
            if window.balls[iter] == null
                window.balls[iter] = this;
                break;
            iter += 1
        // Testing options
        this.radius = 5;
        this.velx = 2;
```

```genie
// main.vala
[indent=4]
uses GLib
uses SDL
uses SDLGraphics

// Re-write of BBWindow's screen_update (linked in the run void)
def screen_update_definition(window: Window)
    window.screen.fill (null,0);
    if window.balls != null
        // If balls exist, iterate through them
        for  ball in window.balls
            if ball != null
                ball.represent ();
    window.screen.flip ();

init  //  (string[] args) {
    // Make a world for the ball
    var BBWorld = new World ();
    // Make a window to display the ball
    var BBWindow = new Window ();

    // Set the window's properties
    BBWindow.delay = 5;
    BBWindow.caption = "Wolter's SDL Bouncing Ball";
    // Display the window
    BBWindow.video_init ();

    // Make a ball
    var BBall = new Ball (BBWorld, BBWindow);
    // Assign the screen_update delegate
    BBWindow.screen_update = screen_update_definition;
    // Run the window
    BBWindow.run ();
```

### Building and Running

- prerequisite

```
$ apt install libsdl-dev
$ apt install libsdl-gfx1.2-dev
```

- build

```shell
$ valac -g --pkg sdl --pkg sdl-gfx -X -lSDL_gfx -X -I/usr/include/SDL \
    World.gs Window.gs Ball.gs main.gs -o BouncingBall
$ ./BouncingBall
```

Vala/Examples Projects/Vala/SDLBouncingBall
    (last edited 2013-11-22 16:48:24 by WilliamJonMcCann)
