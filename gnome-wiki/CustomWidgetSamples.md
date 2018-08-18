# Projects/Vala/CustomWidgetSamples - GNOME Wiki!

Contents

- Creating Custom GTK+ Widgets
- Subclassing Gtk.DrawingArea: A Skeleton
- Egg Clock Sample
- Subclassing Gtk.Widget


## Creating Custom GTK+ Widgets

You can either subclass Gtk.DrawingArea (the easy way) or
subclass Gtk.Widget directly (the harder way).


## Subclassing Gtk.DrawingArea: A Skeleton

```
function isnumbered(obj) {
  return obj.childNodes.length && obj.firstChild.childNodes.length && obj.firstChild.firstChild.className == 'LineNumber';
}
function nformat(num,chrs,add) {
  var nlen = Math.max(0,chrs-(''+num).length), res = '';
  while (nlen>0) { res += ' '; nlen-- }
  return res+num+add;
}
function addnumber(did, nstart, nstep) {
  var c = document.getElementById(did), l = c.firstChild, n = 1;
  if (!isnumbered(c)) {
    if (typeof nstart == 'undefined') nstart = 1;
    if (typeof nstep  == 'undefined') nstep = 1;
    var n = nstart;
    while (l != null) {
      if (l.tagName == 'SPAN') {
        var s = document.createElement('SPAN');
        var a = document.createElement('A');
        s.className = 'LineNumber';
        a.appendChild(document.createTextNode(nformat(n,4,'')));
        a.href = '#' + did + '_' + n;
        s.appendChild(a);
        s.appendChild(document.createTextNode(' '));
        n += nstep;
        if (l.childNodes.length) {
          l.insertBefore(s, l.firstChild);
        }
        else {
          l.appendChild(s);
        }
      }
      l = l.nextSibling;
    }
  }
  return false;
}
function remnumber(did) {
  var c = document.getElementById(did), l = c.firstChild;
  if (isnumbered(c)) {
    while (l != null) {
      if (l.tagName == 'SPAN' && l.firstChild.className == 'LineNumber') l.removeChild(l.firstChild);
      l = l.nextSibling;
    }
  }
  return false;
}
function togglenumber(did, nstart, nstep) {
  var c = document.getElementById(did);
  if (isnumbered(c)) {
    remnumber(did);
  } else {
    addnumber(did,nstart,nstep);
  }
  return false;
}
```

```
[indent=4]
uses Gtk

class CustomWidget: DrawingArea
    construct()
        // Enable the events you wish to get notified about.
        // The 'draw' event is already enabled by the DrawingArea.
        add_events (Gdk.EventMask.BUTTON_PRESS_MASK
                  | Gdk.EventMask.BUTTON_RELEASE_MASK
                  | Gdk.EventMask.POINTER_MOTION_MASK);
        // Set favored widget size
        set_size_request (100, 100);

    /* Widget is asked to draw itself */
    def override draw(cr: Cairo.Context): bool
        var width = get_allocated_width ();
        var height = get_allocated_height ();
        // ...
        return false;

    /* Mouse button got pressed over widget */
    def override button_press_event(ev: Gdk.EventButton): bool
        // ...
        return false;

    /* Mouse button got released */
    def override button_release_event(ev: Gdk.EventButton): bool
        // ...
        return false;

    /* Mouse pointer moved over widget */
    def override motion_notify_event(ev: Gdk.EventMotion): bool
        // ...
        return false;
```


## Egg Clock Sample
This is a Vala port of the famous Egg Clock sample widget using Cairo and GTK+
as described in the GNOME Journal: Part 1 and part 2
vala-test:examples/egg-clock.vala 

