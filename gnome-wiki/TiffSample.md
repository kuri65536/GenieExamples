# Projects/Vala/TiffSample - GNOME Wiki!

## Tiff Sample
This sample shows how to read and write a tiff image.

```genie
// vala-test:examples/tiff.vala
[indent=4]
uses Tiff
uses GLib

class TiffReadWrite: Object
    raster: array of uint32
    width: uint32
    height: uint32
    size: uint32
    prop fname: string
    prop fmode: string

    construct(filename: string, mode: string)
        this.fname = filename;
        this.fmode = mode;

    def read_image()
        var tif = new TIFF (fname, fmode);
        if tif == null
            error ("Couldn't open file %s\n", fname);
        tif.GetField (TIFFTAG_IMAGEWIDTH, out this.width);
        tif.GetField (TIFFTAG_IMAGELENGTH, out this.height);
        this.size = this.width * this.height;
        raster = new array of uint32[size];
        if (!tif.ReadRGBAImage (this.width, this.height, this.raster, 0))
            error ("Couldn't read image %s!\n", this.fname);

    def write_image(filename: string)
        var newtif = new TIFF (filename, "w");
        var row = new array of uint8[width]
        newtif.SetField (TIFFTAG_IMAGEWIDTH, this.width);
        newtif.SetField (TIFFTAG_IMAGELENGTH, this.height);
        newtif.SetField (TIFFTAG_BITSPERSAMPLE, 8);
        newtif.SetField (TIFFTAG_COMPRESSION, COMPRESSION_LZW);
        newtif.SetField (TIFFTAG_PLANARCONFIG, PLANARCONFIG_CONTIG);
        newtif.SetField (TIFFTAG_ORIENTATION, ORIENTATION_BOTLEFT);
        h: uint32 = 0
        while h < this.height
            w: uint32 = 0
            while w < this.width
                row[w] = (uint8) raster[this.width * h + w];
                w += 1
            newtif.WriteScanline ((tdata_t) row, h, 0);
            h += 1

init  // atic int main (string[] args) {
    in_arg: string = args[1];
    if in_arg == null
        stderr.printf ("Argument required!\n");
        return

    var tt = new TiffReadWrite (in_arg, "r");
    tt.read_image ();
    tt.write_image ("/tmp/test.tiff");
```

### Compile and Run

```shell
$ valac --pkg=tiff -X -ltiff -o tiffreadwrite TiffReadWrite.vala
$ ./tiffreadwrite
```


Vala/Examples Projects/Vala/TiffSample
    (last edited 2013-11-22 16:48:26 by WilliamJonMcCann)
