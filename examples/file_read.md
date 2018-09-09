# Reading files in Genie

```genie
// file_read.gs
[indent=4]

init
    try
        var fp = FileStream.open("../README.md", "r")
        line: string
        while ((line = fp.read_line()) != null)
            stdout.printf(line + "\n")
    except
        return
```

