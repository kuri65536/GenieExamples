# Projects/Vala/CairoSample - GNOME Wiki!

Contents

- Vala Cairo Example
- Multi-threaded Animation with Cairo and GTK+
- Shaped Window Example


## Vala Cairo Example

```genie
// vala-test:examples/cairo-sample.vala
[indent=4]
uses Gtk
uses Cairo

class CairoSample: Gtk.Window
    const SIZE: int = 30

    construct()
        this.title = "Cairo Vala Demo"
        this.destroy.connect(Gtk.main_quit)
        set_default_size(450, 550)
        create_widgets()

    def create_widgets()
        var drawing_area = new DrawingArea ()
        drawing_area.draw.connect(on_draw)
        add(drawing_area)

    def on_draw(da: Widget, ctx: Context): bool
        ctx.set_source_rgb (0, 0, 0)
        ctx.set_line_width (SIZE / 4)
        ctx.set_tolerance (0.1)
        ctx.set_line_join (LineJoin.ROUND)
        pos: array of double = {SIZE / 4.0, SIZE / 4.0}
        ctx.set_dash(pos, 0)
        stroke_shapes (ctx, 0, 0)
        ctx.set_dash (null, 0)
        stroke_shapes (ctx, 0, 3 * SIZE)
        ctx.set_line_join (LineJoin.BEVEL)
        stroke_shapes (ctx, 0, 6 * SIZE)
        ctx.set_line_join (LineJoin.MITER)
        stroke_shapes(ctx, 0, 9 * SIZE)
        fill_shapes (ctx, 0, 12 * SIZE)
        ctx.set_line_join (LineJoin.BEVEL)
        fill_shapes (ctx, 0, 15 * SIZE)
        ctx.set_source_rgb (1, 0, 0)
        stroke_shapes (ctx, 0, 15 * SIZE)
        return true

    def stroke_shapes(ctx: Context, x: int, y: int)
        this.draw_shapes (ctx, x, y, ctx.stroke)

    def fill_shapes(ctx: Context, x: int, y: int)
        this.draw_shapes (ctx, x, y, ctx.fill)

    delegate DrawMethod()

    def draw_shapes(ctx: Context, x: int, y: int, draw_method: DrawMethod)
        ctx.save ()
        ctx.new_path ()
        ctx.translate (x + SIZE, y + SIZE)
        bowtie (ctx)
        draw_method ()
        ctx.new_path ()
        ctx.translate (3 * SIZE, 0)
        square (ctx)
        draw_method ()
        ctx.new_path ()
        ctx.translate (3 * SIZE, 0)
        triangle (ctx)
        draw_method ()
        ctx.new_path ()
        ctx.translate (3 * SIZE, 0)
        inf (ctx)
        draw_method ()
        ctx.restore()

    def triangle(ctx: Context)
        ctx.move_to (SIZE, 0)
        ctx.rel_line_to (SIZE, 2 * SIZE)
        ctx.rel_line_to (-2 * SIZE, 0)
        ctx.close_path ()

    def square(ctx: Context)
        ctx.move_to (0, 0)
        ctx.rel_line_to (2 * SIZE, 0)
        ctx.rel_line_to (0, 2 * SIZE)
        ctx.rel_line_to (-2 * SIZE, 0)
        ctx.close_path ()

    def bowtie(ctx: Context)
        ctx.move_to (0, 0)
        ctx.rel_line_to (2 * SIZE, 2 * SIZE)
        ctx.rel_line_to (-2 * SIZE, 0)
        ctx.rel_line_to (2 * SIZE, -2 * SIZE)
        ctx.close_path ()

    def inf(ctx: Context)
        ctx.move_to (0, SIZE)
        ctx.rel_curve_to (0, SIZE, SIZE, SIZE, 2 * SIZE, 0)
        ctx.rel_curve_to (SIZE, -SIZE, 2 * SIZE, -SIZE, 2 * SIZE, 0)
        ctx.rel_curve_to (0, SIZE, -SIZE, SIZE, -2 * SIZE, 0)
        ctx.rel_curve_to (-SIZE, -SIZE, -2 * SIZE, -SIZE, -2 * SIZE, 0)
        ctx.close_path ()

init
    Gtk.init (ref args)
    var cairo_sample = new CairoSample ()
    cairo_sample.show_all ()
    Gtk.main ()
    // TODO(shimoda): return 0 in init()
```

