# Projects/Vala/GIOSamples - GNOME Wiki!

Contents
- Vala GIO Samples
- Reading Text File Line by Line
- File Objects
- Some Simple File Operations
- Writing Data
- Reading Binary Data
- Enumerating Directory Content
- Asynchronous File Listing
- Asynchronous Stream Reading
- Vala GIO Samples

GIO is similar to the Java IO framework. References to files and directories are
represented by File objects which you can create from a file name or a URI. GIO
provides two base classes for input and output: InputStream and OutputStream.
Opening a file for reading its contents will result in a FileInputStream which
is a sub-class of InputStream. Streams can be wrapped according to the decorator
pattern in order to provide them with additional functionality. For example it's
possible to read the contents of a file line by line by decorating its
FileInputStream with a DataInputStream. Or you could apply a FilterInputStream
for custom filtering purposes.

Reading Text File Line by Line The following example reads the contents of a
text file line by line and prints them on the screen.

```genie
// vala-test:examples/gio-sample.vala
[indent=4]
init
    // A reference to our file
    var file = File.new_for_path ("data.txt");
    if !file.query_exists()
        stderr.printf ("File '%s' doesn't exist.\n", file.get_path ());
        return  // 1;
    try
        // Open file for reading and wrap returned FileInputStream into a
        // DataInputStream, so we can read line by line
        var dis = new DataInputStream (file.read ());
        var line = dis.read_line(null)
        // Read lines until end of file (null) is reached
        while line != null
            stdout.printf ("%s\n", line);
            line = dis.read_line(null)
    except e: Error
        error ("%s", e.message);
    // TODO(shimoda): return 0; in init()
```

### Compile and Run

```shell
$ valac --pkg=gio-2.0 gio-sample.gs
$ ./gio-sample
```

Note that you don't have to close streams explicitly. They are closed
automatically as soon as they go out of scope (RAII).


## File Objects
A File object is the representation of a path to a resource. For example, this
can be a file but also a directory. It's important to note that this doesn't
imply anything about the existence of the represented resource because File
object itself does not do I/O operations but only stores the path. However, you
can check for existence with the method query_exists (): if (file.query_exists
()) {

    // File or directory exists
}
In order to find out whether the resource is a directory or not you can query its FileType: if (file.query_file_type (0) == FileType.DIRECTORY) {
    // It's a directory
}
You can create File objects from a file system path or a URI: var data_file = File.new_for_path ("data.txt");
var message_of_the_day = File.new_for_path ("/etc/motd");
var home_dir = File.new_for_path (Environment.get_home_dir ());
var web_page = File.new_for_uri ("http://live.gnome.org/Vala");
These methods are static factory methods, not constructors, since File is an interface. They create instances of classes implementing File. GIO works transparently across various protocols. It doesn't matter if access is done directly on the local file system or via HTTP, FTP, SFTP, SMB or DAV. This is implemented by a virtual file system layer called GVFS which is designed to be extendable for backends of other protocols. It will pay off to create file names and paths in your own application directly as File objects and to pass them as such to methods instead of representing them as plain strings. For example, it will be very easy to derive paths for parent and child directories without having to agonize over string manipulations and path separators: var home_dir = File.new_for_path (Environment.get_home_dir ());   // ~
var bar_file = home_dir.get_child ("foo").get_child ("bar.txt");  // ~/foo/bar.txt
var foo_dir = bar_file.get_parent ();                             // ~/foo/
If you still need the name as a string you can get it either completely from the method get_path () or just the base name (meaning the last component) from get_basename (). 


## Some Simple File Operations
Creating, renaming, copying and deleting files. All operations in this sample
are non-asynchronous.

```genie
// vala-test:examples/gio-file-operations.vala
int main () {

    try {
        // Reference a local file name
        var file = File.new_for_path ("samplefile.txt");
        {
            // Create a new file with this name
            var file_stream = file.create (FileCreateFlags.NONE);
            // Test for the existence of file
            if (file.query_exists ()) {
                stdout.printf ("File successfully created.\n");
            }
            // Write text data to file
            var data_stream = new DataOutputStream (file_stream);
            data_stream.put_string ("Hello, world");
        } // Streams closed at this point
        // Determine the size of file as well as other attributes
        var file_info = file.query_info ("*", FileQueryInfoFlags.NONE);
        stdout.printf ("File size: %lld bytes\n", file_info.get_size ());
        stdout.printf ("Content type: %s\n", file_info.get_content_type ());
        // Make a copy of file
        var destination = File.new_for_path ("samplefile.bak");
        file.copy (destination, FileCopyFlags.NONE);
        // Delete copy
        destination.delete ();
        // Rename file
        var renamed = file.set_display_name ("samplefile.data");
        // Move file to trash
        renamed.trash ();
        stdout.printf ("Everything cleaned up.\n");
    } catch (Error e) {
        stderr.printf ("Error: %s\n", e.message);
        return 1;
    }
   return 0;
}
```

