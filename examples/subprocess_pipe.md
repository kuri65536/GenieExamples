# Genie subprocess and get stdout as string

```genie
[indent=4]
uses GLib

init
    var ln = new SubprocessLauncher(SubprocessFlags.STDOUT_PIPE)
    try
        var prc = ln.spawnv(new array of string = {"/bin/ls"})
        var stm = prc.get_stdout_pipe()
        var dis = new DataInputStream(stm)
        while prc.wait_check()
            var s = dis.read_line()
            if s == null
                break
            print(s)
    except e: Error
        message("Error %s", e.message)

// vi: ft=genie
```

```shell
$ valac --pkg=gio-2.0 test.gs
$ ./test.exe
file1
file2
file3
```