```shell
Compile and Run
$ valac --pkg=gtk+-3.0 cairo-sample.vala
$ ./cairo-sample
```


## Multi-threaded Animation with Cairo and GTK+
This multi-threaded animation is a port of this example to Vala. It demontrates
the usage of Cairo drawing in a seperate thread and is making use of GTK+ thread
awareness. Every step in this example is explained on cairographics.org. (Note
for future editors of this example: Please the leave the function names so that
they still match the original example and the original description from
cairographics.org! This will make it easier to understand.)
vala-test:examples/cairo-threaded.vala

```genie
[indent=4]
uses Gtk
uses Gdk

class CairoThreadedExample: Gtk.Window
    // the global pixmap that will serve as our buffer
    pixmap: Cairo.ImageSurface  // Gdk.Pixbuf
    oldw: int
    oldh: int
    currently_drawing: int
    i_draw: int
    thread_info: unowned Thread of void*
    first_execution: bool = true

    construct()
        // constructor chain up
        GLib.Object (type: Gtk.WindowType.TOPLEVEL);
        // set_window size
        set_size_request (500, 500);
        // this must be done before we define our pixmap so that it can
        // reference the colour depth and such
        show_all ();
        // set up our pixmap so it is ready for drawing
        // this.pixmap = Gdk.pixbuf_get_from_window(this.get_window())
        // this.pixmap = new Cairo.ImageSurface(Cairo.Format.ARGB32, 500, 500);
        // because we will be painting our pixmap manually during expose events
        // we can turn off gtk's automatic painting and double buffering routines.
        this.app_paintable = true;
        this.double_buffered = false;
        // Signals
        this.destroy.connect (Gtk.main_quit);
        this.draw.connect(on_window_expose_event);
        this.configure_event.connect (on_window_configure_event);

    def run()
        // Timeout repeatedly calls closure every 100 ms after it returned true
        Timeout.add(100, timer_exe);

    def on_window_configure_event(sender: Gtk.Widget,
                                  event: Gdk.EventConfigure): bool
        // make our selves a properly sized pixmap
        // if our window has been resized
        if oldw != event.width or oldh != event.height
            // create our new pixmap with the correct size.
            var tmppixmap = sender.get_window().create_similar_image_surface(
                Cairo.Format.ARGB32, event.width, event.height, 1);
            // var tmppixmap = new Cairo.ImageSurface(
            //     Cairo.Format.ARGB32, event.width, event.height);
            // copy the contents of the old pixmap to the new pixmap.
            // This keeps ugly uninitialized pixmaps from being painted upon
            // resize
            var minw = oldw
            var minh = oldh
            if event.width < minw
                minw = event.width;

            if event.height < minh
                minh = event.height;

            var cr = new Cairo.Context(tmppixmap);
            cr.rectangle (0, 0, minw, minh);
            cr.fill ();

            // we're done with our old pixmap, so we can get rid of it and
            // replace it with our properly-sized one.
            pixmap = tmppixmap;

        oldw = event.width;
        oldh = event.height;
        return true;

    def on_window_expose_event(da: Gtk.Widget, cr: Cairo.Context): bool
        // Only copy the area that was exposed.
        cr.rectangle(0, 0, oldw, oldh);
        // cr.fill ();
        return true;

    // do_draw will be executed in a separate thread whenever we would like to
    // update our animation
    def do_draw(): void*
        var width = oldw
        var height = oldh
        currently_drawing = 1;
        // Gdk.threads_enter ();
        // Gdk.threads_leave ();
        //create a gtk-independant surface to draw on
        // var cst = new Cairo.ImageSurface (Cairo.Format.ARGB32, width, height);
        // var reg = new Cairo.Region(Cairo.RectangleInt() {x=0, y=0, width=oldw, height=oldh}
        var wnd = this.get_window()
        var reg = wnd.get_clip_region()
        var ctx = wnd.begin_draw_frame(reg)
        var cr = ctx.get_cairo_context();
        // do some time-consuming drawing
        i_draw++;
        i_draw = i_draw % 300;   // give a little movement to our animation
        print(@"$width, $height, $i_draw")
        cr.set_source_rgb (0.9, 0.9, 0.9);
        cr.paint ();
        // let's just redraw lots of times to use a lot of proc power
        var k = 0
        while k < 100
            var j = 0
            while j < 1000
                cr.set_source_rgb ((double) j / 1000.0, (double) j / 1000.0,
                             1.0 - (double) j / 1000.0);
                cr.move_to (i_draw, j / 2);
                cr.line_to (i_draw + 100, j / 2);
                cr.stroke ();
                j += 1
            k += 1
        wnd.end_draw_frame(ctx)

        // When dealing with gdkPixmap's, we need to make sure not to
        // access them from outside Gtk.main().
        //Gdk.threads_enter ();
        // var cr_pixmap = new Cairo.ImageSurface(
        //        Cairo.Format.ARGB32, width, height);
        // cr_pixmap.paint ();
        //Gdk.threads_leave ();
        currently_drawing = 0;
        return null;

    def timer_exe(): bool
        // use a safe function to get the value of currently_drawing so
        // we don't run into the usual multithreading issues
        var drawing_status = AtomicInt.get (ref currently_drawing);
        // if we are not currently drawing anything, launch a thread to
        // update our pixmap
        if drawing_status == 0
            if first_execution != true
                thread_info.join ();

            try
                thread_info = Thread.create of void* (do_draw, true);
            except e: Error
                stderr.printf ("%s\n", e.message);


        // tell our window it is time to draw our animation.
        var width = oldw
        var height = oldh
        queue_draw_area (0, 0, width, height);
        first_execution = false;
        return true;

init  // string[] args
    Gdk.threads_init ();
    Gdk.threads_enter ();
    Gtk.init (ref args);
    var window = new CairoThreadedExample ();
    window.run ();
    Gtk.main ();
    Gdk.threads_leave ();
```

