/** compile command
 *
 * ```bash
 * valac --pkg gio-2.0 genie-https-get.gs
 * ./gui-test
 * ```
 *
 * this is equivalent to https://wiki.gnome.org/Projects/Vala/GIONetworkingSample
 * but these sample can't compile with my ubuntu 18.04 valac.
 */
[indent=4]
init
    var host = "www.google.com"

    // Resolve hostname to IP address
    var resolver = Resolver.get_default()

    address: GLib.InetAddress
    try
        var addresses = resolver.lookup_by_name(host, null)
        address = addresses.nth_data(0)
        print(@"Resolved $host to $address\n")
    except ex: Error
        stderr.printf("%s\n", ex.message)
        return

    // Connect
    conn: GLib.SocketConnection
    var client = new SocketClient()
    client.tls = true
    try
        // NG: conn = client.connect(new InetSocketAddress(address, 443))
        conn = client.connect_to_host(host, 443)
        print(@"Connected to $host\n")
    except ex: Error
        stderr.printf("error: %s\n", ex.message)
        return

    // Send HTTP GET request
    var message = @"GET / HTTP/1.1\r\nHost: $host\r\n\r\n"
    conn.output_stream.write(message.data)
    print("Wrote request\n")

    try
        // Receive response
        var response = new DataInputStream(conn.input_stream)
        var status_line = response.read_line (null).strip()
        print("Received status line: %s\n", status_line)
    except ex: Error
        stderr.printf("%s\n", ex.message)

// vi: ft=genie:et:ts=4