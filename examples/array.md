# Array in Genie

## Genie array as constant

```genie
[indent=4]
const a1: array of string = {"hello", "world", "I'm", "Genie"}
init
    for i in a1
        stdout.printf(@"$i ")
```


## Genie doesn't have jagged array

Wrapping array in the object.

```genie
[indent=4]
class JaggedArray: Object
    child: array of string

    construct(src: array of string)
        child = src

init
    var ary = new array of JaggedArray[3];
    ary[0] = new JaggedArray({"hello", "world", "I'm", "Genie"})
    ary[1] = new JaggedArray({"\nsecond", "sample", "is", "jagged", "array"})
    ary[2] = new JaggedArray({"\na", "b", "c"})
    for i in ary
        for j in i.child
            stdout.printf(@"$j ")
```



## Genie jagged array, part 2

use pointer to treat jagged array.

```genie
// array-3.gs
[indent=4]
/** dump jag array.
 * this code indicate the conversion from jagged array in Genie.
 * aim to use with extern C API/program.
 */
def fn(jag: array of void**)
    for i in jag
        var j = 0
        k: string* = i[j]
        while k != null
            stdout.printf("%s ", k)
            j += 1
            k = i[j]

init
    var ary = new array of void*[3]
    ary[0] = new array of string = {"hello", "world", "I'm", "Genie", null}
    ary[1] = new array of string = {"\nsecond", "sample", "is", "jagged",
                                    "array", null}
    ary[2] = new array of string = {"\na", "b", "c", null}
    fn(ary)
```

### Genie jagged array (failure code)

```failure code
// array-3-ng.gs
[indent=4]
/** dump jag array.
 * This code can be compiled with Genie.
 * But at runtime, this code cause segfault at `ary[j]`.
 * In c code for `var ary = (array of string)i`:
 *
 * ```
 * _tmp1_ = (((gchar**) _tmp0_) != NULL) ?
 *          _vala_array_dup1 ((gchar**) _tmp0_, -1) :
 *          ((gpointer) ((gchar**) _tmp0_));
 * ```
 *
 * so, _tmp1_ size is 0 and next `ary[j]` cause segfault.
 * we must use pointer to solve it.
 */
def fn(jag: array of void*)
    for i in jag
        var ary = (array of string)i
        var j = 0
        while i[j] != null
            stdout.printf("%s ", ary[j])
            j += 1

init
    var ary = new array of void*[3]
    ary[0] = new array of string = {"hello", "world", "I'm", "Genie", null}
    ary[1] = new array of string = {"\nsecond", "sample", "is", "jagged",
                                    "array", null}
    ary[2] = new array of string = {"\na", "b", "c", null}
    fn(ary)
```


<!--
 vi: ft=markdown:sw=4:tw=80:nowrap:fdm=marker
  -->
