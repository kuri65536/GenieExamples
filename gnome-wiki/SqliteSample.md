# Projects/Vala/SqliteSample - GNOME Wiki!

## Vala Sqlite Example

```genie
// vala-test:examples/sqlite.vala
/**
 * Using SQLite in Vala Sample Code
 * Port of an example found on the SQLite site.
 * http://www.sqlite.org/quickstart.html
 */
using GLib;
using Sqlite;
public class SqliteSample : GLib.Object {
    public static int callback (int n_columns, string[] values,
                                string[] column_names)
    {
        for (int i = 0; i < n_columns; i++) {
            stdout.printf ("%s = %s\n", column_names[i], values[i]);
        }
        stdout.printf ("\n");
        return 0;
    }
    public static int main (string[] args) {
        Database db;
        int rc;
        if (args.length != 3) {
            stderr.printf ("Usage: %s DATABASE SQL-STATEMENT\n", args[0]);
            return 1;
        }
        if (!FileUtils.test (args[1], FileTest.IS_REGULAR)) {
            stderr.printf ("Database %s does not exist or is directory\n", args[1]);
            return 1;
        }
        rc = Database.open (args[1], out db);
        if (rc != Sqlite.OK) {
            stderr.printf ("Can't open database: %d, %s\n", rc, db.errmsg ());
            return 1;
        }
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
        if (rc != Sqlite.OK) { 
            stderr.printf ("SQL error: %d, %s\n", rc, db.errmsg ());
            return 1;
        }
        return 0;
    }
}
```

### Compile and Run

```shell
$ valac --pkg sqlite3 -o sqlitesample SqliteSample.vala
$ ./sqlitesample
```

Retrieving rows from a database

```genie
using GLib;
using Sqlite;
void main (string[] args) {
    Database db;
    Statement stmt;
    int rc = 0;
    int col, cols;
    if (args.length != 3) {
        printerr ("Usage: %s DATABASE SQL-STATEMENT\n", args[0]);
        return;
    }
    if ((rc = Database.open (args[1], out db)) == 1) {
        printerr ("Can't open database: %s\n", db.errmsg ());
        return;
    }
    if ((rc = db.prepare_v2 (args[2], -1, out stmt, null)) == 1) {
        printerr ("SQL error: %d, %s\n", rc, db.errmsg ());
        return;
    }
    cols = stmt.column_count();
    do {
        rc = stmt.step();
        switch (rc) {
        case Sqlite.DONE:
            break;
        case Sqlite.ROW:
            for (col = 0; col < cols; col++) {
                string txt = stmt.column_text(col);
                print ("%s = %s\n", stmt.column_name (col), txt);
            }
            break;
        default:
            printerr ("Error: %d, %s\n", rc, db.errmsg ());
            break;
        }
    } while (rc == Sqlite.ROW);
}
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
$ valac --pkg sqlite3 -o sqlitesample2 SqliteSample2.vala
$ ./sqlitesample2 testdb "select * from tbl"
data = First row
num = 10.0
data = Second row
num = 20.0
```

Vala/Examples Projects/Vala/SqliteSample
    (last edited 2013-11-22 16:48:24 by WilliamJonMcCann)
