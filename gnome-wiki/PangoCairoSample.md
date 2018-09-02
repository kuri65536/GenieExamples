Projects/Vala/PangoCairoSample - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
	   
	    
Projects/Vala/PangoCairoSampleHomeRecentChangesScheduleLogin
vala-test:examples/pango-cairo.vala 
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
document.write('<a href="#" onclick="return togglenumber(\'CA-ba2e0063558b0b33ed37ca7773b158392feecf2e\', 1, 1);" \
                class="codenumbers">Toggle line numbers');
//======================================================================
//  pags.vala - Converting text to rendered image files of the text.
//              It may e.g. be used for rendering text files to put
//              into a mp3 player/image viewer.
//
//  Dov Grobgeld <dov.grobgeld@gmail.com>
//  Sat Jun 28 22:50:57 2008
//----------------------------------------------------------------------
using Cairo;
public class Pags {
    static void clear_page(Cairo.Context cr, int width, int height,
                           double margin, double top_margin, bool do_rotate)
    {
        cr.identity_matrix();
        cr.set_source_rgb (1.0, 1.0, 1.0); 
        cr.rectangle(0, 0, width, height);
        cr.fill();
        cr.set_source_rgb (0.0, 0.0, 0.0);
        if (do_rotate) {
            cr.translate(width, 0);
            cr.rotate(Math.PI / 2);
        }
        cr.move_to(margin, top_margin);
    }
    const OptionEntry[] option_entries = {
        { "width", 'w', 0, OptionArg.INT, ref width, "Image width", "PIXELS" },
        { "height", 'h', 0, OptionArg.INT, ref height, "Image height", "PIXELS" },
        { "family", 'f', 0, OptionArg.STRING, ref font_family, "Font family", "NAME" },
        { "font-size", 's', 0, OptionArg.DOUBLE, ref font_size, "Font size", "VALUE" },
        { "margin", 'm', 0, OptionArg.DOUBLE, ref margin, "Margin", "VALUE" },
        { "justify", 'j', 0, OptionArg.NONE, ref do_justify, "Justify", null },
        { "rotate", 'r', 0, OptionArg.NONE, ref do_rotate, "Rotate", null },
        { "", 0, 0, OptionArg.FILENAME_ARRAY, ref filenames, null, "FILE" },
        { null }
    };
    static int width = 320;
    static int height = 240;
    static string font_family;
    static double font_size;
    static double margin;
    static bool do_justify = false;
    static bool do_rotate = false;
    static string[] filenames;
    static int main(string[] args)
    {
        font_family = "Sans";
        font_size = 14;
        margin = font_size;
        try {
            var opt_context = new OptionContext("- Render text files to image files");
            opt_context.set_help_enabled(true);
            opt_context.add_main_entries(option_entries, "pags");
            opt_context.parse(ref args);
        } catch (OptionError e) {
            stderr.printf("Option parsing failed: %s\n", e.message);
            return -1;
        }
        double top_margin = margin * 2;
        double bottom_margin = margin;
        if (filenames == null) {
            stdout.printf("Need name of text file!\n");
            return -1;
        }
        Pango.Rectangle ink_rect, logical_rect;
        string text;
        try {
            FileUtils.get_contents(filenames[0], out text);
        } catch (FileError e) {
            stderr.printf("Failed reading file %s!\n", filenames[0]);
            return -1;
        }
        var surface = new Cairo.ImageSurface(Cairo.Format.RGB24, width, height);
        var cr = new Cairo.Context(surface);
        var font_description = new Pango.FontDescription();
        font_description.set_family(font_family);
        font_description.set_size((int)(font_size * Pango.SCALE));
        var rwidth = width;
        var rheight = height;
        if (do_rotate) {
            rwidth = height;
            rheight = width;
        }
        var layout = Pango.cairo_create_layout(cr);
        layout.set_font_description(font_description);
        layout.set_justify(do_justify);
        layout.set_width((int)((rwidth - 2 * margin) * Pango.SCALE));
        layout.set_text(text, -1);
        var pagenum_font_description = new Pango.FontDescription();
        pagenum_font_description.set_family("Sans");
        pagenum_font_description.set_size((int)(9 * Pango.SCALE));
        var pagenum_layout = Pango.cairo_create_layout(cr);
        pagenum_layout.set_font_description(pagenum_font_description);
        // tbd - move to the baseline pos of the first line
        int page_num = 1;
        double ybottom = rheight - top_margin - bottom_margin;
        unowned Pango.LayoutIter iter = layout.get_iter();
        clear_page(cr, width, height, margin, top_margin, do_rotate);
        while (!iter.at_last_line()) {
            double y_pos = 0;
            bool first_line = true;
            while (!iter.at_last_line()) {
                iter.get_line_extents(out ink_rect, out logical_rect);
                var line = iter.get_line_readonly();
                iter.next_line();
                // Decrease paragraph spacing
                if (ink_rect.width == 0) {
                    double dy = font_size / 2;
                    y_pos += dy;
                    if (!first_line)
                        cr.rel_move_to(0, dy);
                } else {
                    double xstart = 1.0 * logical_rect.x / Pango.SCALE;
                    cr.rel_move_to(xstart, 0);
                    Pango.cairo_show_layout_line(cr, line);
                    cr.rel_move_to(-xstart, (int)(logical_rect.height / Pango.SCALE));
                    y_pos += logical_rect.height / Pango.SCALE;
                }
                if (y_pos > ybottom)
                    break;
                first_line = false;
            }
            // draw page at bottom
            pagenum_layout.set_text(page_num.to_string(), -1);
            pagenum_layout.get_extents(out ink_rect, out logical_rect);
            cr.move_to(rwidth - logical_rect.width / Pango.SCALE, rheight - margin);
            Pango.cairo_show_layout(cr, pagenum_layout);
            surface.write_to_png("page-%03d.png".printf(page_num));
            page_num++;
            cr.show_page();
            clear_page(cr, width, height, margin, top_margin, do_rotate);
        }
        return 0;
    }
}
The following is an example using Gtk+-3.0 to draw boxes around each glyph cluster.  You can optionally change it to render boxes around each line, run, or char.  The box rendering routine may also be edited to display either the inked rectangle (ink_rect) or logical rectangle (log_rect) for each of these except 'char' with which it only has a logical rectangle associated.  I've found this useful in understanding how Pango works internally. 
document.write('<a href="#" onclick="return togglenumber(\'CA-702449ae7e23188a498faa8185fe438a0ac863ad\', 1, 1);" \
                class="codenumbers">Toggle line numbers');
