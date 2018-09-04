# Projects/Vala/JsonSample - GNOME Wiki!

# Genie JSON Samples

## Gisgraphy Web Service

This sample shows usage of json-glib combined with libsoup as a HTTP client. The
sample uses the Gisgraphy web service as a source for a sample JSON document.
Requires Vala >= 0.11.0

```genie
// vala-test:examples/json-sample.vala
[indent=4]
init
    var uri = "http://services.gisgraphy.com/fulltext/fulltextsearch?"
    uri += "q=%s&format=JSON&indent=true&lang=en&from=1&to=10".printf("asakusa")
    var session = new Soup.Session ();
    var message = new Soup.Message ("GET", uri);
    session.send_message (message);
    try
        var parser = new Json.Parser ();
        parser.load_from_data ((string) message.response_body.flatten ().data, -1);
        var root_object = parser.get_root ().get_object ();
        var response = root_object.get_object_member ("response");
        var results = response.get_array_member ("docs");
        var count = results.get_length ();
        var total = response.get_int_member ("numFound");
        stdout.printf ("got %lld out of %lld results:\n\n", count, total);
        for geonode in results.get_elements()
            var geoname = geonode.get_object ();
            stdout.printf ("%s\n%s\n%f\n%f\n\n",
                          geoname.get_string_member ("name"),
                          geoname.get_string_member ("country_name"),
                          geoname.get_double_member ("lng"),
                          geoname.get_double_member ("lat"));
    except e: Error
        stderr.printf ("I guess something is not working...\n");
```

### Compile and Run

- prerequiste on Ubuntu 18.04

```
$ apt install libsoup2.4-dev
$ apt install libjson-glib-dev
```

```shell
$ valac --thread --pkg=libsoup-2.4 --pkg=json-glib-1.0 json-sample.gs
$ ./jsonsample
```


## Glosbe translation API

This sample uses libsoup and json-glib to translate text via the Glosbe API.
Requires Vala >= 0.11.0

```genie
// vala-test:examples/json-translator.vala
[indent=4]

def translate(text: string, input_language: string,
              output_language: string): string raises Error

    var uri = "http://glosbe.com/gapi/translate?phrase=";
    var full_uri = "%s%s&from=%s&dest=%s&format=json&pretty=true".printf(uri,
                                 Soup.URI.encode (text, null),
                                 input_language, output_language);
    var session = new Soup.Session ();
    var message = new Soup.Message ("GET", full_uri);
    session.send_message (message);
    var parser = new Json.Parser ();
    parser.load_from_data ((string) message.response_body.flatten ().data, -1);
    var root_object = parser.get_root ().get_object ();
    var translated_text = root_object.get_array_member ("tuc") \
                                        .get_object_element (0) \
                                        .get_object_member ("phrase") \
                                        .get_string_member ("text")
    return translated_text;

init  //  () {
    try
        var original_text = "Hello World";
        var translated_text = translate (original_text, "eng", "spa");
        stdout.printf ("Translated text: %s\n", translated_text);
    except e: Error
        stderr.printf ("I think something went wrong!\n");
```

### Compile and Run

```shell
$ valac --thread --pkg=libsoup-2.4 --pkg=json-glib-1.0 json-translator.gs
$ ./json-translator
```


## Transmission RPC Interface
This example generates a JSON request object which is send via HTTP to the
transmission-daemon which in turn returns the torrent data as JSON.

```genie
[indent=4]
uses Soup
uses Json

class Transmission
    session: SessionAsync
    user: string
    password: string
    path: string
    sessionid: string
    std_fields: static array of string = {
        "id", "name", "percentDone",
        "rateDownload", "rateUpload", "sizeWhenDone"}

    construct(host: string, port: int, user: string?, password: string?)
        if user != null and password != null
            this.user = user
            this.password = password
        path = @"http://$host:$port/transmission/rpc";
        session = new SessionAsync();
        //In case you setup Transmission with authentication this sets a callback for handling it
        session.authenticate.connect(auth);
        //Newer Transmission versions require a sessionid to be carried with each request. Get one!
        var msg = new Message("GET", path);
        session.send_message(msg);
        sessionid = msg.response_headers.get_one("X-Transmission-Session-Id")
        if sessionid == null
            error("Transmission version to old or not configured on that port");

    def request_list()
        length: size_t
        json: string
        var msg = new Message("POST", path);
        //Start a Generator and setup some fields for it
        var gen = new Generator();
        var root = new Json.Node(NodeType.OBJECT);
        var object = new Json.Object();
        root.set_object(object);
        gen.set_root(root);
        var args = new Json.Object();
        object.set_object_member("arguments", args);
        object.set_string_member("method", "torrent-get");
        var fields = new Json.Array();
        for s in std_fields
            fields.add_string_element(s);
        args.set_array_member("fields", fields);
        //Send the request json to the server and carry the sessionid along with the request
        json = gen.to_data(out length);
        msg.request_body.append_take(json.data);
        msg.request_headers.append("X-Transmission-Session-Id", sessionid);
        session.send_message(msg);
        try
            //Setup a Parser and load the data from the transmission response
            var parser = new Json.Parser();
            parser.load_from_data((string)msg.response_body.flatten().data, -1);
            //This basically iterates the whole json tree of elements down to the one with the torrent informations
            var info = parser.get_root().get_object().get_object_member("arguments").get_array_member("torrents").get_elements();
            for node in info
                var obj = node.get_object();
                stdout.printf("%d: %s - %.2f%% [%.2f/%.2f] %d byte\n",
                    (int)obj.get_int_member("id"),
                    obj.get_string_member("name"),
                    (float)obj.get_double_member("percentDone")*100,
                    (float)obj.get_double_member("rateDownload"),
                    (float)obj.get_double_member("rateUpload"),
                    (int)obj.get_int_member("sizeWhenDone"));
        except e: Error
            error("%s", e.message);

    def auth(msg: Message, auth: Auth, retry: bool)
        if user != null and password != null
            auth.authenticate(user, password);
        else if retry
            error("Wrong username/password");
        else
            error("Transmission server requires authentication");


init  //  static void main() {
    var t = new Transmission("127.0.0.1", 9091, null, null);
    t.request_list();
```

### Compile and Run

```shell
$ valac --thread --pkg=libsoup-2.4 --pkg=json-glib-1.0 transmission-rpc.gs
$ ./transmission-rpc
```

Vala/Examples Projects/Vala/JsonSample
    (last edited 2014-03-04 13:27:43 by StefanTalpalaru)
