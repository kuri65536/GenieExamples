Projects/Vala/USBSample - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
	   
	    
Projects/Vala/USBSampleHomeRecentChangesScheduleLogin
Vala USB Sample
Listing USB devices
This sample shows usage of LibUSB to display currently connected USB devices.  Requires Vala 0.14.0 & libusb 1.0 ("libusb-1.0" on Debian/Ubuntu). vala-test:examples/usb-sample.vala using LibUSB;
int main () {
        // declare objects
        Context context;
        Device[] devices;
        // initialize LibUSB and get the device list
    Context.init (out context);
    context.get_device_list (out devices);
    stdout.printf ("\n USB Device List\n---------------\n");
        // iterate through the list
    int i = 0;
    while (devices[i] != null)
    {
        var dev = devices[i];
            // we print all values in hexadecimal here
        stdout.printf ("\n Bus number : %04x", dev.get_bus_number ());
        stdout.printf ("\n Address : %04x", dev.get_device_address ());
        DeviceDescriptor desc = DeviceDescriptor (dev);
        stdout.printf ("\n Vendor ID : %04x",  desc.idVendor);
        stdout.printf ("\n Product ID : %04x", desc.idProduct);
        stdout.printf ("\n");
        i++;
    }
    return 0;
}
Compile and Run
$ valac --pkg libusb-1.0 usb-sample.vala
$ ./usb-sample Vala/Examples Projects/Vala/USBSample  (last edited 2013-11-22 16:48:31 by WilliamJonMcCann)
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
