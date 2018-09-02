# Projects/Vala/GIONetworkingSample - GNOME Wiki!
# Networking with GIO

These examples demonstrate the networking functionality that has recently landed
in GLib as official part of GIO. You will need GLib version >= 2.22 (Check
with pkg-config glib-2.0 --modversion) and Vala >= 0.11.0 

## Synchronous Client Example

```genie
// vala-test:examples/gio-network-client.vala
[indent=4]
init
    var host = "www.google.com";
    try
        // Resolve hostname to IP address
        var resolver = Resolver.get_default ();
        var addresses = resolver.lookup_by_name (host, null);
        var address = addresses.nth_data (0);
        print (@"Resolved $host to $address\n");
        // Connect
        var client = new SocketClient ();
        var conn = client.connect (new InetSocketAddress (address, 80));
        print (@"Connected to $host\n");
        // Send HTTP GET request
        var message = @"GET / HTTP/1.1\r\nHost: $host\r\n\r\n";
        conn.output_stream.write (message.data);
        print ("Wrote request\n");
        // Receive response
        var response = new DataInputStream (conn.input_stream);
        var status_line = response.read_line (null).strip ();
        print ("Received status line: %s\n", status_line);
    except e: Error
        stderr.printf ("%s\n", e.message);
```

### Compile and Run

```shell
$ valac --pkg=gio-2.0 gio-network-client.gs
$ ./gio-network-client
```


## Asynchronous Client Example
```genie
// vala-test:examples/gio-network-client-async.vala
[indent=4]
class AsyncDemo
    loop: MainLoop

    construct(loop: MainLoop)
        this.loop = loop;

    def async http_request() raises Error
        try
            var resolver = Resolver.get_default ();
            var addresses = yield resolver.lookup_by_name_async ("www.google.com");
            var address = addresses.nth_data (0);
            print ("(async) resolved www.google.com to %s\n", address.to_string ());
            var socket_address = new InetSocketAddress (address, 80);
            var client = new SocketClient ();
            var conn = yield client.connect_async (socket_address);
            print ("(async) connected to www.google.com\n");
            var message = "GET / HTTP/1.1\r\nHost: www.google.com\r\n\r\n";
            yield conn.output_stream.write_async (message.data, Priority.DEFAULT);
            print ("(async) wrote request\n");
            // we set the socket back to blocking here for the convenience
            // of DataInputStream
            conn.socket.set_blocking (true);
            var input = new DataInputStream (conn.input_stream);
            message = input.read_line (null).strip ();
            print ("(async) received status line: %s\n", message);
        except e: Error
            stderr.printf ("%s\n", e.message);
        this.loop.quit ();

init
    var loop = new MainLoop ();
    var demo = new AsyncDemo (loop);
    demo.http_request.begin ();
    loop.run ();
```

### Compile and Run

```shell
$ valac --pkg=gio-2.0 gio-network-client-async.gs
$ ./gio-network-client-async
```


## Server Example

```genie
// vala-test:examples/gio-server.vala
[indent=4]
def process_request(input: InputStream, output: OutputStream) raises Error
    var data_in = new DataInputStream (input);
    line: string
    while (line = data_in.read_line (null)) != null
        stdout.printf ("%s\n", line);
        if line.strip() == ""
            break;
    var content = "<html><h1>Hello from Vala server</h1></html>"
    var header = new StringBuilder ();
    header.append ("HTTP/1.0 200 OK\r\n");
    header.append ("Content-Type: text/html\r\n");
    header.append_printf ("Content-Length: %lu\r\n\r\n", content.length);
    output.write (header.str.data);
    output.write (content.data);
    output.flush ();

init
    try
        var service = new SocketService ();
        service.add_inet_port (8080, null);
        service.start ();
        while true
            var conn = service.accept (null);
            process_request (conn.input_stream, conn.output_stream);
    except e: Error
        stderr.printf ("%s\n", e.message);
```

### Compile and Run

```shell
$ valac --pkg=gio-2.0 gio-server.gs
$ ./gio-server
```

Enter http://localhost:8080/ in your browser address bar.


## Asynchronous Server Example

```genie
[indent=4]
def on_incoming_connection(conn: SocketConnection): bool
    stdout.printf ("Got incoming connection\n");
    // Process the request asynchronously
    process_request.begin (conn);
    return true;

def async process_request(conn: SocketConnection)
    try
        var dis = new DataInputStream (conn.input_stream);
        var dos = new DataOutputStream (conn.output_stream);
        var req = yield dis.read_line_async (Priority.HIGH_IDLE);
        dos.put_string ("Got: %s\n".printf (req));
    except e: Error
        stderr.printf ("%s\n", e.message);

init
    try
        var srv = new SocketService ();
        srv.add_inet_port (3333, null);
        srv.incoming.connect (on_incoming_connection);
        srv.start ();
        new MainLoop ().run ();
    except e: Error
        stderr.printf ("%s\n", e.message);
```

### Compile and Run

```shell
$ valac --pkg=gio-2.0 gio-server-async.gs
$ ./gio-server-async
```

Connect to localhost via netcat or telnet on port 3333 and issue a command
ending with a newline.

```
$ echo "blub" | nc localhost 3333
```


## UDP Server example

```genie
// vala-test:examples/gio-udp-demo.vala
[indent=4]
def cb(s: Socket, cond: IOCondition): bool
    try
        var buffer = new array of uint8[4096]
        var read = (size_t)s.receive(buffer)
        buffer[read] = 0; // null-terminate string
        print ("Got %ld bytes of data: %s", (long) read, (string) buffer);
    except e: Error
        stderr.printf (e.message);
    return true;

init
    try
        var socket = new Socket (SocketFamily.IPV4,
                                 SocketType.DATAGRAM,
                                 SocketProtocol.UDP);
        var sa = new InetSocketAddress (new InetAddress.loopback (SocketFamily.IPV4),
                                        3333);
        socket.bind (sa, true);
        var source = socket.create_source (IOCondition.IN);
        source.set_callback(cb)
        source.attach (MainContext.default ());
        new MainLoop ().run ();
    except e: Error
        stderr.printf (e.message);
```

### Compile and Run

```shell
$ valac --pkg=gio-2.0 gio-udp-demo.gs
$ ./gio-udp-demoSend
```

some data to localhost via netcat on port 3333.

```shell
$  echo "blub" | nc -u 127.0.0.1 3333
```

Vala/Examples Projects/Vala/GIONetworkingSample
    (last edited 2013-11-22 16:48:26 by WilliamJonMcCann)
