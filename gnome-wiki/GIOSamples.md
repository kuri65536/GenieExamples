







Projects/Vala/GIOSamples - GNOME Wiki!



<!--
var search_hint = "Search";
//-->





























Projects/Vala/GIOSamplesHomeRecentChangesScheduleLogin







Contents
Vala GIO Samples
Reading Text File Line by Line
File Objects
Some Simple File Operations
Writing Data
Reading Binary Data
Enumerating Directory Content
Asynchronous File Listing
Asynchronous Stream Reading 
Vala GIO Samples
GIO is similar to the Java IO framework. References to files and directories are represented by File objects which you can create from a file name or a URI. GIO provides two base classes for input and output: InputStream and OutputStream. Opening a file for reading its contents will result in a FileInputStream which is a sub-class of InputStream. Streams can be wrapped according to the decorator pattern in order to provide them with additional functionality. For example it's possible to read the contents of a file line by line by decorating its FileInputStream with a DataInputStream. Or you could apply a FilterInputStream for custom filtering purposes.  
Reading Text File Line by Line
The following example reads the contents of a text file line by line and prints them on the screen. vala-test:examples/gio-sample.vala int main () {
    // A reference to our file
    var file = File.new_for_path (&quot;data.txt&quot;);

    if (!file.query_exists ()) {
        stderr.printf (&quot;File '%s' doesn't exist.\n&quot;, file.get_path ());
        return 1;
    }

    try {
        // Open file for reading and wrap returned FileInputStream into a
        // DataInputStream, so we can read line by line
        var dis = new DataInputStream (file.read ());
        string line;
        // Read lines until end of file (null) is reached
        while ((line = dis.read_line (null)) != null) {
            stdout.printf (&quot;%s\n&quot;, line);
        }
    } catch (Error e) {
        error (&quot;%s&quot;, e.message);
    }

    return 0;
}

Compile and Run
$ valac --pkg gio-2.0 gio-sample.vala
$ ./gio-sampleNote that you don't have to close streams explicitly. They are closed automatically as soon as they go out of scope (RAII). 
File Objects
A File object is the representation of a path to a resource. For example, this can be a file but also a directory. It's important to note that this doesn't imply anything about the existence of the represented resource because File object itself does not do I/O operations but only stores the path. However, you can check for existence with the method query_exists (): if (file.query_exists ()) {
    // File or directory exists
}
In order to find out whether the resource is a directory or not you can query its FileType: if (file.query_file_type (0) == FileType.DIRECTORY) {
    // It's a directory
}
You can create File objects from a file system path or a URI: var data_file = File.new_for_path (&quot;data.txt&quot;);
var message_of_the_day = File.new_for_path (&quot;/etc/motd&quot;);
var home_dir = File.new_for_path (Environment.get_home_dir ());
var web_page = File.new_for_uri (&quot;http://live.gnome.org/Vala&quot;);
These methods are static factory methods, not constructors, since File is an interface. They create instances of classes implementing File. GIO works transparently across various protocols. It doesn't matter if access is done directly on the local file system or via HTTP, FTP, SFTP, SMB or DAV. This is implemented by a virtual file system layer called GVFS which is designed to be extendable for backends of other protocols. It will pay off to create file names and paths in your own application directly as File objects and to pass them as such to methods instead of representing them as plain strings. For example, it will be very easy to derive paths for parent and child directories without having to agonize over string manipulations and path separators: var home_dir = File.new_for_path (Environment.get_home_dir ());   // ~
var bar_file = home_dir.get_child (&quot;foo&quot;).get_child (&quot;bar.txt&quot;);  // ~/foo/bar.txt
var foo_dir = bar_file.get_parent ();                             // ~/foo/

If you still need the name as a string you can get it either completely from the method get_path () or just the base name (meaning the last component) from get_basename (). 
Some Simple File Operations
Creating, renaming, copying and deleting files. All operations in this sample are non-asynchronous. vala-test:examples/gio-file-operations.vala int main () {
    try {

        // Reference a local file name
        var file = File.new_for_path (&quot;samplefile.txt&quot;);

        {
            // Create a new file with this name
            var file_stream = file.create (FileCreateFlags.NONE);

            // Test for the existence of file
            if (file.query_exists ()) {
                stdout.printf (&quot;File successfully created.\n&quot;);
            }

            // Write text data to file
            var data_stream = new DataOutputStream (file_stream);
            data_stream.put_string (&quot;Hello, world&quot;);
        } // Streams closed at this point

        // Determine the size of file as well as other attributes
        var file_info = file.query_info (&quot;*&quot;, FileQueryInfoFlags.NONE);
        stdout.printf (&quot;File size: %lld bytes\n&quot;, file_info.get_size ());
        stdout.printf (&quot;Content type: %s\n&quot;, file_info.get_content_type ());

        // Make a copy of file
        var destination = File.new_for_path (&quot;samplefile.bak&quot;);
        file.copy (destination, FileCopyFlags.NONE);

        // Delete copy
        destination.delete ();

        // Rename file
        var renamed = file.set_display_name (&quot;samplefile.data&quot;);

        // Move file to trash
        renamed.trash ();

        stdout.printf (&quot;Everything cleaned up.\n&quot;);

    } catch (Error e) {
        stderr.printf (&quot;Error: %s\n&quot;, e.message);
        return 1;
    }

   return 0;
}
Note: On Windows files cannot be renamed while they are open. That's the reason for the extra block around the stream handling in this example. At the end of the block the stream resources will get freed as they get out of scope and the file will get closed. 
Compile and Run
$ valac --pkg gio-2.0 gio-file-operations.vala
$ ./gio-file-operations
Writing Data
This sample creates an output file, opens a stream to that file and writes some text to it.  For possible long string writes a loop, which checks the number of bytes already written, is used. vala-test:examples/gio-write-data.vala int main () {
    try {
        // an output file in the current working directory
        var file = File.new_for_path (&quot;out.txt&quot;);

        // delete if file already exists
        if (file.query_exists ()) {
            file.delete ();
        }

        // creating a file and a DataOutputStream to the file
        /*
            Use BufferedOutputStream to increase write speed:
            var dos = new DataOutputStream (new BufferedOutputStream.sized (file.create (FileCreateFlags.REPLACE_DESTINATION), 65536));
        */
        var dos = new DataOutputStream (file.create (FileCreateFlags.REPLACE_DESTINATION));

        // writing a short string to the stream
        dos.put_string (&quot;this is the first line\n&quot;);
        string text = &quot;this is the second line\n&quot;;
        // For long string writes, a loop should be used, because sometimes not all data can be written in one run
        // 'written' is used to check how much of the string has already been written
        uint8[] data = text.data;
        long written = 0;
        while (written &lt; data.length) { 
            // sum of the bytes of 'text' that already have been written to the stream
            written += dos.write (data[written:data.length]);
        }
    } catch (Error e) {
        stderr.printf (&quot;%s\n&quot;, e.message);
        return 1;
    }

    return 0;
}

Compile and Run
$ valac --pkg gio-2.0 gio-write-data.vala
$ ./gio-write-data
Reading Binary Data
This sample reads header information of a BMP image file as well as the actual image data. vala-test:examples/gio-binary-sample.vala int main () {
    try {

        // Reference a BMP image file
        var file = File.new_for_uri (&quot;http://wvnvaxa.wvnet.edu/vmswww/images/test8.bmp&quot;);
//      var file = File.new_for_path (&quot;sample.bmp&quot;);

        // Open file for reading
        var file_stream = file.read ();
        var data_stream = new DataInputStream (file_stream);
        data_stream.set_byte_order (DataStreamByteOrder.LITTLE_ENDIAN);

        // Read the signature
        uint16 signature = data_stream.read_uint16 ();
        if (signature != 0x4d42) {   // this hex code means &quot;BM&quot;
            stderr.printf (&quot;Error: %s is not a valid BMP file\n&quot;, file.get_basename ());
            return 1;
        }

        data_stream.skip (8);        // skip uninteresting data fields
        uint32 image_data_offset = data_stream.read_uint32 ();

        data_stream.skip (4);
        uint32 width = data_stream.read_uint32 ();
        uint32 height = data_stream.read_uint32 ();

        data_stream.skip (8);
        uint32 image_data_size = data_stream.read_uint32 ();

        // Seek and read the image data chunk
        uint8[] buffer = new uint8[image_data_size];
        file_stream.seek (image_data_offset, SeekType.CUR);
        data_stream.read (buffer);

        // Show information
        stdout.printf (&quot;Width: %ld px\n&quot;, width);
        stdout.printf (&quot;Height: %ld px\n&quot;, height);
        stdout.printf (&quot;Image data size: %ld bytes\n&quot;, image_data_size);

    } catch (Error e) {
        stderr.printf (&quot;Error: %s\n&quot;, e.message);
        return 1;
    }

    return 0;
}

Compile and Run
$ valac --pkg gio-2.0 gio-binary-sample.vala 
$ ./gio-binary-sample
Enumerating Directory Content
vala-test:examples/gio-ls.vala int main (string[] args) {
    try {
        var directory = File.new_for_path (&quot;.&quot;);

        if (args.length &gt; 1) {
            directory = File.new_for_commandline_arg (args[1]);
        }

        var enumerator = directory.enumerate_children (FileAttribute.STANDARD_NAME, 0);

        FileInfo file_info;
        while ((file_info = enumerator.next_file ()) != null) {
            stdout.printf (&quot;%s\n&quot;, file_info.get_name ());
        }

    } catch (Error e) {
        stderr.printf (&quot;Error: %s\n&quot;, e.message);
        return 1;
    }

    return 0;
}

Compile and Run
$ valac --pkg gio-2.0 gio-ls.vala
$ ./gio-ls
Asynchronous File Listing
vala-test:examples/gio-async.vala using Gtk;

/**
 * Loads the list of files in user's home directory and displays them
 * in a GTK+ list view.
 */
class ASyncGIOSample : Window {

    private ListStore model;

    public ASyncGIOSample () {

        // Set up the window
        set_default_size (300, 200);
        this.destroy.connect (Gtk.main_quit);

        // Set up the list widget and its model
        this.model = new ListStore (1, typeof (string));
        var list = new TreeView.with_model (this.model);
        list.insert_column_with_attributes (-1, &quot;Filename&quot;,
                                            new CellRendererText (), &quot;text&quot;, 0);

        // Put list widget into a scrollable area and add it to the window
        var scroll = new ScrolledWindow (null, null);
        scroll.set_policy (PolicyType.NEVER, PolicyType.AUTOMATIC);
        scroll.add (list);
        add (scroll);

        // start file listing process
        list_directory.begin ();
    }

    private async void list_directory () {
        stdout.printf (&quot;Start scanning home directory\n&quot;);
        var dir = File.new_for_path (Environment.get_home_dir ());
        try {
            // asynchronous call, to get directory entries
            var e = yield dir.enumerate_children_async (FileAttribute.STANDARD_NAME,
                                                        0, Priority.DEFAULT);
            while (true) {
                // asynchronous call, to get entries so far
                var files = yield e.next_files_async (10, Priority.DEFAULT);
                if (files == null) {
                    break;
                }
                // append the files found so far to the list
                foreach (var info in files) {
                    TreeIter iter;
                    this.model.append (out iter);
                    this.model.set (iter, 0, info.get_name ());
                }
            }
        } catch (Error err) {
            stderr.printf (&quot;Error: list_files failed: %s\n&quot;, err.message);
        }
    }

    static int main (string[] args) {
        Gtk.init (ref args);

        var demo = new ASyncGIOSample ();
        demo.show_all ();

        Gtk.main ();
        return 0;
    }
}

Compile and Run
$ valac --pkg gtk+-3.0 gio-async.vala
$ ./gio-async
Asynchronous Stream Reading
vala-test:examples/gio-async-reading.vala MainLoop main_loop;

async void read_something_async (File file) {
    var text = new StringBuilder ();
    print (&quot;Start...\n&quot;);
    try {
        var dis = new DataInputStream (file.read ());
        string line = null;
        while ((line = yield dis.read_line_async (Priority.DEFAULT)) != null) {
            text.append (line);
            text.append_c ('\n');
        }
        print (text.str);
    } catch (Error e) {
        error (e.message);
    }
    main_loop.quit ();
}

void main (string[] args) {
    var file = File.new_for_uri (&quot;http://www.gnome.org&quot;);

    if (args.length &gt; 1) {
        file = File.new_for_commandline_arg (args[1]);
    }

    main_loop = new MainLoop ();
    read_something_async (file);
    main_loop.run ();
}

Compile and Run
$ valac --pkg gio-2.0 gio-async-reading.vala
$ ./gio-async-reading Vala/Examples Projects/Vala/GIOSamples  (last edited 2013-11-22 16:48:30 by WilliamJonMcCann)











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



