# Projects/Vala/SqliteSample - GNOME Wiki!

## Vala Sqlite Example

```genie
// vala-test:examples/sqlite.vala
/**
 * Using SQLite in Vala Sample Code
 * Port of an example found on the SQLite site.
 * http://www.sqlite.org/quickstart.html
 */
[indent=4]
uses GLib
uses Sqlite

class SqliteSample: GLib.Object
    def static callback(n_columns: int, values: array of string,
                        column_names: array of string): int
        var i = 0
        while i < n_columns
            stdout.printf ("%s = %s\n", column_names[i], values[i]);
            i += 1
        stdout.printf ("\n");
        return 0;

    def static main(args: array of string): int
        db: Database
        if args.length != 3
            stderr.printf ("Usage: %s DATABASE SQL-STATEMENT\n", args[0]);
            return 1;
        if !FileUtils.test(args[1], FileTest.IS_REGULAR)
            stderr.printf ("Database %s does not exist or is directory\n", args[1]);
            return 1;
        var rc = Database.open (args[1], out db);
        if rc != Sqlite.OK
            stderr.printf ("Can't open database: %d, %s\n", rc, db.errmsg ());
            return 1;
        rc = db.exec (args[2], callback, null);
        /* maybe it is better to use closures, so you can access local variables, eg: */
        /*rc = db.exec(args[2], (n_columns, values, column_names) => {
            for (int i = 0; i < n_columns; i++) {
                stdout.printf ("%s = %s\n", column_names[i], values[i]);
            }
            stdout.printf ("\n");
            return 0;
            }, null);
        */
        if rc != Sqlite.OK
            stderr.printf ("SQL error: %d, %s\n", rc, db.errmsg ());
            return 1;
        return 0;
```

### Compile and Run

```shell
$ valac --pkg=sqlite3 -o sqlitesample SqliteSample.vala
$ ./sqlitesample
```

Retrieving rows from a database

```genie
[indent=4]
uses GLib
uses Sqlite

init  // (string[] args) {
    db: Database
    stmt: Statement
    var rc = 0
    if args.length != 3
        printerr ("Usage: %s DATABASE SQL-STATEMENT\n", args[0]);
        return;

    if (rc = Database.open (args[1], out db)) == 1
        printerr ("Can't open database: %s\n", db.errmsg ());
        return;

    if (rc = db.prepare_v2 (args[2], -1, out stmt, null)) == 1
        printerr ("SQL error: %d, %s\n", rc, db.errmsg ());
        return;

    var cols = stmt.column_count()
    do
        rc = stmt.step();
        case rc
            when Sqlite.DONE
                pass
            when Sqlite.ROW
                var col = 0
                while col < cols
                    var txt = stmt.column_text(col)
                    print ("%s = %s\n", stmt.column_name (col), txt);
                    col++
            default
                printerr ("Error: %d, %s\n", rc, db.errmsg ());
    while (rc == Sqlite.ROW);
```

Set up a database to test

```
$ sqlite3 testdb << EOF
CREATE TABLE tbl (data TEXT, num DOUBLE);
INSERT INTO tbl VALUES ("First row", 10);
INSERT INTO tbl VALUES ("Second row", 20);
EOF
```

### Compile and run

```shell
$ valac --pkg=sqlite3 -o sqlitesample2 SqliteSample2.vala
$ ./sqlitesample2 testdb "select * from tbl"
data = First row
num = 10.0
data = Second row
num = 20.0
```

Vala/Examples Projects/Vala/SqliteSample
    (last edited 2013-11-22 16:48:24 by WilliamJonMcCann)
