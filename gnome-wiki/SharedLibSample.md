# Projects/Vala/SharedLibSample - GNOME Wiki!

## Contents

- About
- The sample
- The Library
- A Client Program Written in Vala
- Calling Vala Functions Using Introspection
- A Client Program Written in Javascript
- Creating a Shared Library in Vala

## About
In addition to standalone applications, you can use Vala to build shared
libraries. By using the compile-time flag --library, you can generate a shared
library that can be used from another program written in Vala or any other
language.  The sample code below includes a shared library written in Vala plus
a separate Vala program that calls functions from the shared library.

## The sample

## The Library
Our shared library,

```genie
// test_shared.gs:
[indent=4]
namespace MyMath
    def sum(a: int, b: int): int
        return(a + b);

    def square(a: int): int
        return(a * a);
```

Compiling to generate the VAPI and shared library:

```shell
$ valac --library=test_shared -H test_shared.h test_shared.gs \
    -X -fPIC -X -shared -o test_shared.so
```

You use the --library flag to indicate to the compiler that you're building a
shared library.

You can add a --vapi=filename  flag to cause the generated VAPI to have a
specific name; if you omit this, the generated VAPI will have the same name as
the Vala source file.

The -H flag tells the compiler to export a C header containing the methods
exposed in the VAPI. You use the -X flag to indicate that the next flag should
be passed to the C compiler.

You use the -fPIC flag to tell the C compiler to generate position-independent
code; this is needed because the functions in a shared library may be loaded at
almost any address in memory.

## A Client Program Written in Vala
Our program that needs to access functionality from the library,

```genie
// main.gs:
[indent=4]
uses MyMath

init  // id main() {
    stdout.printf("\nTesting shlib");
    stdout.printf("\n\t2 + 3 is %d", sum(2, 3));
    stdout.printf("\n\t8 squared is %d\n", square(8));
```

Compiling to create an executable:

```shell
$ valac test_shared.vapi main.gs -X test_shared.so -X -I. -o valatest
```

You use the -X -I. flag to tell the C compiler to search the current directory
for #included files. One final caveat - if the shared library you’ve just
compiled isn’t yet installed system-wide, you’ll need to tell the linker where
to find it:

```
$ export LD_LIBRARY_PATH=.
```

Finally, running the executable to obtain the desired output:

```
$ ./valatest
Testing shlib
    2 + 3 is 5
    8 squared is 64
$
```

## Calling Vala Functions Using Introspection
To use code written in vala from a third language (e.g. JavaScript via gjs) you
can use GObject's introspection (gi) capabilities. Taking the library code above
(it is important to provide a namespace), you just need to use slightly
different compile switches, to tell valac additionally generate some
introspection metadata:

```
$ valac test_shared.gs -X -fPIC -X -shared -o test_shared.so \
    --library=testShared --gir testShared-0.1.gir
```

Afterwards you need to compile the introspection informations (the .gir file)
into a binary format using the 'g-ir-compiler':

```
$ g-ir-compiler --shared-library=test_shared.so \
    --output=testShared-0.1.typelib testShared-0.1.gir
```

Having done this you are able to use your library from another language using
introspection.

## A Client Program Written in Javascript
Take for example the following 'client.js' file:

```javascript
const T = imports.gi.testShared;
print ("Result: " + T.square(42));
```

And finally run (and call the library code using gi) it with:

```
GI_TYPELIB_PATH=. LD_LIBRARY_PATH=. gjs client.js
** (gjs:8275): DEBUG: Command line: gjs client.js
** (gjs:8275): DEBUG: Creating new context to eval console script
Result: 1764
```


You can get examples for other languages in this github repository:

https://github.com/antono/vala-object  Vala/Examples

Projects/Vala/SharedLibSample
    (last edited 2016-09-19 19:38:10 by AlThomas)

