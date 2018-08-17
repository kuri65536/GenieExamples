







Projects/Vala/GIONetworkingSample - GNOME Wiki!



<!--
var search_hint = "Search";
//-->




























Projects/Vala/GIONetworkingSampleHomeRecentChangesScheduleLogin








Networking with GIO
These examples demonstrate the networking functionality that has recently landed in GLib as official part of GIO. You will need GLib version &gt;= 2.22 (Check with pkg-config&nbsp;glib-2.0&nbsp;--modversion) and Vala &gt;= 0.11.0 
Synchronous Client Example
vala-test:examples/gio-network-client.vala void main () {
    var host = &quot;www.google.com&quot;;

    try {
        // Resolve hostname to IP address
        var resolver = Resolver.get_default ();
        var addresses = resolver.lookup_by_name (host, null);
        var address = addresses.nth_data (0);
        print (@&quot;Resolved $host to $address\n&quot;);

        // Connect
        var client = new SocketClient ();
        var conn = client.connect (new InetSocketAddress (address, 80));
        print (@&quot;Connected to $host\n&quot;);

        // Send HTTP GET request
        var message = @&quot;GET / HTTP/1.1\r\nHost: $host\r\n\r\n&quot;;
        conn.output_stream.write (message.data);
        print (&quot;Wrote request\n&quot;);

        // Receive response
        var response = new DataInputStream (conn.input_stream);
        var status_line = response.read_line (null).strip ();
        print (&quot;Received status line: %s\n&quot;, status_line);

    } catch (Error e) {
        stderr.printf (&quot;%s\n&quot;, e.message);
    }
}

Compile and Run
$ valac --pkg gio-2.0 gio-network-client.vala
$ ./gio-network-client
Asynchronous Client Example
vala-test:examples/gio-network-client-async.vala class AsyncDemo {

    private MainLoop loop;

    public AsyncDemo (MainLoop loop) {
        this.loop = loop;
    }

    public async void http_request () throws Error {
        try {
            var resolver = Resolver.get_default ();
            var addresses = yield resolver.lookup_by_name_async (&quot;www.google.com&quot;);
            var address = addresses.nth_data (0);
            print (&quot;(async) resolved www.google.com to %s\n&quot;, address.to_string ());

            var socket_address = new InetSocketAddress (address, 80);
            var client = new SocketClient ();
            var conn = yield client.connect_async (socket_address);
            print (&quot;(async) connected to www.google.com\n&quot;);

            var message = &quot;GET / HTTP/1.1\r\nHost: www.google.com\r\n\r\n&quot;;
            yield conn.output_stream.write_async (message.data, Priority.DEFAULT);
            print (&quot;(async) wrote request\n&quot;);

            // we set the socket back to blocking here for the convenience
            // of DataInputStream
            conn.socket.set_blocking (true);

            var input = new DataInputStream (conn.input_stream);
            message = input.read_line (null).strip ();
            print (&quot;(async) received status line: %s\n&quot;, message);
        } catch (Error e) {
            stderr.printf (&quot;%s\n&quot;, e.message);
        }

        this.loop.quit ();
    }
}

void main () {
    var loop = new MainLoop ();
    var demo = new AsyncDemo (loop);
    demo.http_request.begin ();
    loop.run ();
}

Compile and Run
$ valac --pkg gio-2.0 gio-network-client-async.vala
$ ./gio-network-client-async
Server Example
vala-test:examples/gio-server.vala void process_request (InputStream input, OutputStream output) throws Error {
    var data_in = new DataInputStream (input);
    string line;
    while ((line = data_in.read_line (null)) != null) {
        stdout.printf (&quot;%s\n&quot;, line);
        if (line.strip () == &quot;&quot;) break;
    }

    string content = &quot;&lt;html&gt;&lt;h1&gt;Hello from Vala server&lt;/h1&gt;&lt;/html&gt;&quot;;
    var header = new StringBuilder ();
    header.append (&quot;HTTP/1.0 200 OK\r\n&quot;);
    header.append (&quot;Content-Type: text/html\r\n&quot;);
    header.append_printf (&quot;Content-Length: %lu\r\n\r\n&quot;, content.length);

    output.write (header.str.data);
    output.write (content.data);
    output.flush ();
}

int main () {
    try {
        var service = new SocketService ();
        service.add_inet_port (8080, null);
        service.start ();
        while (true) {
            var conn = service.accept (null);
            process_request (conn.input_stream, conn.output_stream);
        }
    } catch (Error e) {
        stderr.printf (&quot;%s\n&quot;, e.message);
    }
    return 0;
}

Compile and Run
$ valac --pkg gio-2.0 gio-server.vala
$ ./gio-serverEnter http://localhost:8080/ in your browser address bar. 
Asynchronous Server Example
bool on_incoming_connection (SocketConnection conn) {
    stdout.printf (&quot;Got incoming connection\n&quot;);
    // Process the request asynchronously
    process_request.begin (conn);
    return true;
}

async void process_request (SocketConnection conn) {
    try {
        var dis = new DataInputStream (conn.input_stream);
        var dos = new DataOutputStream (conn.output_stream);
        string req = yield dis.read_line_async (Priority.HIGH_IDLE);
        dos.put_string (&quot;Got: %s\n&quot;.printf (req));
    } catch (Error e) {
        stderr.printf (&quot;%s\n&quot;, e.message);
    }
}

void main () {
    try {
        var srv = new SocketService ();
        srv.add_inet_port (3333, null);
        srv.incoming.connect (on_incoming_connection);
        srv.start ();
        new MainLoop ().run ();
    } catch (Error e) {
        stderr.printf (&quot;%s\n&quot;, e.message);
    }
}

Compile and Run
$ valac --pkg gio-2.0 gio-server-async.vala
$ ./gio-server-asyncConnect to localhost via netcat or telnet on port 3333 and issue a command ending with a newline. &nbsp;echo&nbsp;&quot;blub&quot;&nbsp;|&nbsp;nc&nbsp;localhost&nbsp;3333&nbsp; 
UDP Server example
vala-test:examples/gio-udp-demo.vala int main () {
    try {

        var socket = new Socket (SocketFamily.IPV4,
                                 SocketType.DATAGRAM, 
                                 SocketProtocol.UDP);
        var sa = new InetSocketAddress (new InetAddress.loopback (SocketFamily.IPV4),
                                        3333);
        socket.bind (sa, true);

        var source = socket.create_source (IOCondition.IN);
        source.set_callback ((s, cond) =&gt; {
            try {
                uint8 buffer[4096];
                size_t read = s.receive (buffer);
                buffer[read] = 0; // null-terminate string
                print (&quot;Got %ld bytes of data: %s&quot;, (long) read, (string) buffer);
            } catch (Error e) {
                stderr.printf (e.message);
            }
            return true;
        });
        source.attach (MainContext.default ());

        new MainLoop ().run ();
    } catch (Error e) {
        stderr.printf (e.message);
        return 1;
    }
    return 0;
}

Compile and Run
$ valac --pkg gio-2.0 gio-udp-demo.vala
$ ./gio-udp-demoSend some data to localhost via netcat on port 3333. &nbsp;echo&nbsp;&quot;blub&quot;&nbsp;|&nbsp;nc&nbsp;-u&nbsp;127.0.0.1&nbsp;3333&nbsp;  Vala/Examples Projects/Vala/GIONetworkingSample  (last edited 2013-11-22 16:48:26 by WilliamJonMcCann)











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



