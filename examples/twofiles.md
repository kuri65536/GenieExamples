# Split program into two files.

```genie
// file: b.gs
[indent=4]
class ClassB: Object
    c: int

    construct()
        c = 1

// vi: ft=genie
```

```genie
// file: a.gs
[indent=4]
class ClassA: Object
    b: ClassB

    construct()
        b = new ClassB()
        stderr.printf("%d\n", b.c)

init
    a: ClassA
    a = new ClassA()

// vi: ft=genie
```


```shell
$ valac -o twofile.exe b.gs a.gs
```