```shell
Compile and Run
$ valac --pkg=gtk+-3.0 --thread cairo-threaded.vala
$ ./cairo-threaded
```

### note
- in my ubuntu 18.04, gdk-2.0.vapi has invalid declaration of Pixmap.get_size:
    `get_size(width, height)`, so I appended out keyword like this:
    `get_size(out width, out height)`, then compile had be passed.
    (but finnaly I got the c compile error of dependencie to gtk.h)


## Shaped Window Example
Code adapted from this Python example. First example uses Gtk2, second using Gtk3
vala-test:examples/cairo-shaped.vala

```genie
[indent=4]
uses Gtk
uses Cairo

/**
 * This example creates a clock with the following features:
 * Shaped window -- Window is unbordered and transparent outside the clock
 * Events are only registered for the window on the hour dots or on the center
 * dot. When the mouse is "in" the window (on one of the dots) it will turn
 * green.
 * This helps you understand where the events are actually being registered
 * Clicking allows you to drag the clock..
 * There is currently no code in place to close the window, you must kill the
 * process manually. A Composited environment is required. The python code I
 * copied this from includes checks for this. In my laziness I left them out.
 */
class CairoShaped: Gtk.Window
    // Are we inside the window?
    inside: bool = false;

    /**
     * Just creating the window, setting things up
     */
    construct()
        this.title = "Cairo Vala Demo";
        set_default_size (200, 200);
        // 'skip_taskbar_hint' determines whether the window gets an icon in
        // the taskbar / dock
        this.skip_taskbar_hint = true;
        // Turn off the border decoration
        this.decorated = false;
        this.app_paintable = true;
        // Need to get the RGBA colormap or transparency doesn't work.
        set_colormap (this.screen.get_rgba_colormap ());
        // We need to register which events we are interested in
        add_events (Gdk.EventMask.BUTTON_PRESS_MASK);
        add_events (Gdk.EventMask.ENTER_NOTIFY_MASK);
        add_events (Gdk.EventMask.LEAVE_NOTIFY_MASK);
        // Connecting some events, 'queue_draw()' redraws the window.
        // 'begin_move_drag()' sets up the window drag
        this.enter_notify_event += def()
            this.inside = true;
            queue_draw ();
            return true;
        this.leave_notify_event += def()
            this.inside = false;
            queue_draw ();
            return true;
        this.button_press_event += def(e)
            begin_move_drag ((int) e.button, (int) e.x_root, (int) e.y_root, e.time);
            return true;
        // The expose event is what is called when we need to draw the window
        this.expose_event.connect (on_expose);
        this.destroy.connect (Gtk.main_quit);

    /**
     * Actual drawing takes place within this method
     */
    def on_expose(da: Widget, event: Gdk.EventExpose): bool
        // Get a cairo context for our window
        var ctx = Gdk.cairo_create (da.window);
        // This makes the current color transparent (a = 0.0)
        ctx.set_source_rgba (1.0, 1.0, 1.0, 0.0);
        // Paint the entire window transparent to start with.
        ctx.set_operator (Cairo.Operator.SOURCE);
        ctx.paint ();
        // If we wanted to allow scaling we could do some calculation here
        var radius = 100;
        // This creates a radial gradient. c() is just a helper method to
        // convert from 0 - 255 scale to 0.0 - 1.0 scale.
        var p = new Cairo.Pattern.radial (100, 100, 0, 100, 100, 100);
        if inside
            p.add_color_stop_rgba (0.0, c (10), c (190), c (10), 1.0);
            p.add_color_stop_rgba (0.8, c (10), c (190), c (10), 0.7);
            p.add_color_stop_rgba (1.0, c (10), c (190), c (10), 0.5);
        else
            p.add_color_stop_rgba (0.0, c (10), c (10), c (190), 1.0);
            p.add_color_stop_rgba (0.8, c (10), c (10), c (190), 0.7);
            p.add_color_stop_rgba (1.0, c (10), c (10), c (190), 0.5);

        // Set the gradient as our source and paint a circle.
        ctx.set_source (p);
        ctx.arc (100, 100, radius, 0, 2.0 * 3.14);
        ctx.fill ();
        ctx.stroke ();
        // This chooses the color for the hour dots
        if inside
            ctx.set_source_rgba (0.0, 0.2, 0.6, 0.8);
        else
            ctx.set_source_rgba (c (226), c (119), c (214), 0.8);

        // Draw the 12 hour dots.
        var i = 0
        while (i < 12)
            ctx.arc (100 + 90.0 * Math.cos (2.0 * 3.14 * (i / 12.0)),
                     100 + 90.0 * Math.sin (2.0 * 3.14 * (i / 12.0)),
                     5, 0, 2.0 * 3.14);
            ctx.fill ();
            ctx.stroke ();
            i += 1

        // This is the math to draw the hands.
        // Nothing overly useful in this section
        ctx.move_to (100, 100);
        ctx.set_source_rgba (0, 0, 0, 0.8);
        var t = Time.local (time_t ());
        var hour = t.hour;
        var minutes = t.minute;
        var seconds = t.second;
        var per_hour = (2 * 3.14) / 12;
        var dh = (hour * per_hour) + ((per_hour / 60) * minutes);
        dh += 2 * 3.14 / 4;
        ctx.set_line_width (0.05 * radius);
        ctx.rel_line_to (-0.5 * radius * Math.cos (dh), -0.5 * radius * Math.sin (dh));
        ctx.move_to (100, 100);
        var per_minute = (2 * 3.14) / 60;
        var dm = minutes * per_minute;
        dm += 2 * 3.14 / 4;
        ctx.rel_line_to (-0.9 * radius * Math.cos (dm), -0.9 * radius * Math.sin (dm));
        ctx.move_to (100, 100);
        var per_second = (2 * 3.14) / 60;
        var ds = seconds * per_second;
        ds += 2 * 3.14 / 4;
        ctx.rel_line_to (-0.9 * radius * Math.cos (ds), -0.9 * radius * Math.sin (ds));
        ctx.stroke ();
        // Drawing the center dot
        ctx.set_source_rgba (c (124), c (32), c (113), 0.7);
        ctx.arc (100, 100, 0.1 * radius, 0, 2.0 * 3.14);
        ctx.fill ();
        ctx.stroke ();
        // This is possibly the most important bit.
        // Here is where we create the mask to shape the window
        // And decide what areas will receive events and which areas
        // Will let events pass through to the windows below.
        // First create a pixmap the size of the window
        var px = new Gdk.Pixmap (null, 200, 200, 1);
        // Get a context for it
        var pmcr = Gdk.cairo_create (px);
        // Initially we want to blank out everything in transparent as we
        // Did initially on the ctx context
        pmcr.set_source_rgba (1.0, 1.0, 1.0, 0.0);
        pmcr.set_operator (Cairo.Operator.SOURCE);
        pmcr.paint ();
        // Now the areas that should receive events need to be made opaque
        pmcr.set_source_rgba (0, 0, 0, 1);
        // Here we copy the motions to draw the middle dots and the hour dots.
        // This is mostly to demonstrate that you can make this any shape you
        // want.
        pmcr.arc (100, 100, 10, 0, 2.0 * 3.14);
        pmcr.fill ();
        pmcr.stroke ();
        i = 0
        while i < 12
            pmcr.arc (100 + 90.0 * Math.cos (2.0 * 3.14 * (i / 12.0)),
                      100 + 90.0 * Math.sin (2.0 * 3.14 * (i / 12.0)),
                      5, 0, 2.0 * 3.14);
            pmcr.fill ();
            pmcr.stroke ();

        // This sets the mask. Note that we have to cast to a Gdk.Bitmap*,
        // it won't compile without that bit.
        input_shape_combine_mask ((Gdk.Bitmap*) px, 0, 0);
        return true;

    def c(val: int): double
        return val / 255.0;

    def add_seconds(): bool
        queue_draw()
        return true

init  // string[] args) {
    Gtk.init (ref args);
    var cairo_sample = new CairoShaped ();
    cairo_sample.show_all ();
    // Just a timeout to update once a second.
    Gtk.Timeout.add_seconds (1, cairo_sample.add_seconds)
    Gtk.main ();
```

