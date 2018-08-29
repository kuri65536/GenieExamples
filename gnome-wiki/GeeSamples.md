# Projects/Vala/GeeSamples - GNOME Wiki!

Contents

- List Example
- Set Example
- Map Example
- Syntactic Sugar
- Customizing the equality function
- Implementing your own Iterable

Vala Home Vala Collections: libgeeYou should install the Vala collection
library, libgee, from your distribution. More information about libgee is
available from https://wiki.gnome.org/Projects/Libgee Gee API Documentation

## List Example

```genie
// vala-test:examples/gee-list.vala
[indent=4]
uses Gee
init
    var lst = new list of int
    lst.add (1);
    lst.add (2);
    lst.add (5);
    lst.add (4);
    lst.insert (2, 3);
    lst.remove_at (3);
    for i in lst
        stdout.printf("%d\n", i)
    lst[2] = 10;                       // same as list.set (2, 10)
    stdout.printf("%d\n", lst[2])    // same as list.get (2)
```

### Compile and Run

```shell
$ valac --pkg=gee-0.8 gee-list.vala
$ ./gee-list
```

You can use any type fitting into the size of a pointer (e.g. int, bool,
reference types) directly as generic type argument: <bool>, <int>, <string>,
<MyObject>. Other types must be "boxed" by appending a question mark: <float?>,
<double?>, <MyStruct?>.  The compiler will tell you this if necessary. 


## Set Example
Sets are unordered and do not contain duplicate elements.

```genie
// vala-test:examples/gee-set.vala
[indent=4]
uses Gee

init
    var my_set = new HashSet of string()
    my_set.add ("one");
    my_set.add ("two");
    my_set.add ("three");
    my_set.add ("two");         // will not be added because it's a duplicate
    for s in my_set
        stdout.printf ("%s\n", s);
```

### Compile and Run

```shell
$ valac --pkg=gee-0.8 gee-set.vala
$ ./gee-set
```


## Map Example
Maps work like a dictionary. They store key - value pairs.

```genie
// vala-test:examples/gee-map.vala
[indent=4]
uses Gee

init
    var map = new HashMap of string, int()
    // Setting values
    map.set ("one", 1);
    map.set ("two", 2);
    map.set ("three", 3);
    map["four"] = 4;            // same as map.set ("four", 4)
    map["five"] = 5;
    // Getting values
    var a = map.get ("four");
    var b = map["four"];        // same as map.get ("four")
    assert (a == b);
    // Iteration
    stdout.printf ("Iterating over entries\n");
    for entry in map.entries
        stdout.printf ("%s => %d\n", entry.key, entry.value);
    stdout.printf ("Iterating over keys only\n");
    for key in map.keys
        stdout.printf ("%s\n", key);
    stdout.printf ("Iterating over values only\n");
    for value in map.values
        stdout.printf ("%d\n", value);
    stdout.printf ("Iterating via 'for' statement\n");
    var it = map.map_iterator ();
    var has_next = it.next()
    while has_next
        stdout.printf ("%d\n", it.get_value ());
        has_next = it.next()
```

### Compile and Run

```shell
$ valac --pkg=gee-0.8 gee-map.vala
$ ./gee-map
```


## Syntactic Sugar
There's syntactic sugar for testing if a collection contains an element:

```
if ("three" in my_set) {    // same as my_set.contains ("three")
    stdout.printf ("heureka\n");
}
```


## Customizing the equality function

```
bool same_book (Book a, Book b) {
    return a.isbn == b.isbn;
}
// ...
var books = new Gee.ArrayList<Book> ((EqualFunc) same_book);
```


## Implementing your own Iterable
You will have to implement two interfaces: Iterable with an iterator () method
and an element_type property as well as an Iterator.

```genie
// vala-test:examples/gee-iterable.vala
[indent=4]
uses Gee

class RangeIterator: Object implements Iterator of int
    range: Range
    current: int

    construct(range: Range)
        this.range = range;
        this.current = range.from - 1;

    def next(): bool
        if !has_next()
            return false;
        this.current++;
        return true;

    def has_next(): bool
        return this.current < this.range.to;

    def first(): bool
        this.current = range.from;
        return true;

    /* Here the 'new' keyword is used because Object already
       has a 'get' method. This will hide the original method.
       Otherwise you'll get a warning. */
    def new get(): int
        return this.current;

    def remove()
        assert_not_reached ();

    prop read_only: bool
        get
            return true

    prop valid: bool
        get
            return true

class Range: Object implements Iterable of int
    from: int   // { get; private set; }
    to: int  // { get; private set; }

    construct(from: int, to: int)
        assert (from < to);
        this.from = from;
        this.to = to;

    prop element_type: Type
        get
            return typeof(int)

    def iterator(): Iterator of int
        return new RangeIterator (this);

init
    for i in new Range(10, 20)
        stdout.printf ("%d\n", i);
```

### Compile and Run

```shell
$ valac --pkg=gee-0.8 iterable.vala
$ ./iterable
```

You could even add an each () method for Ruby or Groovy style iteration.

```genie
class Range: Object implements Iterable of int
    // ... (as above)
    delegate void RangeEachFunc (int i);

    def each(RangeEachFunc each_func)
        for i in this
            each_func(i)


def fn(i: int)
    stdout.printf ("%d\n", i);


init
    // Pass an anonymous function as parameter
    new Range(10, 20).each(fn);
```

Vala/Examples Projects/Vala/GeeSamples
    (last edited 2016-08-09 15:55:57 by AlThomas)
