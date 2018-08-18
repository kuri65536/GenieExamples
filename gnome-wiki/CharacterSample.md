# Projects/Vala/CharacterSample - GNOME Wiki!
## Vala Character Sample

This sample demonstrates how to extract each character from a Unicode string
and convert it to a Unicode character to get its type.
Requires Vala 0.12.0

```genie
// vala-test:examples/character.vala
[indent=4]
init
    // TODO(shimoda): make to const variable.
    s: string = "1234567890 ١٢٣٤٥٦٧٨٩۰ ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz أبتةثجحخدذرزسشصضطظعغفقكلمنهوي"
    c: unichar
    var i = 0
    while (s.get_next_char(ref i, out c))
        var type = c.type()
        stdout.printf ("'%s' is ", c.to_string ())
        case (type)
            when UnicodeType.UPPERCASE_LETTER
                stdout.printf ("UPPERCASE_LETTER\n")
            when UnicodeType.LOWERCASE_LETTER
                stdout.printf ("LOWERCASE_LETTER\n")
            when UnicodeType.OTHER_LETTER
                stdout.printf ("OTHER_LETTER\n")
            when UnicodeType.DECIMAL_NUMBER
                stdout.printf ("OTHER_NUMBER\n")
            when UnicodeType.SPACE_SEPARATOR
                stdout.printf ("SPACE_SEPARATOR\n")
```


### Compile and Run

```shell
$ valac character.vala
$ ./character
```

Vala/Examples Projects/Vala/CharacterSample
    (last edited 2013-11-22 16:48:26 by WilliamJonMcCann)

