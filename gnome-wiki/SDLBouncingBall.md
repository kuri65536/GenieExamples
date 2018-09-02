Projects/Vala/SDLBouncingBall - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
	   
	    
Projects/Vala/SDLBouncingBallHomeRecentChangesScheduleLogin
SDL Bouncing Ball
Based on SDLSample Please take into consideration that I, WolterHellmund, am starting to learn this language, and therefore you shall not take this example as a base for your Vala coding. World.vala using GLib;
public class World : GLib.Object {
        public float gravity    { get; set; }
        public float air_res    { get; set; }
        public float wind               { get; set; }
        public float friction   { get; set; }
        public World () {
                // Set default values
                this.gravity = 9.8f;
                this.air_res = 0.05f;
                this.wind = 0.2f;
                this.friction = 0.03f;
        }
}
Window.vala  using GLib;
using SDL;
using SDLGraphics;
public class Window : GLib.Object {
        // ATTRIBUTES
        // Window data
        public uint16 screen_width;
        public uint16 screen_height;
        public uint16 screen_bpp;
        public unowned SDL.Screen screen;
        public string caption;
        // Game core data
        public int delay { get; set; }
        private bool keep_running = true;
        // Ball placeholder
        public Ball[]? balls = new Ball[6];
        // METHODS
        public void video_init () {
                // Make the window with the specified data
                uint32 video_flags =    SurfaceFlag.DOUBLEBUF
                                                        |       SurfaceFlag.HWACCEL
                                                        |       SurfaceFlag.HWSURFACE;
                this.screen = Screen.set_video_mode (this.screen_width,
                        this.screen_height,
                        this.screen_bpp,
                        video_flags);
                if (this.screen == null) {
                        stderr.printf ("Unable to set video mode.\n");
                }
                // If window is succesfully created, set secondary data
                SDL.WindowManager.set_caption (this.caption,"");
        }
        public delegate void screen_update_delegate (Window window);    
        public screen_update_delegate screen_update;
        public void run () {
                // First, start the window
                //this.video_init ();
                // Main loop of the Window
                while (this.keep_running) {
                        this.screen_update (this);
                        this.event_process ();
                        SDL.Timer.delay (this.delay);
                }
        }
        public void event_process () {
                Event event;
                while (Event.poll (out event) == 1) {
                        switch (event.type) {
                                case EventType.QUIT:
                                        this.keep_running = false;
                                        break;
                                case EventType.KEYDOWN:
                                        stderr.printf ("TODO: event_keydown function not yet implemented.\n");
                                        //this.event_keydown (event.key);
                                        break;
                        }
                }
        }
        public void event_keydown (KeyboardEvent event) {
                Key key = event.keysym;
                // etc...
        }
        // CONSTRUCTOR
        public Window (uint16 width = 800,
          uint16 height = 640,
          uint16 bpp = 32,
          string caption = "Untitled Window") {
                // Make window
                this.screen_width = width;
                this.screen_height = height;
                this.screen_bpp = bpp;
                this.caption = caption;
                this.delay = 5;
                //video_init ();
        }
}
Ball.vala using GLib;
using SDL;
using SDLGraphics;
public class Ball : GLib.Object {
        // ATTRIBUTES
        // Vital attributes (Var. | Prop.)
        public float mass       { get; set; }
        public float elast      { get; set; }
        // Position:
        public float posx { get; set; }
        public float posy { get; set; }
        // Velocity:
        public float velx { get; set; }
        public float vely { get; set; }
                private float vely_term;
        // Acceleration:
        public float accelx { get; set; }
        public float accely { get; set; }
        // Appearance
        public uint radius      { get; set; }
        public uint32 color     { get; set; }
        // World attributes
        unowned World world;
                // Rendered values
                private float gravity_rend;
                private float air_res_rend;
                private float wind_rend;
                private float friction_rend;
        // Window data
        unowned Window window;
        // METHODS
        // Re-render values (temporary)
        private void recalc_values () {
                // Vt = sqrt ([2 × m × g] ÷ [density × surface × drag])
                this.vely_term = (float) Math.sqrt ( (2*this.mass*world.gravity) / (1.2*(2*(float) this.radius/100)*0.47) );
                stdout.printf ("Terminal velocity: %f\n", this.vely_term);
        }
        // Calculate velocities based on vectors
        private void cvel () {
                // Add acceleration
                this.velx += this.accelx;
                this.vely += this.accely;
                // Perform other worldly calculations
                        // Gravity
                        this.vely += this.gravity_rend;
                        // Air resistance
                        if (this.velx > 0) { this.velx -= this.air_res_rend; }
                        else { this.velx += this.air_res_rend; }
                // Limit (terminal velocity)
                if (this.vely > this.vely_term) { this.vely = this.vely_term; }
        }
        // Bounce in X
        private void bouncex () {
                this.velx *= -1;
                // Use elasticity
                stdout.printf ("Ball bounced in X\n");
                if (this.velx > 0) {
                        this.velx -= this.elast;
                        this.velx -= this.friction_rend;
                }
                else {
                        this.velx += this.elast;
                }
        }
        // Bounce in Y
        private void bouncey () {
                this.vely *= -1;
                // Use elasticity
                // NOTE: Its obvius that the vely is negative when the ball bounces off
                this.vely += this.elast;
                // Use friction (in X)
                if (this.velx > 0) {
                        this.velx -= this.friction_rend;
                }
                else {
                        this.velx += this.friction_rend;
                }
        }
        // Make the ball collide (and bounce)
        public void collision_detection () {
                // Screen level
                // For Y
                if ( (this.posy+this.radius) >= (float) window.screen_height) {
                        this.posy = window.screen_height - this.radius;
                        this.bouncey ();
                }
                // For X
                if (this.posx-this.radius <= 0) {
                        this.posx = this.radius;
                        bouncex ();
                }
                else if ((this.posx+this.radius) >= window.screen_width) {
                        this.posx = window.screen_width-this.radius;
                        bouncex ();
                }
        }
        // Gluepoint of all motion functions
        private void move () {
                // Detect collisions
                this.collision_detection ();
                // Calculate velocities
                this.cvel ();
                // Move in X
                this.posx += this.velx;
                // Move in Y
                this.posy += this.vely;
        }
        // Draws the ball on the screen
        private void draw () {
                // Draw as a circle on the screen
                Circle.fill_color (window.screen,
                  (int16) this.posx,
                  (int16) this.posy,
                  (int16) this.radius,
                  this.color);
        }
        // Gluepoint of previous 2 functions
        public void represent () {
                this.move ();
                this.draw ();
        }               
        // CONSTRUCTOR
        public Ball (World world, Window window) {
                // Select world
                this.world = world;
                // Select window
                this.window = window;
                // Assign attributes
                this.mass = 1f;
                this.elast = 0.5f;
                this.radius = 5;
                this.color = 0xAFFF00FFU;
                // Define vectors
                this.posx = (float) (window.screen_width-this.radius) / 2;
                this.posy = (float) 10;
                //this.posy = (float) (window.screen_height-this.radius) / 2;
                this.velx = 0f;
                this.vely = 0f;
                this.accelx = 0f;
                this.accely = 0f;
                // Calculate variables
                this.recalc_values ();
                this.gravity_rend = (world.gravity*(float) window.delay/200);
                this.air_res_rend = (world.air_res*(float) window.delay/200);
                this.friction_rend = (world.friction*(float) window.delay/200);
                // Assign self to window
                for (uint iter = 0; iter <= window.balls.length; iter++) {
                        if (window.balls[iter] == null) {
                                window.balls[iter] = this;
                                break;
                        }
                }
                // Testing options
                this.radius = 5;
                this.velx = 2;
        }
}
main.vala using GLib;
using SDL;
using SDLGraphics;
// Re-write of BBWindow's screen_update (linked in the run void)
void screen_update_definition (Window window) {
        window.screen.fill (null,0);
        if (window.balls != null) {
                // If balls exist, iterate through them
                foreach (Ball ball in window.balls) {
                        if (ball != null) {
                                ball.represent ();
                        }
                }
        }
        window.screen.flip ();
}
void main (string[] args) {
        // Make a world for the ball
        World BBWorld = new World ();
        // Make a window to display the ball
        Window BBWindow = new Window ();
                // Set the window's properties
                BBWindow.delay = 5;
                BBWindow.caption = "Wolter's SDL Bouncing Ball";
                // Display the window
                BBWindow.video_init ();
        // Make a ball
        Ball BBall = new Ball (BBWorld, BBWindow);
        // Assign the screen_update delegate
        BBWindow.screen_update = screen_update_definition;
        // Run the window
        BBWindow.run ();
}
Building and Running
$ valac -g --pkg sdl --pkg sdl-gfx -X -lSDL_gfx -X -I/usr/include/SDL World.vala Window.vala Ball.vala main.vala -o BouncingBall
$ ./BouncingBall Vala/Examples Projects/Vala/SDLBouncingBall  (last edited 2013-11-22 16:48:24 by WilliamJonMcCann)
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
