# Projects/Vala/USBSample - GNOME Wiki!

## Vala USB Sample

## Listing USB devices

This sample shows usage of LibUSB to display currently connected USB devices.
Requires Vala 0.14.0 & libusb 1.0 ("libusb-1.0" on Debian/Ubuntu).

```genie
// vala-test:examples/usb-sample.vala
[indent=4]
uses LibUSB

init
    // declare objects
    context: Context
    devices: array of Device

    // initialize LibUSB and get the device list
    Context.init (out context);
    context.get_device_list (out devices);
    stdout.printf ("\n USB Device List\n---------------\n");
        // iterate through the list
    var i = 0;
    while devices[i] != null
        var dev = devices[i];
            // we print all values in hexadecimal here
        stdout.printf ("\n Bus number : %04x", dev.get_bus_number ());
        stdout.printf ("\n Address : %04x", dev.get_device_address ());
        var desc = DeviceDescriptor(dev)
        stdout.printf ("\n Vendor ID : %04x",  desc.idVendor);
        stdout.printf ("\n Product ID : %04x", desc.idProduct);
        stdout.printf ("\n");
        i++;
```

### Compile and Run

```shell
$ valac --pkg=libusb-1.0 usb-sample.gs
$ ./usb-sample
```

Vala/Examples Projects/Vala/USBSample
    (last edited 2013-11-22 16:48:31 by WilliamJonMcCann)
