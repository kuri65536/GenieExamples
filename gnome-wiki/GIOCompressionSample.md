# Projects/Vala/GIOCompressionSample - GNOME Wiki!
# GIO Compression Sample

Deflate and inflate a file in gzip format. Requires GLib/GIO >= 2.24

```genie
// vala-test:examples/gio-compression.vala
[indent=4]
const FORMAT: ZlibCompressorFormat = ZlibCompressorFormat.GZIP

def compress(source: File, dest: File) raises Error
    convert (source, dest, new ZlibCompressor (FORMAT));

def decompress(source: File, dest: File) raises Error
    convert (source, dest, new ZlibDecompressor (FORMAT));

def convert(source: File, dest: File, converter: Converter) raises Error
    var src_stream = source.read ();
    var dst_stream = dest.replace (null, false, 0);
    var conv_stream = new ConverterOutputStream (dst_stream, converter);
    // 'splice' pumps all data from an InputStream to an OutputStream
    conv_stream.splice (src_stream, 0);

init  // string[] args
    if args.length < 2
        stdout.printf ("Usage: %s FILE\n", args[0]);
        return  // 0;
    var infile = File.new_for_commandline_arg (args[1]);
    if !infile.query_exists()
        stderr.printf ("File '%s' does not exist.\n", args[1]);
        return  // 1;
    var zipfile = File.new_for_commandline_arg (args[1] + ".gz");
    var outfile = File.new_for_commandline_arg (args[1] + "_out");
    try
        compress (infile, zipfile);
        decompress (zipfile, outfile);
    except e: Error
        stderr.printf ("%s\n", e.message);
        return  // 1;
    // TODO(shimoda): return 0; in init()
```

### Compile

```shell
$ valac --pkg=gio-2.0 gio-compression.gs
$ ./gio-compression FILENAME
```

Vala/Examples Projects/Vala/GIOCompressionSample
    (last edited 2013-11-22 16:48:30 by WilliamJonMcCann)
