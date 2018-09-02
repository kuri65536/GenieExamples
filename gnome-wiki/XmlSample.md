# Projects/Vala/XmlSample - GNOME Wiki!

## XML Vala Sample
The libxml2 binding is somewhat odd to use from Vala since you must do manual
memory management via pointers. An alternative is to use the GObject-based
abstraction layer/wrapper GXml, written in Vala.  Anyway, here's the sample:

```genie
// vala-test:examples/libxml2.vala
/*
 * Various operations with libxml2: Parsing and creating an XML file
 */
[indent=4]
uses Xml

class XmlSample
    // Line indentation
    indent: int = 0;

    def print_indent(node: string, content: string, token: char='+')
        var indent = string.nfill(this.indent * 2, ' ')
        stdout.printf ("%s%c%s: %s\n", indent, token, node, content);

    def parse_file(path: string)
        // Parse the document from path
        var doc = Parser.parse_file (path);
        if doc == null
            stderr.printf ("File %s not found or permissions missing", path);
            return;
        // Get the root node. notice the dereferencing operator -> instead of .
        var root = doc->get_root_element()
        if root == null
            // Free the document manually before returning
            delete doc;
            stderr.printf ("The xml file '%s' is empty", path);
            return;
        print_indent ("XML document", path, '-');
        // Print the root node's name
        print_indent ("Root node", root->name);
        // Let's parse those nodes
        parse_node (root);
        // Free the document
        delete doc;

    def parse_node(node: Xml.Node*)
        this.indent++;
        // Loop over the passed node's children
        var _iter = node->children
        while _iter != null
            // Spaces between tags are also nodes, discard them
            var iter = _iter
            _iter = _iter->next
            if iter->type != ElementType.ELEMENT_NODE
                continue;
            // Get the node's name
            var node_name = iter->name;
            // Get the node's content with <tags> stripped
            var node_content = iter->get_content ();
            print_indent (node_name, node_content);
            // Now parse the node's properties (attributes) ...
            parse_properties (iter);
            // Followed by its children nodes
            parse_node (iter);
        this.indent--;

    def parse_properties(node: Xml.Node*)
        // Loop over the passed node's properties (attributes)
        var prop = node->properties
        while prop != null
            var attr_name = prop->name;
            // Notice the ->children which points to a Node*
            // (Attr doesn't feature content)
            var attr_content = prop->children->content;
            print_indent (attr_name, attr_content, '|');
            prop = prop->next

    def static create_simple_xml(): string
        var doc = new Xml.Doc("1.0")
        var ns = new Xml.Ns(null, "", "foo")
        ns.type = Xml.ElementType.ELEMENT_NODE
        var root = new Xml.Node(ns, "simple")
        doc.set_root_element(root)
        root.new_prop("property", "value")
        var subnode = root.new_text_child(ns, "subnode", "")
        subnode->new_text_child(ns, "textchild", "another text")
        subnode->new_prop("subprop", "escaping \" and  < and >")
        var comment = new Xml.Node.comment("This is a comment")
        root.add_child(comment)
        xmlstr: string
        // This throws a compiler warning, see bug 547364
        doc.dump_memory(out xmlstr)
        return xmlstr;

init  // (string[] args) {
    if args.length < 2
        stderr.printf ("Argument required!\n");
        return
    // Initialisation, not instantiation since the parser is a static class
    Parser.init ();
    var simple_xml = XmlSample.create_simple_xml()
    stdout.printf ("Simple XML is:\n%s\n", simple_xml);
    var sample = new XmlSample ();
    // Parse the file listed in the first passed argument
    sample.parse_file (args[1]);
    // Do the parser cleanup to free the used memory
    Parser.cleanup ();
```

### Compile

```shell
$ valac --pkg=libxml-2.0 xmlsample.vala
$ ./xmlsample
```


## XML Text Writer example
This example shows how to use xmlTextWriter from libxml2 in Vala. NOTE: Vala 0.8
required for this example.