// valac --pkg gtk+-3.0 --pkg cairo --pkg pango extentdemo.vala 
using Gtk;
using Cairo;
using GLib;
using Pango;
public class ExtentDemo : Gtk.Window {
        public string font_family {get;set;default="Sans";}
        public double font_size {get;set;default=24;}
        public string text{get;set;}
        public int mode{get;set;}
        public string r_name {get;set;}
        public Pango.Alignment align {get;set;}
        public bool justify {get;set;}
        public int width {get;set;default=800;}
        public int height {get;set;default=600;}
        private int x_margin = 5;
        private int y_margin = 5;
        private int x_offset = 0;
        private int y_offset = 25;
        public ExtentDemo(string t="blah"){
                Object(text:t);
        }
        construct{
                this.destroy.connect( Gtk.main_quit);
                //window.connect("key-press-event", this.key_press_event)
                this.show_all();
        }
        public override bool draw (Cairo.Context ctx) {
                var font_description = new Pango.FontDescription();
                font_description.set_family(font_family);
                font_description.set_size((int)(font_size * Pango.SCALE));
                var playout = Pango.cairo_create_layout(ctx);
                playout.set_font_description(font_description);
                //playout.set_text (text , -1);
                playout.set_markup (text , -1);
                ctx.set_source_rgb (1, 1, 1);
                ctx.paint();
                ctx.set_source_rgb (0, 0, 0);
                ctx.translate (this.x_margin, this.y_margin);
                ctx.translate (this.x_offset, this.y_offset);
                playout.set_width ( (int)(width * Pango.SCALE) );
                playout.set_height ( (int)(height * Pango.SCALE));
                playout.set_ellipsize(Pango.EllipsizeMode.END);
                playout.set_alignment(align);
                playout.set_justify(justify);
                ctx.move_to(0, 0);
                cairo_show_layout(ctx,playout);
                ctx.set_source_rgba(1, 0, 0, 0.5);
                ctx.set_line_width (2);
                //x, y, width, height = playout.get_pixel_extents()[extentindex];
                //ctx.rectangle(x-1, y-1, width+2, height+2);
                //ctx.stroke();
                ctx.set_source_rgba(0, 1, 0, 0.7);
                ctx.set_line_width (1);
                unowned Pango.LayoutIter li = playout.get_iter();
                bool q=true;
                while(q) {
                        Pango.Rectangle ink_rect = Pango.Rectangle();
                        Pango.Rectangle log_rect = Pango.Rectangle();
                        if (r_name == "line"){
                                li.get_line_extents(out ink_rect, out log_rect);
                        } else if (r_name == "run") {
                                li.get_run_extents(out ink_rect, out log_rect);
                        }       else if (r_name == "cluster") {
                                li.get_cluster_extents(out ink_rect, out log_rect);
                        } else if (r_name == "char") {
                                li.get_char_extents(out ink_rect);
                                log_rect = ink_rect;
                        }
                        //if ( r_name != 'char')
                        //      extents = extents[extentindex];
                        var x = this.descale(ink_rect.x);
                        var y = this.descale(ink_rect.y);
                        var w = this.descale(ink_rect.width);
                        var h = this.descale(ink_rect.height);
                        ctx.rectangle(x+0.5, y+0.5, w-1.0, h-1.0);
                        ctx.stroke();
                        if (r_name=="line" && li.next_line() == false) break;
                        if (r_name=="run" && li.next_run() == false) break;
                        if (r_name=="cluster" && li.next_cluster() == false) break;
                        if (r_name=="char" && li.next_char() == false) break;
                }
                return false;
        }
        public int descale(int i) {
                return (i / Pango.SCALE );
        }
}
static int main (string[] args) {
        //Gdk.threads_init ();
        //Gdk.threads_enter ();
        Gtk.init (ref args);
        string text = "᾿Απ᾿ τὰ κόκκαλα βγαλμένη\nτῶν ῾Ελλήνων τὰ ἱερά\n" +
                "καὶ σὰν πρῶτα ἀνδρειωμένη\n" +
                "χαῖρε, ὦ χαῖρε, ᾿Ελευθεριά! \n" +
                "well let's do some fishy things too.";
        //string text = "Hello and thank you for 'using' pango.";
        if (args.length > 1) {
                try {
                        FileUtils.get_contents(args[1], out text);
                } catch (FileError e) {
                        stderr.printf("Failed reading file !\n");
                        return 0;
                }
                if (!text.validate ()) {
                        print ("invalid utf8 string\n");
                        return 0;
                }
        }
        var mainapp = new ExtentDemo();
        mainapp.text =text;
        mainapp.r_name = "cluster"; //'line', 'run', 'cluster', 'char'  
        mainapp.align = Pango.Alignment.LEFT; //  pango.ALIGN_LEFT pango.ALIGN_CENTER, pango.ALIGN_RIGHT
        mainapp.justify = false; // false or true;
        mainapp.show_all ();
        Gtk.main ();
        //Gdk.threads_leave ();
        return 0;
}
 Vala/Examples Projects/Vala/PangoCairoSample  (last edited 2013-11-22 16:48:30 by WilliamJonMcCann)
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
