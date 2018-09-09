# Delegate sample codes

```genie
// delegate.gs
[indent=4]

class Abc: Object
    delegate FuncCallback(a: int): bool

    callback: FuncCallback

    def callback_a(a: int): bool
        return true

    def callback_b(a: int): bool
        return false

init
    var a = new Abc()
    a.callback = a.callback_a
    stdout.printf("func a: %d\n", (int)a.callback(1))

    a.callback = a.callback_b
    stdout.printf("func b: %d\n", (int)a.callback(1))
```

```shell
$ valac --pkg=gee-0.8 delegate.gs -o tmp/delegate.exe
$ ./tmp/delegate.exe
func a: 1
func b: 0
```

<!--
vi: ft=markdown:et:sw=4:tw=80
  -->
