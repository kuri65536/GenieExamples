# Projects/Vala/IoChannelsSample - GNOME Wiki!

# Using gio's IO channels to communicate through pipes
Vala port of example from http://www.linuxjournal.com/article/8545 Complete and
working console application that uses IO channels to communicate across two
pipes. The example will continuously read and write and spam your console.  You
can stop the program via <Ctrl>-C.

```genie
// vala-test:examples/gio-channel.vala
[indent=4]
class PipeTalker: Object
    // reading callback
    def gio_in(gio: IOChannel, condition: IOCondition): bool
        ret: IOStatus
        msg: string
        len: size_t
        if (condition & IOCondition.HUP) == IOCondition.HUP
            print("Read end of pipe died!\n");
        try
            ret = gio.read_line(out msg, out len, null);
        except e: IOChannelError
            print("Error reading: %s\n", e.message);
        except e: ConvertError
            print("Error reading: %s\n", e.message);
        print("Read %u bytes: %s\n", (uint)len, msg);
        return true;

    // writing callback
    def gio_out(gio: IOChannel, condition: IOCondition): bool
        msg: string = "The price of greatness is responsibility.\n"
        ret: IOStatus
        len: size_t
        if (condition & IOCondition.HUP) == IOCondition.HUP
            print("Write end of pipe died!\n");
        try
            ret = gio.write_chars((array of char)msg, out len);
        except e: IOChannelError
            print("Error writing: %s\n", e.message);
        except e: ConvertError
            print("Error writing: %s\n", e.message);
        print("Wrote %u bytes.\n", (uint)len);
        return true;

    def init_channels()
        io_read, io_write: IOChannel
        var fd = new array  of int[2]  // file descriptor
        ret: int
        // setup a pipe
        ret = Posix.pipe(fd);
        if ret == -1
            print("Creating pipe failed: %s\n", strerror(errno));
            return;

        // setup iochannels
        io_read  = new IOChannel.unix_new(fd[0]);
        io_write = new IOChannel.unix_new(fd[1]);
        if (io_read == null) or (io_write == null)
            print("Cannot create new IOChannel!\n");
            return;

        // The watch calls the gio_in function, if there data is available for 
        // reading without locking
        if !(io_read.add_watch(IOCondition.IN | IOCondition.HUP, gio_in) != 0)
            print("Cannot add watch on IOChannel!\n");
            return;

        // The watch calls the gio_out function if there data is available for 
        // writing without locking
        if !(io_write.add_watch(IOCondition.OUT | IOCondition.HUP, gio_out) != 0)
            print("Cannot add watch on IOChannel!\n");
            return;

init
    var loop = new MainLoop(null, false);
    var pt = new PipeTalker();
    pt.init_channels();
    loop.run();
    // return 0;
```

### Compile and Run

```shell
$ valac --pkg=posix giochanneltest.vala
$ ./giochanneltest
```

Vala/Examples Projects/Vala/IoChannelsSample
    (last edited 2013-11-22 16:48:31 by WilliamJonMcCann)
