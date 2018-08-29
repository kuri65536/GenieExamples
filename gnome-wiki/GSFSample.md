# Projects/Vala/GSFSample - GNOME Wiki!

# Vala GSF Samples

## ZIP Archive decompression
This sample shows usage of LibGSF to deflate a ZIP archive.  Requires Vala 0.8.0
& LibGSF 1.14.17

```genie
// vala-test:examples/gsf-sample.vala
[indent=4]
init
    // declare objects
    file: Gsf.InputStdio
    zipfile: Gsf.InfileZip
    folder: Gsf.OutfileStdio

    // load the ZIP file
    try
        file = new Gsf.InputStdio("myarchive.zip");
    except
        stderr.printf ("File \"myarchive.zip\" not found");
        return  // 1; }

    try
        zipfile = new Gsf.InfileZip (file);
    except
        stderr.printf ("Not a ZIP file");
        return  // 1; }

    // create the destination directory
    try
        folder = new Gsf.OutfileStdio ("myarchive");
    except
        stderr.printf ("Cannot write to current directory");
        return  // 1; }

    // get the number of root items in the archive
    // and iterate through them, writing each one
    // to the destination directory
    var num_items = zipfile.num_children()
    var i = 0
    while i < num_items
        var item = zipfile.child_by_index (i);
        var itemfile = Gsf.StructuredBlob.read (item);
        itemfile.write (folder);
        i += 1
```

### Compile and Run
Put a zip archive named "myarchive.zip" in current folder and :

```shell
$ valac --pkg=libgsf-1 gsf-sample.vala
$ ./gsf-sample
```

Vala/Examples Projects/Vala/GSFSample
    (last edited 2013-11-22 16:48:26 by WilliamJonMcCann)

