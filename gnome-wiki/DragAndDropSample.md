Projects/Vala/DragAndDropSample - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
Projects/Vala/DragAndDropSampleHomeRecentChangesScheduleLogin
Here's a simple example of drag-and-drop within a single GTK3 application. The code compiles cleanly as of Vala 0.20. Credit: the code was taken from https://mail.gnome.org/archives/vala-list/2008-October/msg00147.html and cleaned up for modern GTK and Vala. /* TestDnD - dnd.vala : Simple tutorial for GTK+ Drag-N-Drop
 * Copyright (C) 2005 Ryan McDougall.
 * Vala port 2008 by Frederik
 * Cleanup 2013 by Yaron Sheffer
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Library General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */
// Compile with: valac dnd.vala --pkg gtk+-3.0
using Gtk;
using Gdk;
const int BYTE_BITS = 8;
const int WORD_BITS = 16;
const int DWORD_BITS = 32;
/**
 * Define a list of data types called &quot;targets&quot; that a destination widget will
 * accept. The string type is arbitrary, and negotiated between DnD widgets by
 * the developer. An enum or Quark can serve as the integer target id.
 */
enum Target {
    INT32,
    STRING,
    ROOTWIN
}
/* datatype (string), restrictions on DnD (Gtk.TargetFlags), datatype (int) */
const TargetEntry[] target_list = {
    { &quot;INTEGER&quot;,    0, Target.INT32 },
    { &quot;STRING&quot;,     0, Target.STRING },
    { &quot;text/plain&quot;, 0, Target.STRING },
    { &quot;application/x-rootwindow-drop&quot;, 0, Target.ROOTWIN }
};
public class Well : Label {
    public Well () {
        set_text (&quot;[a well]&quot;);
        // Make this widget a DnD destination.
        Gtk.drag_dest_set (
                this,                     // widget that will accept a drop
                DestDefaults.MOTION       // default actions for dest on DnD
                | DestDefaults.HIGHLIGHT,
                target_list,              // lists of target to support
                DragAction.COPY           // what to do with data after dropped
            );
        // All possible destination signals
        this.drag_motion.connect(this.on_drag_motion);
        this.drag_leave.connect(this.on_drag_leave);
        this.drag_drop.connect(this.on_drag_drop);
        this.drag_data_received.connect(this.on_drag_data_received);
    }
    /** Emitted when a drag is over the destination */
    private bool on_drag_motion (Widget widget, DragContext context,
                                 int x, int y, uint time)
    {
        // Fancy stuff here. This signal spams the console something horrible.
        // print (&quot;%s: on_drag_motion\n&quot;, widget.name);
        return false;
    }
    /** Emitted when a drag leaves the destination */
    private void on_drag_leave (Widget widget, DragContext context, uint time) {
        print (&quot;%s: on_drag_leave\n&quot;, widget.name);
    }
    /**
     * Emitted when the user releases (drops) the selection. It should check
     * that the drop is over a valid part of the widget (if its a complex
     * widget), and itself to return true if the operation should continue. Next
     * choose the target type it wishes to ask the source for. Finally call
     * Gtk.drag_get_data which will emit &quot;drag_data_get&quot; on the source.
     */
    private bool on_drag_drop (Widget widget, DragContext context,
                               int x, int y, uint time)
    {
        print (&quot;%s: on_drag_drop\n&quot;, widget.name);
        // Check to see if (x, y) is a valid drop site within widget
        bool is_valid_drop_site = true;
        // If the source offers a target
        if (context.list_targets() != null) {
            // Choose the best target type
            var target_type = (Atom) context.list_targets().nth_data (Target.INT32);
            // Request the data from the source.
            Gtk.drag_get_data (
                    widget,         // will receive 'drag_data_received' signal
                    context,        // represents the current state of the DnD
                    target_type,    // the target type we want
                    time            // time stamp
                );
        } else {
            // No target offered by source =&gt; error
            is_valid_drop_site = false;
        }
        return is_valid_drop_site;
    }
    /**
     * Emitted when the data has been received from the source. It should check
     * the SelectionData sent by the source, and do something with it. Finally
     * it needs to finish the operation by calling Gtk.drag_finish, which will
     * emit the &quot;data_delete&quot; signal if told to.
     */
    private void on_drag_data_received (Widget widget, DragContext context,
                                        int x, int y,
                                        SelectionData selection_data,
                                        uint target_type, uint time)
    {
        bool dnd_success = false;
        bool delete_selection_data = false;
        print (&quot;%s: on_drag_data_received\n&quot;, widget.name);
        // Deal with what we are given from source
        if ((selection_data != null) &amp;&amp; (selection_data.get_length() &gt;= 0)) {
            if (context.get_suggested_action() == DragAction.ASK) {
                // Ask the user to move or copy, then set the context action.
            }
            if (context.get_suggested_action() == DragAction.MOVE) {
                delete_selection_data = true;
            }
            // Check that we got the format we can use
            print (&quot; Receiving &quot;);
            switch (target_type) {
            case Target.INT32:
                long* data = (long*) selection_data.get_data();
                print (&quot;integer: %ld&quot;, (*data));
                dnd_success = true;
                break;
            case Target.STRING:
                print (&quot;string: %s&quot;, (string) selection_data.get_data());
                dnd_success = true;
                break;
            default:
                print (&quot;nothing good&quot;);
                break;
            }
            print (&quot;.\n&quot;);
        }
        if (dnd_success == false) {
            print (&quot;DnD data transfer failed!\n&quot;);
        }
        Gtk.drag_finish (context, dnd_success, delete_selection_data, time);
    }
}
public class Coins : Button {
    public Coins () {
        set_label (&quot;[coins]&quot;);
        // Make the this widget a DnD source.
        // Why doesn't Gtk.Label work here?
        Gtk.drag_source_set (
                this,                      // widget will be drag-able
                ModifierType.BUTTON1_MASK, // modifier that will start a drag
                target_list,               // lists of target to support
                DragAction.COPY            // what to do with data after dropped
            );
        // All possible source signals
        this.drag_begin.connect(on_drag_begin);
        this.drag_data_get.connect(on_drag_data_get);
        this.drag_data_delete.connect(on_drag_data_delete);
        this.drag_end.connect(on_drag_end);
    }
    /**
     * Emitted when DnD begins. This is often used to present custom graphics.
     */
    private void on_drag_begin (Widget widget, DragContext context) {
        print (&quot;%s: on_drag_begin\n&quot;, widget.name);
    }
    /**
     * Emitted when the destination requests data from the source via
     * Gtk.drag_get_data. It should attempt to provide its data in the form
     * requested in the target_type passed to it from the destination. If it
     * cannot, it should default to a &quot;safe&quot; type such as a string or text, even
     * if only to print an error. Then use Gtk.SelectionData.set to put the
     * source data into the allocated selection_data object, which will then be
     * passed to the destination. This will cause &quot;drag_data_received&quot; to be
     * emitted on the destination. Gtk.SelectionData is based on X's selection
     * mechanism which, via X properties, is only capable of storing data in
     * blocks of 8, 16, or 32 bit units.
     */
    private void on_drag_data_get (Widget widget, DragContext context,
                                   SelectionData selection_data,
                                   uint target_type, uint time)
    {
        string string_data = &quot;This is data from the source.&quot;;
        long integer_data = 42;
        print (&quot;%s: on_drag_data_get\n&quot;, widget.name);
        print (&quot; Sending &quot;);
        switch (target_type) {
            // case Target.SOME_OBJECT:
            // Serialize the object and send as a string of bytes.
            // Pixbufs, (UTF-8) text, and URIs have their own convenience
            // setter functions
        case Target.INT32:
            print (&quot;integer: %ld&quot;, integer_data);
            uchar [] buf;
            convert_long_to_bytes(integer_data, out buf);
            selection_data.set (
                    selection_data.get_target(),      // target type
                    BYTE_BITS,                 // number of bits per 'unit'
                    buf // pointer to data to be sent
                );
            break;
        case Target.STRING:
            print (&quot;string: %s&quot;, string_data);
            selection_data.set (
                    selection_data.get_target(),
                    BYTE_BITS,
                    (uchar [])string_data.to_utf8()
                );
            break;
        case Target.ROOTWIN:
            print (&quot;Dropped on the root window!\n&quot;);
            break;
        default:
            // Default to some a safe target instead of fail.
            assert_not_reached ();
        }
        print (&quot;.\n&quot;);
    }
    /**
     * Emitted after &quot;drag_data_received&quot; is handled, and Gtk.drag_finish is
     * called with the &quot;delete&quot; parameter set to true (when DnD is
     * DragAction.MOVE).
     */
    private void on_drag_data_delete (Widget widget, DragContext context) {
        // We aren't moving or deleting anything here
        print (&quot;%s: on_drag_data_delete\n&quot;, widget.name);
    }
    /** Emitted when DnD ends. This is used to clean up any leftover data. */
    private void on_drag_end (Widget widget, DragContext context) {
        print (&quot;%s: on_drag_end\n&quot;, widget.name);
    }
    /**
     * Convert a &quot;long&quot; into a buffer of bytes
     * Note: we assume a little-endian machine
     */
    private void convert_long_to_bytes(long number, out uchar [] buffer) {
        buffer = new uchar[sizeof(long)];
        for (int i=0; i&lt;sizeof(long); i++) {
            buffer[i] = (uchar) (number &amp; 0xFF);
            number = number &gt;&gt; 8;
        }
    }
}
static int main (string[] args) {
    // Always start GTK+ first!
    Gtk.init (ref args);
    // Create the widgets
    var window = new Gtk.Window (Gtk.WindowType.TOPLEVEL);
    var grid = new Grid();
    grid.orientation = Orientation.HORIZONTAL;
    grid.row_homogeneous = false;
    grid.row_spacing = 5;
    var coin_source = new Coins ();
    var well_dest = new Well ();
    var directions_label = new Label (&quot;drag a coin and drop it in the well&quot;);
    // Pack the widgets
    window.add (grid);
    grid.add (coin_source);
    coin_source.vexpand = true;
    grid.add (directions_label);
    directions_label.hexpand = true;
    grid.add (well_dest);
    // Make the window big enough for some DnD action
    window.set_default_size (450, 50);
    // Connect the signals
    window.destroy.connect(Gtk.main_quit);
    // Show the widgets
    window.show_all ();
    // Start the event loop
    Gtk.main ();
    return 0;
}
 Vala/Examples Projects/Vala/DragAndDropSample  (last edited 2013-11-22 16:48:24 by WilliamJonMcCann)
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
