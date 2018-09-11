# Genie Examples
Genie examples source code and build script.

- from the vala examples:
    https://wiki.gnome.org/Projects/Vala/Examples
- and from my gist

## Examples from [gnome wiki for Vala](https://wiki.gnome.org/Projects/Vala/Examples)

I converted the Vala examples to the Genie launguage.
below links to all the Genie examples available in this repository.

### List of pages in this category:

<summary>

- [AdvancedSample](gnome-wiki/AdvancedSample.md)
- [AsyncSamples](gnome-wiki/AsyncSamples.md)
- [BasicSample](gnome-wiki/BasicSample.md)
- [CairoSample](gnome-wiki/CairoSample.md)

<details>
<summary>click to see more...</summary><p>

- [CharacterSample](gnome-wiki/CharacterSample.md)
- [ClutterSamples](gnome-wiki/ClutterSamples.md)
- [ConditionalCompilationSample](gnome-wiki/ConditionalCompilationSample.md)
- [CursesSample](gnome-wiki/CursesSample.md)
- [CustomWidgetSamples](gnome-wiki/CustomWidgetSamples.md)
- [DBusClientSamples](gnome-wiki/DBusClientSamples.md)
- [DBusClientSamples/Waiting](gnome-wiki/DBusClientSamples/Waiting.md)
- [DBusServerSample](gnome-wiki/DBusServerSample.md)
- [DBusServerSamplePassingObjects](gnome-wiki/DBusServerSamplePassingObjects.md)
- [DragAndDropSample](gnome-wiki/DragAndDropSample.md)
- [GIOCompressionSample](gnome-wiki/GIOCompressionSample.md)
- [GIONetworkingSample](gnome-wiki/GIONetworkingSample.md)
- [GIOSamples](gnome-wiki/GIOSamples.md)
- [GSFSample](gnome-wiki/GSFSample.md)
- [GSLSample](gnome-wiki/GSLSample.md)
- [GSettingsSample](gnome-wiki/GSettingsSample.md)
- [GStreamerSample](gnome-wiki/GStreamerSample.md)
- [GStreamerSamples](gnome-wiki/GStreamerSamples.md)
- [GTKSample](gnome-wiki/GTKSample.md)
- [GdlSample](gnome-wiki/GdlSample.md)
- [Gedit3PluginSample](gnome-wiki/Gedit3PluginSample.md)
- [GeeSamples](gnome-wiki/GeeSamples.md)
- [GnomeDesktopAndGMenuExample](gnome-wiki/GnomeDesktopAndGMenuExample.md)
- [GtkCellRendererSample](gnome-wiki/GtkCellRendererSample.md)
- [InputSamples](gnome-wiki/InputSamples.md)
- [IoChannelsSample](gnome-wiki/IoChannelsSample.md)
- [JsonSample](gnome-wiki/JsonSample.md)
- [LibSoupSample](gnome-wiki/LibSoupSample.md)
- [ListSample](gnome-wiki/ListSample.md)
- [LoudmouthSample](gnome-wiki/LoudmouthSample.md)
- [LuaSample](gnome-wiki/LuaSample.md)
- [MxSample](gnome-wiki/MxSample.md)
- [OpenGLSamples](gnome-wiki/OpenGLSamples.md)
- [PangoCairoSample](gnome-wiki/PangoCairoSample.md)
- [PopplerSample](gnome-wiki/PopplerSample.md)
- [PropertiesSample](gnome-wiki/PropertiesSample.md)
- [PulseAudioSamples](gnome-wiki/PulseAudioSamples.md)
- [SDLBouncingBall](gnome-wiki/SDLBouncingBall.md)
- [SDLSample](gnome-wiki/SDLSample.md)
- [SharedLibSample](gnome-wiki/SharedLibSample.md)
- [SqliteSample](gnome-wiki/SqliteSample.md)
- [StringSample](gnome-wiki/StringSample.md)
- [TestSample](gnome-wiki/TestSample.md)
- [ThreadingSamples](gnome-wiki/ThreadingSamples.md)
- [TiffSample](gnome-wiki/TiffSample.md)
- [TimeSample](gnome-wiki/TimeSample.md)
- [TypeModuleSample](gnome-wiki/TypeModuleSample.md)
- [TypeModules](gnome-wiki/TypeModules.md)
- [USBSample](gnome-wiki/USBSample.md)
- [ValueSample](gnome-wiki/ValueSample.md)
- [WebKitSample](gnome-wiki/WebKitSample.md)
- [Win32CrossBuildSample](gnome-wiki/Win32CrossBuildSample.md)
- [XmlSample](gnome-wiki/XmlSample.md)

</p></details>

### Build
you can build them in gnome-wiki directory:

```
$ git clone this-repository
$ cd GenieExamples/gnome-wiki
$ make
```


## My samples in Gist

- [Split program into two(or multi) source files](examples/twofiles.md)
- [Delegate](examples/delegate.md)
- [Simple reading a text file](examples/file_read.md)
    [original gist is here](https://gist.github.com/kuri65536/7b1930570a94e9a7ffc7a6ff9657edfb)
- [Subprocess and get stdout as string](examples/subprocess_pipe.md)
- [Genie GUI Basic](https://gist.github.com/kuri65536/d787a6cbbe0ed485ec4e714085a266bf)
    this is equivalent to https://wiki.gnome.org/Projects/Genie/GtkGuiTutorial

- [gtk+-3.0 DrawingArea.html](https://gist.github.com/kuri65536/844b89c1825f2c581d4333d5c8b2a3dd)
- [SDL2 Move character](https://gist.github.com/kuri65536/844b89c1825f2c581d4333d5c8b2a3dd)
- [SDL2 Draw circle](https://gist.github.com/kuri65536/55b19ae1b230f4d41539243d2c60da25)
    this is equivalent to SDLSample:1 but written by SDL2.


## My Build infomation

| term     | description  | note  |
|:--------:|:-------------|:------|
| OS       | Ubuntu 18.04 | amd64 |
| compiler | Vala 0.40.4  |       |


## License

- clones from gnome-wiki vala are according to original codes.
- my works belong to MPL-2.0