Note: On Windows files cannot be renamed while they are open. That's the reason
for the extra block around the stream handling in this example. At the end of
the block the stream resources will get freed as they get out of scope and the
file will get closed.

### Compile and Run

```shell
$ valac --pkg gio-2.0 gio-file-operations.gs
$ ./gio-file-operations
```


## Writing Data
This sample creates an output file, opens a stream to that file and writes some
text to it.  For possible long string writes a loop, which checks the number of
bytes already written, is used.

```genie
// vala-test:examples/gio-write-data.vala
int main () {
    try {
        // an output file in the current working directory
        var file = File.new_for_path ("out.txt");
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
        dos.put_string ("this is the first line\n");
        string text = "this is the second line\n";
        // For long string writes, a loop should be used, because sometimes not all data can be written in one run
        // 'written' is used to check how much of the string has already been written
        uint8[] data = text.data;
        long written = 0;
        while (written < data.length) { 
            // sum of the bytes of 'text' that already have been written to the stream
            written += dos.write (data[written:data.length]);
        }
    } catch (Error e) {
        stderr.printf ("%s\n", e.message);
        return 1;
    }
    return 0;
}
```

### Compile and Run

```shell
$ valac --pkg gio-2.0 gio-write-data.gs
$ ./gio-write-data
```


## Reading Binary Data
This sample reads header information of a BMP image file as well as the actual
image data.

```genie
// vala-test:examples/gio-binary-sample.vala
int main () {
    try {
        // Reference a BMP image file
        var file = File.new_for_uri ("http://wvnvaxa.wvnet.edu/vmswww/images/test8.bmp");
//      var file = File.new_for_path ("sample.bmp");
        // Open file for reading
        var file_stream = file.read ();
        var data_stream = new DataInputStream (file_stream);
        data_stream.set_byte_order (DataStreamByteOrder.LITTLE_ENDIAN);
        // Read the signature
        uint16 signature = data_stream.read_uint16 ();
        if (signature != 0x4d42) {   // this hex code means "BM"
            stderr.printf ("Error: %s is not a valid BMP file\n", file.get_basename ());
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
        stdout.printf ("Width: %ld px\n", width);
        stdout.printf ("Height: %ld px\n", height);
        stdout.printf ("Image data size: %ld bytes\n", image_data_size);
    } catch (Error e) {
        stderr.printf ("Error: %s\n", e.message);
        return 1;
    }
    return 0;
}
```

### Compile and Run

```shell
$ valac --pkg gio-2.0 gio-binary-sample.gs
$ ./gio-binary-sample
```


## Enumerating Directory Content

```genie
// vala-test:examples/gio-ls.vala
int main (string[] args) {
    try {
        var directory = File.new_for_path (".");
        if (args.length > 1) {
            directory = File.new_for_commandline_arg (args[1]);
        }
        var enumerator = directory.enumerate_children (FileAttribute.STANDARD_NAME, 0);
        FileInfo file_info;
        while ((file_info = enumerator.next_file ()) != null) {
            stdout.printf ("%s\n", file_info.get_name ());
        }
    } catch (Error e) {
        stderr.printf ("Error: %s\n", e.message);
        return 1;
    }
    return 0;
}
```

### Compile and Run

```shell
$ valac --pkg gio-2.0 gio-ls.gs
$ ./gio-ls
```


## Asynchronous File Listing

```genie
// vala-test:examples/gio-async.vala
using Gtk;
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
        list.insert_column_with_attributes (-1, "Filename",
                                            new CellRendererText (), "text", 0);
        // Put list widget into a scrollable area and add it to the window
        var scroll = new ScrolledWindow (null, null);
        scroll.set_policy (PolicyType.NEVER, PolicyType.AUTOMATIC);
        scroll.add (list);
        add (scroll);
        // start file listing process
        list_directory.begin ();
    }
    private async void list_directory () {
        stdout.printf ("Start scanning home directory\n");
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
            stderr.printf ("Error: list_files failed: %s\n", err.message);
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
```

### Compile and Run

```shell
$ valac --pkg gtk+-3.0 gio-async.gs
$ ./gio-async
```


## Asynchronous Stream Reading

```genie
// vala-test:examples/gio-async-reading.vala
MainLoop main_loop;
async void read_something_async (File file) {
    var text = new StringBuilder ();
    print ("Start...\n");
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
    var file = File.new_for_uri ("http://www.gnome.org");
    if (args.length > 1) {
        file = File.new_for_commandline_arg (args[1]);
    }
    main_loop = new MainLoop ();
    read_something_async (file);
    main_loop.run ();
}
```

### Compile and Run

```shell
$ valac --pkg gio-2.0 gio-async-reading.gs
$ ./gio-async-reading
```

Vala/Examples Projects/Vala/GIOSamples
    (last edited 2013-11-22 16:48:30 by WilliamJonMcCann)
