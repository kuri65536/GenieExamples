Projects/Vala/LuaSample - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
Projects/Vala/LuaSampleHomeRecentChangesScheduleLogin
Lua Sample
vala-test:examples/lua-test.vala using Lua;
static int my_func (LuaVM vm) {
    stdout.printf (&quot;Vala Code From Lua Code! (%f)\n&quot;, vm.to_number (1));
    return 1;
}
static int main (string[] args) {
    string code = &quot;&quot;&quot;
            print &quot;Lua Code From Vala Code!&quot;
            my_func(33)
        &quot;&quot;&quot;;
    var vm = new LuaVM ();
    vm.open_libs ();
    vm.register (&quot;my_func&quot;, my_func);
    vm.do_string (code);
    return 0;
}
Compile and Run
$ valac --pkg lua luatest.vala -o luatest
$ ./luatest
Lua Code From Vala Code!
Vala Code From Lua Code! (33.000000)Note: Some distributions such as Debian and Ubuntu install the pkg-config information for Lua under a wrong name. Here's a workaround: sudo ln -s /usr/lib/pkgconfig/lua5.1.pc /usr/lib/pkgconfig/lua.pcAlternatively, you can rename the vapi file. 
Lua Table Sample
Based on Simple Lua Api Example from lua-users.org. vala-test:examples/lua-table.vala using Lua;
static int main () {
    var vm = new LuaVM ();
    vm.open_libs ();
    // Create a Lua table with name 'foo'
    vm.new_table ();
    for (int i = 1; i &lt;= 5; i++) {
        vm.push_number (i);         // Push the table index
        vm.push_number (i * 2);     // Push the cell value
        vm.raw_set (-3);            // Stores the pair in the table
    }
    vm.set_global (&quot;foo&quot;);
    // Ask Lua to run our little script
    vm.do_string (&quot;&quot;&quot;
        -- Receives a table, returns the sum of its components.
        io.write(&quot;The table the script received has:\n&quot;);
        x = 0
        for i = 1, #foo do
          print(i, foo[i])
          x = x + foo[i]
        end
        io.write(&quot;Returning data back to C\n&quot;);
        return x
    &quot;&quot;&quot;);
    // Get the returned value at the top of the stack (index -1)
    var sum = vm.to_number (-1);
    stdout.printf (&quot;Script returned: %.0f\n&quot;, sum);
    vm.pop (1);  // Take the returned value out of the stack
    return 0;
}
$ valac --pkg lua simplesample.vala -o simplesample
$ ./simplesample Vala/Examples Projects/Vala/LuaSample  (last edited 2013-11-22 16:48:28 by WilliamJonMcCann)
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
