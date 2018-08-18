Projects/Vala/JsonSample - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
Projects/Vala/JsonSampleHomeRecentChangesScheduleLogin
Vala JSON Samples
Gisgraphy Web Service
This sample shows usage of json-glib combined with libsoup as a HTTP client. The sample uses the Gisgraphy web service as a source for a sample JSON document. Requires Vala &gt;= 0.11.0 vala-test:examples/json-sample.vala void main () {
    var uri = &quot;http://services.gisgraphy.com/fulltext/fulltextsearch?q=%s&amp;format=JSON&amp;indent=true&amp;lang=en&amp;from=1&amp;to=10&quot;.printf (&quot;asakusa&quot;);
    var session = new Soup.Session ();
    var message = new Soup.Message (&quot;GET&quot;, uri);
    session.send_message (message);
    try {
        var parser = new Json.Parser ();
        parser.load_from_data ((string) message.response_body.flatten ().data, -1);
        var root_object = parser.get_root ().get_object ();
        var response = root_object.get_object_member (&quot;response&quot;);
        var results = response.get_array_member (&quot;docs&quot;);
        int64 count = results.get_length ();
        int64 total = response.get_int_member (&quot;numFound&quot;);
        stdout.printf (&quot;got %lld out of %lld results:\n\n&quot;, count, total);
        foreach (var geonode in results.get_elements ()) {
            var geoname = geonode.get_object ();
            stdout.printf (&quot;%s\n%s\n%f\n%f\n\n&quot;,
                          geoname.get_string_member (&quot;name&quot;),
                          geoname.get_string_member (&quot;country_name&quot;),
                          geoname.get_double_member (&quot;lng&quot;),
                          geoname.get_double_member (&quot;lat&quot;));
        }
    } catch (Error e) {
        stderr.printf (&quot;I guess something is not working...\n&quot;);
    }
}
Compile and Run
$ valac --thread --pkg libsoup-2.4 --pkg json-glib-1.0 json-sample.vala
$ ./jsonsample
Glosbe translation API
This sample uses libsoup and json-glib to translate text via the Glosbe API. Requires Vala &gt;= 0.11.0 vala-test:examples/json-translator.vala string translate (string text, string input_language, string output_language) throws Error {
    string uri = &quot;http://glosbe.com/gapi/translate&quot;;
    string full_uri = &quot;%s?phrase=%s&amp;from=%s&amp;dest=%s&amp;format=json&amp;pretty=true&quot;.printf (uri,
                                 Soup.URI.encode (text, null),
                                 input_language, output_language);
    var session = new Soup.Session ();
    var message = new Soup.Message (&quot;GET&quot;, full_uri);
    session.send_message (message);
    var parser = new Json.Parser ();
    parser.load_from_data ((string) message.response_body.flatten ().data, -1);
    var root_object = parser.get_root ().get_object ();
    string translated_text = root_object.get_array_member (&quot;tuc&quot;)
                                        .get_object_element (0)
                                        .get_object_member (&quot;phrase&quot;)
                                        .get_string_member (&quot;text&quot;);
    return translated_text;
}
void main () {
    try {
        string original_text = &quot;Hello World&quot;;
        string translated_text = translate (original_text, &quot;eng&quot;, &quot;spa&quot;);
        stdout.printf (&quot;Translated text: %s\n&quot;, translated_text);
    } catch (Error e) {
        stderr.printf (&quot;I think something went wrong!\n&quot;);
    }
}
Compile and Run
$ valac --thread --pkg libsoup-2.4 --pkg json-glib-1.0 json-translator.vala
$ ./json-translator
Transmission RPC Interface
This example generates a JSON request object which is send via HTTP to the transmission-daemon which in turn returns the torrent data as JSON. using Soup;
using Json;
class Transmission {
   private SessionAsync session;
   private string user;
   private string password;
   private string path;
   private string sessionid;
   private static string[] std_fields = { &quot;id&quot;,&quot;name&quot;,&quot;percentDone&quot;,&quot;rateDownload&quot;,&quot;rateUpload&quot;,&quot;sizeWhenDone&quot;};
   public Transmission(string host, int port, string? user, string? password) {
      if(user != null &amp;&amp; password != null) {
         this.user = user; this.password = password;
      }
      path = @&quot;http://$host:$port/transmission/rpc&quot;;
      session = new SessionAsync();
      //In case you setup Transmission with authentication this sets a callback for handling it
      session.authenticate.connect(auth);
      //Newer Transmission versions require a sessionid to be carried with each request. Get one!
      var msg = new Message(&quot;GET&quot;, path);
      session.send_message(msg);
      sessionid = msg.response_headers.get(&quot;X-Transmission-Session-Id&quot;);
      if(sessionid == null)
         error(&quot;Transmission version to old or not configured on that port&quot;);
   }
   public void request_list() {
      size_t length;
      string json;
      var msg = new Message(&quot;POST&quot;, path);
      //Start a Generator and setup some fields for it
      var gen = new Generator();
      var root = new Json.Node(NodeType.OBJECT);
      var object = new Json.Object();
      root.set_object(object);
      gen.set_root(root);
      var args = new Json.Object();
      object.set_object_member(&quot;arguments&quot;, args);
      object.set_string_member(&quot;method&quot;, &quot;torrent-get&quot;);
      var fields = new Json.Array();
      foreach(string s in std_fields)
         fields.add_string_element(s);
      args.set_array_member(&quot;fields&quot;, fields);
      //Send the request json to the server and carry the sessionid along with the request
      json = gen.to_data(out length);
      msg.request_body.append(MemoryUse.COPY, json, length);
      msg.request_headers.append(&quot;X-Transmission-Session-Id&quot;, sessionid);
      session.send_message(msg);
      try {
         //Setup a Parser and load the data from the transmission response
         var parser = new Json.Parser();
         parser.load_from_data(msg.response_body.flatten().data, -1);
         //This basically iterates the whole json tree of elements down to the one with the torrent informations
         var info = parser.get_root().get_object().get_object_member(&quot;arguments&quot;).get_array_member(&quot;torrents&quot;).get_elements();
         foreach(var node in info) {
            var obj = node.get_object();
            stdout.printf(&quot;%d: %s - %.2f%% [%.2f/%.2f] %d byte\n&quot;,
               (int)obj.get_int_member(&quot;id&quot;),
               obj.get_string_member(&quot;name&quot;),
               (float)obj.get_double_member(&quot;percentDone&quot;)*100,
               (float)obj.get_double_member(&quot;rateDownload&quot;),
               (float)obj.get_double_member(&quot;rateUpload&quot;),
               (int)obj.get_int_member(&quot;sizeWhenDone&quot;));
         }
      }
      catch(Error e) {
         error(&quot;%s&quot;, e.message);
      }
   }
   private void auth(Message msg, Auth auth, bool retry) {
      if(user != null &amp;&amp; password != null)
         auth.authenticate(user, password);
      else if(retry)
         error(&quot;Wrong username/password&quot;);
      else
         error(&quot;Transmission server requires authentication&quot;);
   }
   public static void main() {
      var t = new Transmission(&quot;127.0.0.1&quot;, 9091, null, null);
      t.request_list();
   }
}
Compile and Run
$ valac --thread --pkg libsoup-2.4 --pkg json-glib-1.0 transmission-rpc.vala
$ ./transmission-rpc Vala/Examples Projects/Vala/JsonSample  (last edited 2014-03-04 13:27:43 by StefanTalpalaru)
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