```genie
// vala-test:examples/libxml2-writer.vala
[indent=4]
init
    var writer = new Xml.TextWriter.filename ("test.xml");
    writer.set_indent (true);
    writer.set_indent_string ("\t");
    writer.start_document ();
    writer.start_element ("root_element");
    writer.start_attribute ("base64attribute");
    writer.write_base64 ("test", 0, 4);
    writer.end_attribute ();
    writer.write_attribute ("alpha", "abcdef..");
    writer.write_element ("element", "content");
    writer.write_element_ns ("ns", "elementWithNS", "http://www.example.org/test/ns", "contentNS");
    writer.write_comment ("My comment!");
    writer.format_element_ns ("ns", "elementWithFormattedContent", "http://www.example.org/test/ns", "One: %d", 10);
    writer.start_element("cdataContent");
    writer.start_cdata();
    writer.format_string("%s beer on the wall..", "One");
    writer.end_cdata();
    writer.end_element();
    writer.end_element();
    writer.end_document();
    writer.flush();
```

```shell
$ valac --pkg=libxml-2.0 xmlsample.vala
$ ./xmlsample
```

## XPath Sample
This example based on
http://charette.no-ip.com:81/programming/2010-01-03_LibXml2/2010-01-03_LibXml2.cpp
. Read the original for comments.

```genie
[indent=4]
uses Xml.XPath
uses Xml

// class xpathsample
init  // c static int main(string[] args) {
    Parser.init ();
    var path = "example.xml";
    var doc = Parser.parse_file (path);
    assert(doc != null)  // "failed to read the .xml file");
    var ctx = new Context(doc);
    assert(ctx != null)  // "failed to create the xpath context");
    var obj = ctx.eval_expression("/Example/Objects/Pet");
    assert(obj != null)  // "failed to evaluate xpath");
    node: Xml.Node* = null;
    if obj->nodesetval != null and obj->nodesetval->item(0) != null
        node = obj->nodesetval->item(0);
        print("Found the node we want");
    else
        print("failed to find the expected node");
    var attr = node->properties
    while attr != null
        print("Attribute: \tname: %s\tvalue: %s\n", attr->name, attr->children->content);
        attr = attr->next;
    //...
    delete obj;
    delete doc;
```

### Compile
```shell
$ valac --pkg=libxml-2.0 xpathsample.vala
$ ./xpathsample
```


## XML Text Reader Sample
This example shows how to use xmlTextReader from libxml2 in Vala and is based on
http://www.xmlsoft.org/examples/reader1.c .  Note: It's a simple translation of
the c-code and it works for me just the same but could still have memory errors,
because I do not know how I give the memory free, maybe the libxml-wrapper makes
it automatically, but I'm not sure.

```genie
/**
 * section: xmlReader
 * synopsis: Parse an XML file with an xmlReader
 * purpose: Demonstrate the use of xmlReaderForFile() to parse an XML file
 *          and dump the informations about the nodes found in the process.
 * original: This example is based on http://www.xmlsoft.org/examples/reader1.c
 * copy: Please see the original file for Copyright and Author.
 */
[indent=4]
uses Xml

/**
 * processNode:
 * @reader: the xmlReader
 *
 * Dump information about the current node
 */
def processNode(reader: Xml.TextReader)
    var name = reader.const_name();
    if name == null
        name = "--";
    var val = reader.const_value();
    print("%d %d %s %d %d", 
        reader.depth(),
        reader.node_type(),
        name,
        reader.is_empty_element(),
        reader.has_value());
    if (val == null)
        print("\n");
    else
        if (val.length > 40)
            print(" %.40s...\n", val);
        else
            print(" %s\n", val);

/**
 * streamFile:
 * @uri: the file name to parse
 *
 * Parse and print information about an XML file.
 */
def streamFile(uri: string)
    var reader = new Xml.TextReader.filename(uri);
    if reader != null
        var ret = reader.read();
        while ret == 1
            processNode(reader);
            ret = reader.read();
        reader = null; // TODO fixme c-function is xmlFreeTextReader(reader);
        if ret != 0
            printerr("%s : failed to parse\n", uri);
    else
        printerr("Unable to open %s\n", uri);

init  // string[] args) {
    if args.length != 2
        return
    streamFile(args[1]);
    /*
     * Cleanup function for the XML library.
     */
    Xml.Parser.cleanup();
    /*
     * this is to debug memory for regression tests
     */
    // TODO fixme c-function is xmlMemoryDump();
```

### Compile

```shell
$ valac --pkg=libxml-2.0 reader1.vala
$ ./reader1 <filename>
```

Vala/Examples Projects/Vala/XmlSample
    (last edited 2013-11-22 16:48:31 by WilliamJonMcCann)