```genie
[indent=4]
uses Gtk

namespace Egg
    class ClockFace: DrawingArea
        time: Time
        minute_offset: int
        dragging: bool

        event time_changed(hour: int, minute: int)

        construct()
            add_events (Gdk.EventMask.BUTTON_PRESS_MASK
                      | Gdk.EventMask.BUTTON_RELEASE_MASK
                      | Gdk.EventMask.POINTER_MOTION_MASK);
            update ();
            // update the clock once a second
            Timeout.add (1000, update);

        def override draw(cr: Cairo.Context): bool
            var x = get_allocated_width () / 2;
            var y = get_allocated_height () / 2;
            var radius = double.min (get_allocated_width () / 2,
                                     get_allocated_height () / 2) - 5;
            // clock back
            cr.arc (x, y, radius, 0, 2 * Math.PI);
            cr.set_source_rgb (1, 1, 1);
            cr.fill_preserve ();
            cr.set_source_rgb (0, 0, 0);
            cr.stroke ();
            // clock ticks
            var i = 0
            while (i < 12)
                inset: int
                cr.save ();     // stack pen-size
                if i % 3 == 0
                    inset = (int) (0.2 * radius);
                else
                    inset = (int) (0.1 * radius);
                    cr.set_line_width (0.5 * cr.get_line_width ());
                cr.move_to (x + (radius - inset) * Math.cos (i * Math.PI / 6),
                            y + (radius - inset) * Math.sin (i * Math.PI / 6));
                cr.line_to (x + radius * Math.cos (i * Math.PI / 6),
                            y + radius * Math.sin (i * Math.PI / 6));
                cr.stroke ();
                cr.restore ();  // stack pen-size
                i += 1

            // clock hands
            var hours = this.time.hour;
            var minutes = this.time.minute + this.minute_offset;
            var seconds = this.time.second;
            // hour hand:
            // the hour hand is rotated 30 degrees (pi/6 r) per hour +
            // 1/2 a degree (pi/360 r) per minute
            cr.save ();
            cr.set_line_width (2.5 * cr.get_line_width ());
            cr.move_to (x, y);
            cr.line_to (x + radius / 2 * Math.sin (Math.PI / 6 * hours
                                                 + Math.PI / 360 * minutes),
                        y + radius / 2 * -Math.cos (Math.PI / 6 * hours
                                                  + Math.PI / 360 * minutes));
            cr.stroke ();
            cr.restore ();
            // minute hand:
            // the minute hand is rotated 6 degrees (pi/30 r) per minute
            cr.move_to (x, y);
            cr.line_to (x + radius * 0.75 * Math.sin (Math.PI / 30 * minutes),
                        y + radius * 0.75 * -Math.cos (Math.PI / 30 * minutes));
            cr.stroke ();
            // seconds hand:
            // operates identically to the minute hand
            cr.save ();
            cr.set_source_rgb (1, 0, 0); // red
            cr.move_to (x, y);
            cr.line_to (x + radius * 0.7 * Math.sin (Math.PI / 30 * seconds),
                        y + radius * 0.7 * -Math.cos (Math.PI / 30 * seconds));
            cr.stroke ();
            cr.restore ();
            return false;

        def override button_press_event(event: Gdk.EventButton): bool
            var minutes = this.time.minute + this.minute_offset;
            // From
            // http://mathworld.wolfram.com/Point-LineDistance2-Dimensional.html
            var px = event.x - get_allocated_width () / 2;
            var py = get_allocated_height () / 2 - event.y;
            var lx = Math.sin (Math.PI / 30 * minutes);
            var ly = Math.cos (Math.PI / 30 * minutes);
            var u = lx * px + ly * py;
            // on opposite side of origin
            if u < 0
                return false;
            var d2 = Math.pow (px - u * lx, 2) + Math.pow (py - u * ly, 2);
            if d2 < 25      // 5 pixels away from the line
                this.dragging = true;
                print ("got minute hand\n");
            return false;

        def override button_release_event(event: Gdk.EventButton): bool
            if this.dragging
                this.dragging = false;
                emit_time_changed_signal((int)(event.x), (int)(event.y))
            return false;

        def override motion_notify_event(event: Gdk.EventMotion): bool
            if this.dragging
                emit_time_changed_signal((int)(event.x), (int)(event.y))
            return false;

        def emit_time_changed_signal(x: int, y: int)
            // decode the minute hand
            // normalise the coordinates around the origin
            x -= get_allocated_width () / 2;
            y -= get_allocated_height () / 2;
            // phi is a bearing from north clockwise, use the same geometry as
            // we did to position the minute hand originally
            var phi = Math.atan2 (x, -y);
            if phi < 0
                phi += Math.PI * 2;
            var hour = this.time.hour;
            var minute = (int) (phi * 30 / Math.PI);
            // update the offset
            this.minute_offset = minute - this.time.minute;
            redraw_canvas ();
            time_changed (hour, minute);

        def update(): bool
            // update the time
            this.time = Time.local (time_t ());
            redraw_canvas ();
            return true;        // keep running this event

        def redraw_canvas()
            var window = get_window ();
            if null == window
                return;
            var region = window.get_clip_region ();
            // redraw the cairo canvas completely by exposing it
            window.invalidate_region (region, true);
            window.process_updates (true);

init  // string[] args
    Gtk.init (ref args);
    var window = new Window ();
    var clock = new Egg.ClockFace ();
    window.add (clock);
    window.destroy.connect (Gtk.main_quit);
    window.show_all ();
    Gtk.main ();
    // TODO(shimoda): return 0; in init()
```


