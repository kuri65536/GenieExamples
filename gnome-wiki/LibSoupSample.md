Projects/Vala/LibSoupSample - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
Projects/Vala/LibSoupSampleHomeRecentChangesScheduleLogin
Soup Examples
Requires Vala &gt;= 0.11.0 
Getting Twitter Status
vala-test:examples/soup-twitter.vala using Soup;
void main () {
    // add your twitter username
    string username = &quot;gnome&quot;;
    // format the URL to use the username as the filename
    string url = &quot;http://twitter.com/users/%s.xml&quot;.printf (username);
    stdout.printf (&quot;Getting status for %s\n&quot;, username);
    // create an HTTP session to twitter
    var session = new Soup.Session ();
    var message = new Soup.Message (&quot;GET&quot;, url);
    // send the HTTP request and wait for response
    session.send_message (message);
    // output the XML result to stdout 
    stdout.write (message.response_body.data);
}
Compile and Run
$ valac --pkg libsoup-2.4 --thread twitter.vala
$ ./twitter
A synchronous HTTP request
vala-test:examples/soup-http-request.vala void main () {
    var session = new Soup.Session ();
    var message = new Soup.Message (&quot;GET&quot;, &quot;http://club.developpez.com/outils/wiki/KitODTKitOOoDVP&quot;);
    /* see if we need HTTP auth */
    session.authenticate.connect ((sess, msg, auth, retrying) =&gt; {
        if (!retrying) {
            stdout.printf (&quot;Authentication required\n&quot;);
            // it isn't the real IDs ;)
            auth.authenticate (&quot;user&quot;, &quot;password&quot;);
        }
    });
    /* send a sync request */
    session.send_message (message);
    message.response_headers.foreach ((name, val) =&gt; {
        stdout.printf (&quot;Name: %s -&gt; Value: %s\n&quot;, name, val);
    });
    stdout.printf (&quot;Message length: %lld\n%s\n&quot;,
                   message.response_body.length,
                   message.response_body.data);
}
Compile and Run
$ valac --pkg libsoup-2.4 --thread soup-sample.vala
$ ./soup-sampleAn asynchronous request should look like this: /* queue an async request */
session.queue_message (message, (sess, mess) =&gt; {
    stdout.printf (&quot;Message length: %lld\n%s\n&quot;,
                   mess.response_body.length,
                   mess.response_body.data);
});
Note that currently the closure cannot use any variables outside the callback scope. Bug 704176. 
A simple server example
vala-test:examples/soup-http-server.vala void default_handler (Soup.Server server, Soup.Message msg, string path,
                      GLib.HashTable? query, Soup.ClientContext client)
{
    string response_text = &quot;&quot;&quot;
        &lt;html&gt;
          &lt;body&gt;
            &lt;p&gt;Current location: %s&lt;/p&gt;
            &lt;p&gt;&lt;a href=&quot;/xml&quot;&gt;Test XML&lt;/a&gt;&lt;/p&gt;
          &lt;/body&gt;
        &lt;/html&gt;&quot;&quot;&quot;.printf (path);
    msg.set_response (&quot;text/html&quot;, Soup.MemoryUse.COPY,
                      response_text.data);
}
void xml_handler (Soup.Server server, Soup.Message msg, string path,
                  GLib.HashTable? query, Soup.ClientContext client)
{
    string response_text = &quot;&lt;node&gt;&lt;subnode&gt;test&lt;/subnode&gt;&lt;/node&gt;&quot;;
    msg.set_response (&quot;text/xml&quot;, Soup.MemoryUse.COPY,
                      response_text.data);
}
void main () {
    var server = new Soup.Server (Soup.SERVER_PORT, 8088);
    server.add_handler (&quot;/&quot;, default_handler);
    server.add_handler (&quot;/xml&quot;, xml_handler);
    server.run ();
}
Compile and Run
$ valac --pkg libsoup-2.4 --thread soup-server-example.vala
$ ./soup-server-exampleTo try out run the server and in your browser go to http://localhost:8088/ and http://localhost:8088/xml/ 
XMLRPC example of Wordpress.sayHello
vala-test:examples/soup-xmlrpc-test-hello.vala using Soup;
void main () {
    var message = XMLRPC.request_new (&quot;http://kushaldas.wordpress.com/xmlrpc.php&quot;,
                                     &quot;demo.sayHello&quot;);
    var session = new Session ();
    session.send_message (message);
    try {
        Value v;
        XMLRPC.parse_method_response ((string) message.response_body.flatten ().data, -1, out v);
        stdout.printf (&quot;Got: %s\n&quot;, (string) v);
    } catch (Error e) {
        stderr.printf (&quot;Error while processing the response: %s\n&quot;, e.message);
    }
}
Compile and Run
$ valac --pkg libsoup-2.4 --thread soup-xmlrpc-test-hello.vala
$ ./soup-xmlrpc-test-hello
Another XMLRPC example of adding two numbers
vala-test:examples/soup-xmlrpc-test-addnumbers.vala using Soup;
void main () {
    var message = XMLRPC.request_new (&quot;http://kushaldas.wordpress.com/xmlrpc.php&quot;,
                                     &quot;demo.addTwoNumbers&quot;,
                                     typeof (int), 20,
                                     typeof (int), 30);
    var session = new Session ();
    session.send_message (message);
    try {
        Value v;
        XMLRPC.parse_method_response ((string) message.response_body.flatten ().data, -1, out v);
        stdout.printf (&quot;Result: %d\n&quot;, (int) v);
    } catch (Error e) {
        stderr.printf (&quot;Error while processing the response: %s\n&quot;, e.message);
    }
}
Compile and Run
$ valac --pkg libsoup-2.4 --thread soup-xmlrpc-test-addnumbers.vala
$ ./soup-xmlrpc-test-addnumbers Vala/Examples Projects/Vala/LibSoupSample  (last edited 2014-05-11 09:06:43 by AkshayShekher)
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