```shell
Compile and Run
$ valac --pkg=gtk+-2.0 --pkg=cairo --pkg=gdk-2.0 cairo-shaped.vala
$ ./cairo-shaped
```


```genie
// vala-test:examples/cairo-shaped.vala
[indent=4]
uses Gtk
uses Cairo

/**
 * This example creates a clock with the following features:
 * Shaped window -- Window is unbordered and transparent outside the clock
 * Events are only registered for the window on the hour dots or on the center dot
 * When the mouse is "in" the window (on one of the dots) it will turn green
 *    This helps you understand where the events are actually being registered
 * Clicking allows you to drag the clock.
 * There is currently no code in place to close the window, you must kill the process manually.
 * A Composited environment is required. The python code I copied this from includes checks for this.
 * In my laziness I left them out.
 **/
class CairoShaped: Gtk.Window
    // Are we inside the window?
    inside: bool
    cur_x: double
    cur_y: double
    size_valid: bool
    pos_valid: bool
    grad_in: Pattern
    grad_out: Pattern
    event_mask: Surface
    highlighted: int
    off_light: array of bool
    hour_x: array of double
    hour_y: array of double
    radius: double

    /**
     * Just creating the window, setting things up
     **/
    construct()
        this.title = "Cairo Vala Demo";
        this.destroy.connect (Gtk.main_quit);
        // skip_taskbar_hint determines whether the window gets an icon in the taskbar / dock
        skip_taskbar_hint = true;
        set_default_size (200, 200);
        set_keep_above(true);
        this.inside = false;
        this.size_valid = false;
        this.pos_valid = false;
        this.hour_x = new array of double[12];
        this.hour_y = new array of double[12];
        this.highlighted = -1;
        this.off_light = new array of bool[12];
        var i = 0
        while (i < off_light.length)
            off_light[i] = false
            i += 1

        // We need to register which events we are interested in
        add_events(Gdk.EventMask.BUTTON_PRESS_MASK);
        add_events(Gdk.EventMask.ENTER_NOTIFY_MASK);
        add_events(Gdk.EventMask.LEAVE_NOTIFY_MASK);
        add_events(Gdk.EventMask.SCROLL_MASK);
        // Connecting some events, queue_draw() redraws the window. begin_move_drag sets up the window drag
        enter_notify_event.connect(mouse_entered);
        leave_notify_event.connect(mouse_left);
        button_press_event.connect(button_pressed);
        scroll_event.connect(scrolled);
        // Turn off the border decoration
        set_decorated(false);
        set_app_paintable(true);
        // Need to get the rgba colormap or transparency doesn't work.
        set_visual(screen.get_rgba_visual());
        // The expose event is what is called when we need to draw the window
        draw.connect(on_expose);

    def mouse_entered(e: Gdk.EventCrossing): bool
        cur_x = e.x;
        cur_y = e.y;
        inside = true;
        pos_valid = false;
        queue_draw();
        return true;

    def mouse_left(e: Gdk.EventCrossing): bool
        cur_x = -100;
        cur_y = -100;
        inside = false;
        pos_valid = false;
        queue_draw();
        return true;

    def button_pressed(e: Gdk.EventButton): bool
        if e.button == 2
            destroy();
        else
            if highlighted >= 0
                off_light[highlighted] = !off_light[highlighted];
            begin_move_drag((int)e.button, (int)e.x_root,
                            (int)e.y_root, e.time);
        return true;

    def scrolled(e: Gdk.EventScroll): bool
        width: int
        height: int
        get_size(out width, out height);
        x: int
        y: int
        get_position(out x, out y);
        if e.direction == Gdk.ScrollDirection.UP
            resize(width + 4, height + 4);
            move(x-2, y-2);
            size_valid = false;
            queue_draw();
        else if e.direction == Gdk.ScrollDirection.DOWN
            resize(width - 4, height - 4);
            move(x+2, y+2);
            size_valid = false;
            queue_draw();
        return true;

    def create_gradients()
        width: int
        height: int
        get_size(out width, out height);
        width >>= 1;
        height >>= 1;
        radius = width;
        grad_in = new Cairo.Pattern.radial(width,height,0,width,height,radius);
        grad_in.add_color_stop_rgba(0.0, c(10), c(190), c(10), 1.0);
        grad_in.add_color_stop_rgba(0.8, c(10), c(190), c(10), 0.7);
        grad_in.add_color_stop_rgba(1.0, c(10), c(190), c(10), 0.5);
        grad_out = new Cairo.Pattern.radial(width, height, 0, width, height, radius);
        grad_out.add_color_stop_rgba(0.0, c(10), c(10), c(190), 1.0);
        grad_out.add_color_stop_rgba(0.8, c(10), c(10), c(190), 0.7);
        grad_out.add_color_stop_rgba(1.0, c(10), c(10), c(190), 0.5);

    def create_mask()
        width: int
        height: int
        get_size(out width, out height);
        event_mask = new ImageSurface(Format.ARGB32, width, height);
        // Get a context for it
        var pmcr = new Context(event_mask);
        // Initially we want to blank out everything in transparent as we
        // Did initially on the ctx context
        pmcr.set_source_rgba(1.0,1.0,1.0,0.0);
        pmcr.set_operator(Operator.SOURCE);
        pmcr.paint();
        // Now the areas that should receive events need to be made opaque
        pmcr.set_source_rgba(0,0,0,1);
        // Here we copy the motions to draw the middle dots and the hour dots.
        // This is mostly to demonstrate that you can make this any shape you want.
        pmcr.arc(width >> 1, height >> 1, width / 20.0, 0, 2.0*3.14);
        pmcr.fill();
        pmcr.stroke();
        var i = 0
        while i < 12
            pmcr.arc(hour_x[i],hour_y[i],width / 40.0,0,2.0 * 3.14);
            pmcr.fill();
            pmcr.stroke();
            i += 1

        input_shape_combine_region(Gdk.cairo_region_create_from_surface(event_mask));

    def locate_dots()
        width: int
        height: int
        get_size(out width, out height);
        width >>= 1;
        height >>= 1;
        var i = 0
        while i < 12
            hour_x[i] = width + 0.9 * width * Math.cos(2.0 * 3.14 * (i/12.0));
            hour_y[i] = height + 0.9 * height * Math.sin(2.0 * 3.14 * (i/12.0));
            i += 1

    def find_highlight()
        var rad = radius / 20.0;
        var i = 0
        while i < 12
            if Math.fabs(hour_x[i] - cur_x) > rad + 2
                pass
            else if Math.fabs(hour_y[i] - cur_y) > rad + 2
                pass
            else
                highlighted = i;
                return;
            i += 1
        highlighted = -1;

    /**
     * Actual drawing takes place within this method
     **/
    def on_expose(ctx: Context): bool
        if !size_valid
            create_gradients();
            locate_dots();
            create_mask();
            size_valid = true;

        if !pos_valid
            find_highlight();
            pos_valid = true;

        // This makes the current color transparent (a = 0.0)
        ctx.set_source_rgba(1.0,1.0,1.0,0.0);
        // Paint the entire window transparent to start with.
        ctx.set_operator(Cairo.Operator.SOURCE);
        ctx.paint();
        // Set the gradient as our source and paint a circle.
        if inside
            ctx.set_source(grad_in);
        else
            ctx.set_source(grad_out);

        ctx.arc(radius, radius, radius, 0, 2.0*3.14);
        ctx.fill();
        ctx.stroke();
        // This chooses the color for the hour dots
        if inside
            ctx.set_source_rgba(0.0,0.2,0.6,0.8);
        else
            ctx.set_source_rgba(c(226), c(119), c(214), 0.8);

        var rad = radius / 20.0
        // Draw the 12 hour dots.
        var i = 0
        while i < 12
            var x = hour_x[i];
            var y = hour_y[i];
            if i == highlighted
                var s = ctx.get_source();
                ctx.set_source_rgba(c(233), c(120), c(20), 0.8);
                ctx.arc(x,y,rad,0,2.0 * 3.14);
                ctx.fill();
                ctx.stroke();
                ctx.set_source(s);
            else if !inside and off_light[i]
                var s = ctx.get_source();
                ctx.set_source_rgba(c(216), c(215), c(44), 0.8);
                ctx.arc(x,y,rad,0,2.0 * 3.14);
                ctx.fill();
                ctx.stroke();
                ctx.set_source(s);
            else
                ctx.arc(x,y,rad,0,2.0 * 3.14);
                ctx.fill();
                ctx.stroke();
            i += 1


        // This is the math to draw the hands.
        // Nothing overly useful in this section
        ctx.move_to(radius, radius);
        ctx.set_source_rgba(0, 0, 0, 0.8);
        var t = Time.local(time_t());
        var hour = t.hour;
        var minutes = t.minute;
        var seconds = t.second;
        var per_hour = (2 * 3.14) / 12;
        var dh = (hour * per_hour) + ((per_hour / 60) * minutes);
        dh += 2 * 3.14 / 4;
        ctx.set_line_width(0.05 * radius);
        ctx.rel_line_to(-0.5 * radius * Math.cos(dh), -0.5 * radius * Math.sin(dh));
        ctx.move_to(radius, radius);
        var per_minute = (2 * 3.14) / 60;
        var dm = minutes * per_minute;
        dm += 2 * 3.14 / 4;
        ctx.rel_line_to(-0.9 * radius * Math.cos(dm), -0.9 * radius * Math.sin(dm));
        ctx.move_to(radius, radius);
        var per_second = (2 * 3.14) / 60;
        var ds = seconds * per_second;
        ds += 2 * 3.14 / 4;
        ctx.rel_line_to(-0.9 * radius * Math.cos(ds), -0.9 * radius * Math.sin(ds));
        ctx.stroke();
        // Drawing the center dot
        ctx.set_source_rgba(c(124), c(32), c(113), 0.7);
        ctx.arc(radius, radius, 0.1 * radius, 0, 2.0*3.14);
        ctx.fill();
        ctx.stroke();
        return true;

    def c(val: int): double
        return val / 255.0;

    def add_seconds(): bool
        this.queue_draw()
        return true

init  // (string[] args) {
    Gtk.init (ref args);
    var cairo_sample = new CairoShaped ();
    cairo_sample.show_all ();
    // Just a timeout to update once a second.
    Timeout.add_seconds(1, cairo_sample.add_seconds);
    Gtk.main ();
```

```shell
Compile and Run
$ valac -X -lm --pkg=gtk+-3.0 --pkg=cairo --pkg=gdk-3.0 cairo-shaped.vala
$ ./cairo-shaped
```

Vala/Examples Projects/Vala/CairoSample
    (last edited 2015-08-11 06:37:12 by MohammedSadiq)
