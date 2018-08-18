# Projects/Vala/CharacterSample - GNOME Wiki!
## Vala Character Sample

This sample demonstrates how to extract each character from a Unicode string
and convert it to a Unicode character to get its type.
Requires Vala 0.12.0

```genie
// vala-test:examples/character.vala

void main () {
    string s = "1234567890 ١٢٣٤٥٦٧٨٩۰ ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz أبتةثجحخدذرزسشصضطظعغفقكلمنهوي";
    unichar c;
    for (int i = 0; s.get_next_char(ref i, out c);) {
        UnicodeType type = c.type ();
        stdout.printf ("'%s' is ", c.to_string ());
        switch (type) {
        case UnicodeType.UPPERCASE_LETTER:
            stdout.printf ("UPPERCASE_LETTER\n");
            break;
        case UnicodeType.LOWERCASE_LETTER:
            stdout.printf ("LOWERCASE_LETTER\n");
            break;
        case UnicodeType.OTHER_LETTER:
            stdout.printf ("OTHER_LETTER\n");
            break;
        case UnicodeType.DECIMAL_NUMBER:
            stdout.printf ("OTHER_NUMBER\n");
            break;
        case UnicodeType.SPACE_SEPARATOR:
            stdout.printf ("SPACE_SEPARATOR\n");
            break;
        }
    }
}
```


### Compile and Run

```shell
$ valac character.vala
$ ./character
```

Vala/Examples Projects/Vala/CharacterSample
    (last edited 2013-11-22 16:48:26 by WilliamJonMcCann)