### Compile and Run

```shell
$ valac --pkg=gtk+-3.0 -X -lm eggclock.vala
$ ./eggclockNote: You can drag around the minute hand.  
```


## Subclassing Gtk.Widget

```genie
/*
 * Nick Glynn 2011
 * Johan Dahlin 2008
 *
 * A quite simple Gtk.Widget subclass which demonstrates how to subclass
 * and do realizing, sizing and drawing. Originally based on widget.py in PyGTK
 * and ported to GTK+ 3
 */
public class ValaWidget : Widget {
    private const string TEXT = "Hello World!";
    private const int BORDER_WIDTH = 10;
    private Pango.Layout layout;
    construct {
        this.layout = create_pango_layout (TEXT);
        set_has_window (false);
    }
    public override bool draw (Cairo.Context cr) {
        int width = get_allocated_width ();
        int height = get_allocated_height ();
        cr.set_source_rgba (0.5, 0.5, 0.5, 1);
        cr.rectangle (BORDER_WIDTH, BORDER_WIDTH,
                      width - 2 * BORDER_WIDTH,
                      height - 2 * BORDER_WIDTH);
        cr.set_line_width (5.0);
        cr.set_line_join (Cairo.LineJoin.ROUND);
        cr.stroke ();
        // And draw the text in the middle of the allocated space
        int fontw, fonth;
        this.layout.get_pixel_size (out fontw, out fonth);
        cr.move_to ((width - fontw) / 2,
                    (height - fonth) / 2);
        Pango.cairo_update_layout (cr, this.layout);
        Pango.cairo_show_layout (cr, this.layout);
        return true;
    }
    /*
     * This method gets called by Gtk+ when the actual size is known
     * and the widget is told how much space could actually be allocated.
     * It is called every time the widget size changes, for example when the
     * user resizes the window.
     */
    public override void size_allocate (Gtk.Allocation allocation) {
        // The base method will save the allocation and move/resize the
        // widget's GDK window if the widget is already realized.
        base.size_allocate (allocation);
        // Move/resize other realized windows if necessary
    }
}
int main (string[] args) {
    Gtk.init (ref args);
    var win = new Gtk.Window ();
    win.set_size_request (200,200);
    win.border_width = 5;
    win.title = "Widget test";
    win.destroy.connect (Gtk.main_quit);
    var frame = new Gtk.Frame ("Example Vala Widget");
    win.add (frame);
    var widget = new ValaWidget ();
    frame.add (widget);
    win.show_all ();
    Gtk.main ();
    return 0;
}
```

### Compile and Run

```shell
$ valac --pkg gtk+-3.0 valawidget.vala
$ ./valawidget
```

Vala/Examples Projects/Vala/CustomWidgetSamples
    (last edited 2018-05-12 17:48:42 by CorentinNoël)

