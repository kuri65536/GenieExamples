# Copyright (c) 2018, shimoda as kuri65536 _dot_ hot mail _dot_ com
#                       ( email address: convert _dot_ to . and joint string )
#
# This Source Code Form is subject to the terms of the Mozilla Public License,
# v.2.0. If a copy of the MPL was not distributed with this file,
# You can obtain one at https://mozilla.org/MPL/2.0/.
src := \
    AdvancedSample.md \
    AsyncSamples.md \
    BasicSample.md \
    CairoSample.md \
    CharacterSample.md \
    ClutterSamples.md \
    CursesSample.md \
    CustomWidgetSamples.md \
    DBusClientSamples.md \
    DBusServerSample.md \
    DBusServerSamplePassingObjects.md \
    DragAndDropSample.md \
    GIOCompressionSample.md \
    GIONetworkingSample.md \
    GIOSamples.md \
    GSFSample.md \
    GSLSample.md \
    GSettingsSample.md \
    GStreamerSample.md \
    GStreamerSamples.md \
    GTKSample.md \
    GdlSample.md \
    Gedit3PluginSample.md \
    GeeSamples.md \
    GnomeDesktopAndGMenuExample.md \
    GtkCellRendererSample.md \
    InputSamples.md \
    IoChannelsSample.md \
    JsonSample.md \
    LibSoupSample.md \
    ListSample.md \
    LoudmouthSample.md \
    LuaSample.md \
    MxSample.md \
    OpenGLSamples.md \
    Waiting.md \

bin_examples := $(addprefix tmp/,$(subst .md,.exe,$(src)) \
                  NumberGuessing.exe)

build: $(bin_examples)

extract: ../tools/extract.gs
	valac -o $@ ../tools/extract.gs --pkg gio-2.0

tmp/%.exe: %.md extract
	mkdir -p tmp
	./extract 1 $< > $@.gs
	valac -o $@ $@.gs $$(./extract --opt 1 $<)

# special case, 2 examples in 1 file.
NumberGuessing.exe: AdvancedSample.md
	mkdir -p tmp
	./extract 2 $< > $@.gs
	valac -o $@ $@.gs $$(./extract --opt 2 $<)

