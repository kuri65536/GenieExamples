# Projects/Vala/LibSoupSample - GNOME Wiki!

# Soup Examples

Requires Vala >= 0.11.0 

## Getting Twitter Status

```genie
// vala-test:examples/soup-twitter.vala
[indent=4]
uses Soup
init
    // add your twitter username
    var username = "gnome";
    // format the URL to use the username as the filename
    var url = "http://twitter.com/users/%s.xml".printf (username);
    stdout.printf ("Getting status for %s\n", username);
    // create an HTTP session to twitter
    var session = new Soup.Session ();
    var message = new Soup.Message ("GET", url);
    // send the HTTP request and wait for response
    session.send_message (message);
    // output the XML result to stdout 
    stdout.write (message.response_body.data);
```

### Compile and Run
```shell
$ valac --pkg=libsoup-2.4 --thread twitter.vala
$ ./twitter
```


## A synchronous HTTP request

```genie
// vala-test:examples/soup-http-request.vala
[indent=4]

def f(name: string, value: string)
    stdout.printf ("Name: %s -> Value: %s\n", name, value);

init  //  () {
    var session = new Soup.Session()
    var message = new Soup.Message(
        "GET", "http://club.developpez.com/outils/wiki/KitODTKitOOoDVP")
    /* see if we need HTTP auth */
    session.authenticate += def(sess, msg, auth, retrying)
        if !retrying
            stdout.printf ("Authentication required\n");
            // it isn't the real IDs ;)
            auth.authenticate ("user", "password");
    /* send a sync request */
    session.send_message (message);
    message.response_headers.foreach(f)
    stdout.printf ("Message length: %lld\n%s\n",
                   message.response_body.length,
                   message.response_body.data);
```

### Compile and Run

```shell
$ valac --pkg=libsoup-2.4 --thread soup-sample.vala
$ ./soup-sample
```

An asynchronous request should look like this:

```
/* queue an async request */
session.queue_message (message, (sess, mess) => {
    stdout.printf ("Message length: %lld\n%s\n",
                   mess.response_body.length,
                   mess.response_body.data);
});
```

Note that currently the closure cannot use any variables outside the callback
scope. Bug 704176.


## A simple server example

```genie
// vala-test:examples/soup-http-server.vala
[indent=4]

def default_handler(server: Soup.Server, msg: Soup.Message, path: string,
                    query: GLib.HashTable?, client: Soup.ClientContext)
    response_text: string = """
        <html>
          <body>
            <p>Current location: %s</p>
            <p><a href="/xml">Test XML</a></p>
          </body>
        </html>""".printf (path);
    msg.set_response ("text/html", Soup.MemoryUse.COPY,
                      response_text.data);

def xml_handler(server: Soup.Server, msg: Soup.Message, path: string,
                query: GLib.HashTable?, client: Soup.ClientContext)
    var response_text = "<node><subnode>test</subnode></node>"
    msg.set_response ("text/xml", Soup.MemoryUse.COPY,
                      response_text.data);

init  //  () {
    var server = new Soup.Server (Soup.SERVER_PORT, 8088);
    server.add_handler ("/", default_handler);
    server.add_handler ("/xml", xml_handler);
    server.run ();
```

### Compile and Run

```shell
$ valac --pkg=libsoup-2.4 --thread soup-server-example.vala
$ ./soup-server-example
```

To try out run the server and in your browser go to http://localhost:8088/ and
http://localhost:8088/xml/


## XMLRPC example of Wordpress.sayHello

```genie
// vala-test:examples/soup-xmlrpc-test-hello.vala
[indent=4]
uses Soup

init  //  () {
    var message = XMLRPC.request_new ("http://kushaldas.wordpress.com/xmlrpc.php",
                                     "demo.sayHello");
    var session = new Session ();
    session.send_message (message);
    try
        v: Value
        XMLRPC.parse_method_response(
            (string)message.response_body.flatten().data, -1, out v);
        stdout.printf ("Got: %s\n", (string) v);
    except e: Error
        stderr.printf ("Error while processing the response: %s\n", e.message);
```

### Compile and Run

```shell
$ valac --pkg=libsoup-2.4 --thread soup-xmlrpc-test-hello.vala
$ ./soup-xmlrpc-test-hello
```


## Another XMLRPC example of adding two numbers

```genie
// vala-test:examples/soup-xmlrpc-test-addnumbers.vala
[indent=4]
uses Soup

init  //  () {
    var message = XMLRPC.request_new(
        "http://kushaldas.wordpress.com/xmlrpc.php",
                                     "demo.addTwoNumbers",
                                     typeof (int), 20,
                                     typeof (int), 30);
    var session = new Session ();
    session.send_message (message);
    try
        v: Value
        XMLRPC.parse_method_response ((string) message.response_body.flatten ().data, -1, out v);
        stdout.printf ("Result: %d\n", (int) v);
    except e: Error
        stderr.printf ("Error while processing the response: %s\n", e.message);
```

### Compile and Run

```shell
$ valac --pkg=libsoup-2.4 --thread soup-xmlrpc-test-addnumbers.vala
$ ./soup-xmlrpc-test-addnumbers
```

Vala/Examples Projects/Vala/LibSoupSample
    (last edited 2014-05-11 09:06:43 by AkshayShekher)
