







Projects/Vala/AsyncSamples - GNOME Wiki!



<!--
var search_hint = "Search";
//-->




























Projects/Vala/AsyncSamplesHomeRecentChangesScheduleLogin







Contents
Async Method Samples
GIO Example
Background thread example
Generator example
Async sleep example
Simple Example 
Async Method Samples
These illustrate the use of async methods in Vala.  The Vala Tutorial has more details on using async methods.  See also GIO Samples which has a couple of examples which use async. 
GIO Example
This illustrates calling async methods from within an async method. // Example with GIO asynchronous methods:
// Build with: valac --pkg=gio-2.0 example.vala

async void list_dir() {
    var dir = File.new_for_path (Environment.get_home_dir());
    try {
        var e = yield dir.enumerate_children_async(
            FileAttribute.STANDARD_NAME, 0, Priority.DEFAULT, null);
        while (true) {
            var files = yield e.next_files_async(
                 10, Priority.DEFAULT, null);
            if (files == null) {
                break;
            }
            foreach (var info in files) {
                print(&quot;%s\n&quot;, info.get_name());
            }
        }
    } catch (Error err) {
        warning(&quot;Error: %s\n&quot;, err.message);
    }
}

void main() {
    var loop = new MainLoop();
    list_dir.begin((obj, res) =&gt; {
            list_dir.end(res);
            loop.quit();
        });
    loop.run();
}

Background thread example
This illustrates an async method which starts a background thread to do processing, and receives a result back from it when it is complete. It also illustrates catching exceptions from an async method. // Async method to run a slow calculation in a background thread.
// Build with: valac --pkg=gio-2.0 example.vala

/*
 * With Vala 0.38+ this should compile without warnings, although you may want
 * to use the valac option `--target-glib 2.44` in your own code for maximum 
 * compatibility with GTask callbacks.
 * With Vala 0.36 use `--target-glib 2.44` or `--target-glib 2.36` to avoid the 
 * GSimpleAsyncResult deprecated warnings
 * With Vala before 0.32 use `--target-glib 2.32` to expose the bindings for the Thread constructors
 * Vala 0.16 is the minimum version required
 */

async double do_calc_in_bg(double val) throws ThreadError {
    SourceFunc callback = do_calc_in_bg.callback;
    double[] output = new double[1];

    // Hold reference to closure to keep it from being freed whilst
    // thread is active.
    ThreadFunc&lt;bool&gt; run = () =&gt; {
        // Perform a dummy slow calculation.
        // (Insert real-life time-consuming algorithm here.)
        double result = 0;
        for (int a = 0; a&lt;100000000; a++)
            result += val * a;

        // Pass back result and schedule callback
        output[0] = result;
        Idle.add((owned) callback);
        return true;
    };
    new Thread&lt;bool&gt;(&quot;thread-example&quot;, run);

    // Wait for background thread to schedule our callback
    yield;
    return output[0];
}

void main(string[] args) {
    var loop = new MainLoop();
    do_calc_in_bg.begin(0.001, (obj, res) =&gt; {
            try {
                double result = do_calc_in_bg.end(res);
                stderr.printf(@&quot;Result: $result\n&quot;);
            } catch (ThreadError e) {
                string msg = e.message;
                stderr.printf(@&quot;Thread error: $msg\n&quot;);
            }
            loop.quit();
        });
    loop.run();
}

Generator example
This is based on Luca Bruno's Generator.  It illustrates using async methods to emulate a generator style of iterator coding.  Note that this runs fine without a main loop. // Build with: valac --pkg=gio-2.0 example.vala

abstract class Generator&lt;G&gt; {
    private bool consumed;
    private unowned G value;
    private SourceFunc callback;

    public Generator () {
        helper.begin ();
    }

    private async void helper () {
        yield generate ();
        consumed = true;
    }

    protected abstract async void generate ();

    protected async void feed (G value) {
        this.value = value;
        this.callback = feed.callback;
        yield;
    }

    public bool next () {
        return !consumed;
    }

    public G get () {
        var result = value;
        callback ();
        return result;
    }

    public Generator&lt;G&gt; iterator () {
        return this;
    }
}

class IntGenerator : Generator&lt;int&gt; {
    protected override async void generate () {
        for (int i=0; i &lt; 10; i++) {
             if (i%2 ==0) yield feed (i);
        }
    }
}

void main(string[] args) {
    var gen = new IntGenerator();

    foreach (var item in gen)
        stdout.printf(@&quot;Result: $item\n&quot;);
}

Async sleep example
This is a version of the venerable sleep() function which allows the main loop to continue iterating, and therefore will not block the UI: // Build with: valac --pkg=gio-2.0 example.vala

public async void nap (uint interval, int priority = GLib.Priority.DEFAULT) {
  GLib.Timeout.add (interval, () =&gt; {
      nap.callback ();
      return false;
    }, priority);
  yield;
}

private async void do_stuff () {
  yield nap (1000);
}

private static int main (string[] args) {
  GLib.MainLoop loop = new GLib.MainLoop ();
  do_stuff.begin ((obj, async_res) =&gt; {
      loop.quit ();
    });
  loop.run ();

  return 0;
}

Simple Example
// Demo class with async function
// Build with: valac --pkg=gio-2.0 example.vala

class Test.Async : GLib.Object {
    public async string say(string sentence) {
        GLib.Idle.add(this.say.callback);
        yield;
        return sentence;
    }
    public static int main(string[] args) {
        Test.Async myasync = new Test.Async();
        GLib.MainLoop mainloop = new GLib.MainLoop();
        myasync.say.begin(&quot;helloworld&quot;,
                          (obj, res) =&gt; {
                              string sentence = myasync.say.end(res);
                              print(&quot;%s\n&quot;, sentence);
                              mainloop.quit();
                          });
        mainloop.run();
        return 0;
    }
}
 Vala/Examples Projects/Vala/AsyncSamples  (last edited 2018-02-24 15:05:58 by AlThomas)











Search:
<input id="searchinput" type="text" name="value" value="" size="20"
    onfocus="searchFocus(this)" onblur="searchBlur(this)"
    onkeyup="searchChange(this)" onchange="searchChange(this)" alt="Search">
<input id="titlesearch" name="titlesearch" type="submit"
    value="Titles" alt="Search Titles">
<input id="fullsearch" name="fullsearch" type="submit"
    value="Text" alt="Search Full Text">



<!--// Initialize search form
var f = document.getElementById('searchform');
f.getElementsByTagName('label')[0].style.display = 'none';
var e = document.getElementById('searchinput');
searchChange(e);
searchBlur(e);
//-->



        Copyright &copy; 2005 -  The GNOME Project.
        Hosted by Red Hat.

  document.getElementById('current-year').innerHTML = new Date().getFullYear();



