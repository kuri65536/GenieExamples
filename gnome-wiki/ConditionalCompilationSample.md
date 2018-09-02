# Projects/Vala/ConditionalCompilationSample - GNOME Wiki!

# Vala Conditional Compilation Sample
A contrived example demonstrating conditional compilation usage and features.
This is not a macro preprocessor.

```genie
// vala-test:examples/conditional-compilation.vala
[indent=4]
init  //n () {
#if ( FOOBAR || FOO || BAR ) && (FOOBAR == FOO && FOO == BAR)
    message ("FOOBAR == FOO == BAR");
#endif
#if ! NOFOO && (FOOBAR || (FOO && BAR))
    message ("FOOBAR");
#elif FOO && ! NOFOO
    message ("FOO");
#elif BAR && ! NOFOO
    message ("BAR");
#elif NOFOO
#if FOOBAR || (FOO && BAR)
    message ("NOFOO FOOBAR");
#else
    message ("NOFOO");
#endif
#else
    message ("Nothing relevant defined");
#endif
```

### Compile and Run

```shell
$ valac -D FOOBAR conditional-compilation.gs
$ ./conditional-compilation
$ valac -D FOO -D BAR conditional-compilation.gs
$ ./conditional-compilation
$ valac -D FOO -D BAR -D FOOBAR -D NOFOO conditional-compilation.gs
$ ./conditional-compilation
```

Vala/Examples Projects/Vala/ConditionalCompilationSample
    (last edited 2013-11-22 16:48:26 by WilliamJonMcCann)

