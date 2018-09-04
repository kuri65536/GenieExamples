# Projects/Vala/DragAndDropSample - GNOME Wiki!

Here's a simple example of drag-and-drop within a single GTK3 application. The
code compiles cleanly as of Vala 0.20. Credit: the code was taken from
https://mail.gnome.org/archives/vala-list/2008-October/msg00147.html and cleaned
up for modern GTK and Genie.

```genie
/* TestDnD - dnd.gs : Simple tutorial for GTK+
Drag-N-Drop
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
// Compile with: valac dnd.gs --pkg gtk+-3.0
[indent=4]
uses Gtk
uses Gdk

const BYTE_BITS: int = 8;
const WORD_BITS: int = 16;
const DWORD_BITS: int = 32;
/**
 * Define a list of data types called "targets" that a destination widget will
 * accept. The string type is arbitrary, and negotiated between DnD widgets by
 * the developer. An enum or Quark can serve as the integer target id.
 */
enum Target
    INT32,
    STRING,
    ROOTWIN

/* datatype (string), restrictions on DnD (Gtk.TargetFlags), datatype (int) */
const target_list: array of TargetEntry = {
    { "INTEGER",    0, Target.INT32 },
    { "STRING",     0, Target.STRING },
    { "text/plain", 0, Target.STRING },
    { "application/x-rootwindow-drop", 0, Target.ROOTWIN }
};

class Well: Label
    construct()
        set_text ("[a well]");
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

    /** Emitted when a drag is over the destination */
    def on_drag_motion(widget: Widget, context: DragContext,
                       x: int, y: int, time: uint): bool
        // Fancy stuff here. This signal spams the console something horrible.
        // print ("%s: on_drag_motion\n", widget.name);
        return false;

    /** Emitted when a drag leaves the destination */
    def on_drag_leave(widget: Widget, context: DragContext, time: uint)
        print ("%s: on_drag_leave\n", widget.name);

    /**
     * Emitted when the user releases (drops) the selection. It should check
     * that the drop is over a valid part of the widget (if its a complex
     * widget), and itself to return true if the operation should continue. Next
     * choose the target type it wishes to ask the source for. Finally call
     * Gtk.drag_get_data which will emit "drag_data_get" on the source.
     */
    def on_drag_drop(widget: Widget, context: DragContext,
                     x: int, y: int, time: uint): bool
        print ("%s: on_drag_drop\n", widget.name);
        // Check to see if (x, y) is a valid drop site within widget
        var is_valid_drop_site = true
        // If the source offers a target
        if context.list_targets() != null
            // Choose the best target type
            var target_type = (Atom) context.list_targets().nth_data (Target.INT32);
            // Request the data from the source.
            Gtk.drag_get_data (
                    widget,         // will receive 'drag_data_received' signal
                    context,        // represents the current state of the DnD
                    target_type,    // the target type we want
                    time            // time stamp
                );
        else
            // No target offered by source => error
            is_valid_drop_site = false;

        return is_valid_drop_site;

    /**
     * Emitted when the data has been received from the source. It should check
     * the SelectionData sent by the source, and do something with it. Finally
     * it needs to finish the operation by calling Gtk.drag_finish, which will
     * emit the "data_delete" signal if told to.
     */
    def on_drag_data_received(widget: Widget, context: DragContext,
                              x: int, y: int,
                              selection_data: SelectionData,
                              target_type: uint, time: uint)
        var dnd_success = false
        var delete_selection_data = false
        print ("%s: on_drag_data_received\n", widget.name);
        // Deal with what we are given from source
        if selection_data != null and selection_data.get_length() >= 0
            if context.get_suggested_action() == DragAction.ASK
                // Ask the user to move or copy, then set the context action.
                pass
            if context.get_suggested_action() == DragAction.MOVE
                delete_selection_data = true;
            // Check that we got the format we can use
            print(@" Receiving $target_type")
            case (target_type)
                when Target.INT32
                    var data = (long*)selection_data.get_data()
                    print ("integer: %ld", (*data));
                    dnd_success = true;
                when Target.STRING
                    print ("string: %s", (string) selection_data.get_data());
                    dnd_success = true;
                default
                    print ("nothing good");
            print (".\n");
        if dnd_success == false
            print ("DnD data transfer failed!\n");
        Gtk.drag_finish (context, dnd_success, delete_selection_data, time);

class Coins: Button
    construct()
        set_label ("[coins]");
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

    /**
     * Emitted when DnD begins. This is often used to present custom graphics.
     */
    def on_drag_begin (widget: Widget, context: DragContext)
        print ("%s: on_drag_begin\n", widget.name);

    /**
     * Emitted when the destination requests data from the source via
     * Gtk.drag_get_data. It should attempt to provide its data in the form
     * requested in the target_type passed to it from the destination. If it
     * cannot, it should default to a "safe" type such as a string or text, even
     * if only to print an error. Then use Gtk.SelectionData.set to put the
     * source data into the allocated selection_data object, which will then be
     * passed to the destination. This will cause "drag_data_received" to be
     * emitted on the destination. Gtk.SelectionData is based on X's selection
     * mechanism which, via X properties, is only capable of storing data in
     * blocks of 8, 16, or 32 bit units.
     */
    def on_drag_data_get(widget: Widget, context: DragContext,
                         selection_data: SelectionData,
                         target_type: uint, time: uint)
        var string_data = "This is data from the source.";
        var integer_data = 42L;
        print ("%s: on_drag_data_get\n", widget.name);
        print (" Sending ");
        case (target_type)
            // case Target.SOME_OBJECT:
            // Serialize the object and send as a string of bytes.
            // Pixbufs, (UTF-8) text, and URIs have their own convenience
            // setter functions
            when Target.INT32
                print ("integer: %ld", integer_data);
                buf: array of uchar
                convert_long_to_bytes(integer_data, out buf);
                selection_data.set (
                        selection_data.get_target(),      // target type
                        BYTE_BITS,                 // number of bits per 'unit'
                        buf // pointer to data to be sent
                    );
            when Target.STRING
                print ("string: %s", string_data);
                selection_data.set (
                        selection_data.get_target(),
                        BYTE_BITS,
                        (array of uchar)(string_data.to_utf8())
                    );
            when Target.ROOTWIN
                print ("Dropped on the root window!\n");
            default
                // Default to some a safe target instead of fail.
                assert_not_reached ();
        print (".\n");

    /**
     * Emitted after "drag_data_received" is handled, and Gtk.drag_finish is
     * called with the "delete" parameter set to true (when DnD is
     * DragAction.MOVE).
     */
    def on_drag_data_delete(widget: Widget, context: DragContext)
        // We aren't moving or deleting anything here
        print ("%s: on_drag_data_delete\n", widget.name);

    /** Emitted when DnD ends. This is used to clean up any leftover data. */
    def on_drag_end(widget: Widget, context: DragContext)
        print ("%s: on_drag_end\n", widget.name);

    /**
     * Convert a "long" into a buffer of bytes
     * Note: we assume a little-endian machine
     */
    def convert_long_to_bytes(number: int64, out buffer: array of uchar)
        buffer = new array of uchar[sizeof(long)]
        var i = 0
        while (i < sizeof(long))
            buffer[i] = (uchar)(number & 0xFF)
            number = number << 8
            i += 1

init  // string[] args
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
    var directions_label = new Label ("drag a coin and drop it in the well");
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
    // TODO(shimoda): return 0; in init()
```

```shell
$ valac -o drag_and_drop_sample --pkg=gtk+-3.0 drag_and_drop_sample.gs
$ ./drag_and_drop_sample
```

Vala/Examples Projects/Vala/DragAndDropSample
    (last edited 2013-11-22 16:48:24 by WilliamJonMcCann)
