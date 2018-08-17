







Projects/Vala/CharacterSample - GNOME Wiki!



<!--
var search_hint = "Search";
//-->




























Projects/Vala/CharacterSampleHomeRecentChangesScheduleLogin








Vala Character Sample
This sample demonstrates how to extract each character from a Unicode string and convert it to a Unicode character to get its type. Requires Vala 0.12.0 vala-test:examples/character.vala void main () {

    string s = &quot;1234567890 ١٢٣٤٥٦٧٨٩۰ ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz أبتةثجحخدذرزسشصضطظعغفقكلمنهوي&quot;;

    unichar c;
    for (int i = 0; s.get_next_char(ref i, out c);) {

        UnicodeType type = c.type ();

        stdout.printf (&quot;'%s' is &quot;, c.to_string ());

        switch (type) {
        case UnicodeType.UPPERCASE_LETTER:
            stdout.printf (&quot;UPPERCASE_LETTER\n&quot;);
            break;
        case UnicodeType.LOWERCASE_LETTER:
            stdout.printf (&quot;LOWERCASE_LETTER\n&quot;);
            break;
        case UnicodeType.OTHER_LETTER:
            stdout.printf (&quot;OTHER_LETTER\n&quot;);
            break;
        case UnicodeType.DECIMAL_NUMBER:
            stdout.printf (&quot;OTHER_NUMBER\n&quot;);
            break;
        case UnicodeType.SPACE_SEPARATOR:
            stdout.printf (&quot;SPACE_SEPARATOR\n&quot;);
            break;
        }
    }
}

Compile and Run
$ valac character.vala
$ ./character
 Vala/Examples Projects/Vala/CharacterSample  (last edited 2013-11-22 16:48:26 by WilliamJonMcCann)











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



