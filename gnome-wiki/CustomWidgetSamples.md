







Projects/Vala/CustomWidgetSamples - GNOME Wiki!



<!--
var search_hint = "Search";
//-->






























Projects/Vala/CustomWidgetSamplesHomeRecentChangesScheduleLogin







Contents
Creating Custom GTK+ Widgets
Subclassing Gtk.DrawingArea: A Skeleton
Egg Clock Sample
Subclassing Gtk.Widget 
Creating Custom GTK+ Widgets
You can either subclass Gtk.DrawingArea (the easy way) or subclass Gtk.Widget directly (the harder way). 
Subclassing Gtk.DrawingArea: A Skeleton


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



document.write('<a href="#" onclick="return togglenumber(\'CA-4b31423987cceeb73beb5553e576f820ae5c8807\', 1, 1);" \
                class="codenumbers">Toggle line numbers');

using Gtk;

public class CustomWidget : DrawingArea {

    public CustomWidget () {

        // Enable the events you wish to get notified about.
        // The 'draw' event is already enabled by the DrawingArea.
        add_events (Gdk.EventMask.BUTTON_PRESS_MASK
                  | Gdk.EventMask.BUTTON_RELEASE_MASK
                  | Gdk.EventMask.POINTER_MOTION_MASK);

        // Set favored widget size
        set_size_request (100, 100);
    }

    /* Widget is asked to draw itself */
    public override bool draw (Cairo.Context cr) {
        int width = get_allocated_width ();
        int height = get_allocated_height ();

        // ...

        return false;
    }

    /* Mouse button got pressed over widget */
    public override bool button_press_event (Gdk.EventButton event) {
        // ...
        return false;
    }

    /* Mouse button got released */
    public override bool button_release_event (Gdk.EventButton event) {
        // ...
        return false;
    }

    /* Mouse pointer moved over widget */
    public override bool motion_notify_event (Gdk.EventMotion event) {
        // ...
        return false;
    }
}

Egg Clock Sample
This is a Vala port of the famous Egg Clock sample widget using Cairo and GTK+ as described in the GNOME Journal: Part 1 and part 2 vala-test:examples/egg-clock.vala 

document.write('<a href="#" onclick="return togglenumber(\'CA-a5b92fa12cd42fa78677fe94d442da902abc59d4\', 1, 1);" \
                class="codenumbers">Toggle line numbers');

using Gtk;

namespace Egg {

    public class ClockFace : DrawingArea {

        private Time time;
        private int minute_offset;
        private bool dragging;

        public signal void time_changed (int hour, int minute);

        public ClockFace () {
            add_events (Gdk.EventMask.BUTTON_PRESS_MASK
                      | Gdk.EventMask.BUTTON_RELEASE_MASK
                      | Gdk.EventMask.POINTER_MOTION_MASK);
            update ();

            // update the clock once a second
            Timeout.add (1000, update);
        }

        public override bool draw (Cairo.Context cr) {
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
            for (int i = 0; i &lt; 12; i++) {
                int inset;

                cr.save ();     // stack pen-size

                if (i % 3 == 0) {
                    inset = (int) (0.2 * radius);
                } else {
                    inset = (int) (0.1 * radius);
                    cr.set_line_width (0.5 * cr.get_line_width ());
                }

                cr.move_to (x + (radius - inset) * Math.cos (i * Math.PI / 6),
                            y + (radius - inset) * Math.sin (i * Math.PI / 6));
                cr.line_to (x + radius * Math.cos (i * Math.PI / 6),
                            y + radius * Math.sin (i * Math.PI / 6));
                cr.stroke ();
                cr.restore ();  // stack pen-size
            }

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
        }

        public override bool button_press_event (Gdk.EventButton event) {
            var minutes = this.time.minute + this.minute_offset;

            // From
            // http://mathworld.wolfram.com/Point-LineDistance2-Dimensional.html
            var px = event.x - get_allocated_width () / 2;
            var py = get_allocated_height () / 2 - event.y;
            var lx = Math.sin (Math.PI / 30 * minutes);
            var ly = Math.cos (Math.PI / 30 * minutes);
            var u = lx * px + ly * py;

            // on opposite side of origin
            if (u &lt; 0) {
                return false;
            }

            var d2 = Math.pow (px - u * lx, 2) + Math.pow (py - u * ly, 2);

            if (d2 &lt; 25) {      // 5 pixels away from the line
                this.dragging = true;
                print (&quot;got minute hand\n&quot;);
            }

            return false;
        }

        public override bool button_release_event (Gdk.EventButton event) {
            if (this.dragging) {
                this.dragging = false;
                emit_time_changed_signal ((int) event.x, (int) event.y);
            }
            return false;
        }

        public override bool motion_notify_event (Gdk.EventMotion event) {
            if (this.dragging) {
                emit_time_changed_signal ((int) event.x, (int) event.y);
            }
            return false;
        }

        private void emit_time_changed_signal (int x, int y) {
            // decode the minute hand
            // normalise the coordinates around the origin
            x -= get_allocated_width () / 2;
            y -= get_allocated_height () / 2;

            // phi is a bearing from north clockwise, use the same geometry as
            // we did to position the minute hand originally
            var phi = Math.atan2 (x, -y);
            if (phi &lt; 0) {
                phi += Math.PI * 2;
            }

            var hour = this.time.hour;
            var minute = (int) (phi * 30 / Math.PI);
            // update the offset
            this.minute_offset = minute - this.time.minute;
            redraw_canvas ();

            time_changed (hour, minute);
        }

        private bool update () {
            // update the time
            this.time = Time.local (time_t ());
            redraw_canvas ();
            return true;        // keep running this event
        }

        private void redraw_canvas () {
            var window = get_window ();
            if (null == window) {
                return;
            }

            var region = window.get_clip_region ();
            // redraw the cairo canvas completely by exposing it
            window.invalidate_region (region, true);
            window.process_updates (true);
        }
    }
}


int main (string[] args) {
    Gtk.init (ref args);
    var window = new Window ();
    var clock = new Egg.ClockFace ();
    window.add (clock);
    window.destroy.connect (Gtk.main_quit);
    window.show_all ();
    Gtk.main ();
    return 0;
}

Compile and Run
$ valac --pkg gtk+-3.0 -X -lm eggclock.vala
$ ./eggclockNote: You can drag around the minute hand.  
Subclassing Gtk.Widget


document.write('<a href="#" onclick="return togglenumber(\'CA-902b14f043233e895d38968854d2635f04878f9a\', 1, 1);" \
                class="codenumbers">Toggle line numbers');

/*
 * Nick Glynn 2011
 * Johan Dahlin 2008
 *
 * A quite simple Gtk.Widget subclass which demonstrates how to subclass
 * and do realizing, sizing and drawing. Originally based on widget.py in PyGTK
 * and ported to GTK+ 3
 */
public class ValaWidget : Widget {

    private const string TEXT = &quot;Hello World!&quot;;
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
    win.title = &quot;Widget test&quot;;
    win.destroy.connect (Gtk.main_quit);

    var frame = new Gtk.Frame (&quot;Example Vala Widget&quot;);
    win.add (frame);

    var widget = new ValaWidget ();
    frame.add (widget);

    win.show_all ();
    Gtk.main ();

    return 0;
}
Compile and Run
$ valac --pkg gtk+-3.0 valawidget.vala
$ ./valawidget Vala/Examples Projects/Vala/CustomWidgetSamples  (last edited 2018-05-12 17:48:42 by CorentinNoël)











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



