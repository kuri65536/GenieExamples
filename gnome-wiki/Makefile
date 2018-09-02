# Copyright (c) 2018, shimoda as kuri65536 _dot_ hot mail _dot_ com
#                       ( email address: convert _dot_ to . and joint string )
#
# This Source Code Form is subject to the terms of the Mozilla Public License,
# v.2.0. If a copy of the MPL was not distributed with this file,
# You can obtain one at https://mozilla.org/MPL/2.0/.

# can't link
# disabled: CairoSample.md:2-3, by gtk+-2.0 dependencies.
# disabled: ClutterSample.md:3, by mash-0.1 dependencies.
# disabled: DBusClientSamplesWaiting.md:1 by string[][]
# disabled: DBusServerSamplePassingObjects.md:1-2-3 old?
# disabled: GdlSample.md:1 by gdl dependencies.
# disabled: GSFSample.md:1 by dependencie
# disabled: GSLSample.md:1-2-3-4-5-6-7-8-9-10 by gsl dependencies.
# disabled: GStreamerSample.md:1-2-3 by gstreamer dependencies
# disabled: GStreamerSample.md:4 by gstreamer and gtk-2.0 dependencies
# disabled: GStreamerSamples.md:1 by dependencies
# disabled: LuaSample.md:1-2 by dependencies for lua-dev.
# disabled: LoudmouthSample.md:1-2 by dependencies gtk-2.0
# disabled: MxSample.md:1-2 by dependencies mx-dev
# disabled: PopplerSample.md:1 by dependencies poppler-dev
# disabled: TiffSample.md:1 dependencies libtiff
# disabled: WebKitSample.md:1 dependencies gtk-2.0
# disabled: PulseAudioSamples.md:1 by dependencies gtk-2.0 and pulse-audio

# can't compile
# GeeSamples.md:4 can't compile by Gee.Traverse.
# Gedit3PluginSample.md:1 by gedit.vapi
# OpenGLSamples.md:1-2-3-4 by gl.vapi libglfw.vapi glx.vapi glu.vapi glut.vapi
# GnomeDesktopAndGMenuExample.md \

src := \
    AdvancedSample.md:1-2 \
    AsyncSamples.md:1-2-3-4-5 \
    BasicSample.md:1-2-3-4-5-6-7-8 \
    CairoSample.md:1-4 \
    CharacterSample.md:1 \
    ClutterSamples.md:1-2 \
    ConditionalCompilationSample.md:1 \
    CursesSample.md:1 \
    CustomWidgetSamples.md:1-2 \
    DBusClientSamples.md:1-2-3 \
    DBusServerSample.md:1-2-3 \
    DragAndDropSample.md:1 \
    GIOCompressionSample.md:1 \
    GIONetworkingSample.md:1 \
    GIOSamples.md:1 \
    GSettingsSample.md:1 \
    GStreamerSamples.md \
    GTKSample.md:1-2-3-4-5-6-7-8 \
    GeeSamples.md:1-2-3 \
    GtkCellRendererSample.md:1 \
    InputSamples.md:1-2-3-4-5 \
    IoChannelsSample.md:1 \
    JsonSample.md:1-2-3 \
    LibSoupSample.md:1-2-3-4-5 \
    ListSample.md:1 \
    PangoCairoSample.md:1-2 \
    PropertiesSample.md:1-2 \
    SDLSample.md \
    SqliteSample.md:2 \
    StringSample.md:1-2-3-4-5 \
    TestSample.md:1-2 \
    ThreadingSamples.md:1-2-3-4 \
    TimeSample.md:1 \
    TypeModuleSample.md:2 \
    USBSample.md:1 \
    ValueSample.md:1 \
    Win32CrossBuildSample.md \
    XmlSample.md:1-2-3-4 \


# ver.1: extract the first `genie` block
ifeq (x,x1)
bin_examples := $(addprefix tmp/,$(subst .md,.exe,$(src)) \
                  NumberGuessing.exe)

tmp/%.exe: tmp/%.gs extract
	mkdir -p tmp
	n=$(word 2,$(subst -, ,$(subst .gs,,$<))); \
	valac -o $@ $@.gs $$(./extract --opt $$n $<)
endif

# ver.2: extract specified blocks to compile.
fn_gs = $(subst .exe,.gs,$(1))
fn_md = $(subst tmp/,,$(word 1,$(subst -, ,$(1))).md)
fn_nm = $(word 2,$(subst -, ,$(subst .exe,,$(1))))

func1 = $(foreach i,$(subst -, ,$(word 2,$(1))), \
          $(subst .md,-$(i).exe,$(word 1,$(1))))
bin_examples := $(foreach i,$(src),$(call func1,$(subst :, ,$(i))))
bin_examples := $(addprefix tmp/,$(bin_examples))
bin_all := $(bin_examples) \
           tmp/valatest.exe tmp/libplugin.so tmp/libplugin2.so \
           tmp/SDLBouncingBall.exe

build: $(bin_all)

extract := ./extract

$(extract): ../tools/extract.gs
	valac -o $@ ../tools/extract.gs --pkg gio-2.0

%.md:

# .gs -> .md
# arguments: abc-1.exe, abc.md, 1
define gs_template
$(1): $(2) $(extract)
	@echo rule: $(1) by $(2) $(3)
	mkdir -p tmp
	./extract $(3) $$< > $$@
endef

# .exe -> .gs
# arguments: abc-1.exe, abc-1.gs, 1, abc.md
define exe_template
$(1): $(2)
	@echo rule: $(1) by $(2) $(3)
	mkdir -p tmp
	valac -o $$@ $$< $$$$(./extract --opt $(3) $(4))
endef

$(foreach i,$(bin_examples),$(eval $(call gs_template, \
    $(call fn_gs,$(i)), \
    $(call fn_md,$(i)), \
    $(call fn_nm,$(i)) \
  )))

$(foreach i,$(bin_examples),$(eval $(call exe_template, \
    $(i), \
    $(call fn_gs,$(i)), \
    $(call fn_nm,$(i)), \
    $(call fn_md,$(i)) \
  )))

tmp/%.exe: tmp/%.gs $(extract)
	mkdir -p tmp
	n=$(word 2,$(subst -, ,$(subst .gs,,$<))); \
	valac -o $@ $@.gs $$(./extract --opt $$n $<)

# SharedLibSample
tmp/test_shared.gs: SharedLibSample.md $(extract)
	$(extract) 1 $(filter %.md,$^) > $@

tmp/test_shared.so: tmp/test_shared.gs
	valac --library=test_shared -H test_shared.h $< \
	    -X -fPIC -X -shared -o $@

tmp/main.gs: SharedLibSample.md $(extract)
	$(extract) 2 $(filter %.md,$^) > $@

tmp/valatest.exe: tmp/main.gs tmp/test_shared.so
	valac test_shared.vapi tmp/main.gs -X tmp/test_shared.so -X -I. -o $@

# TypeModuleSample
tmp/libplugin.so: TypeModuleSample.md tmp/TypeModuleSample-2.exe $(extract)
	$(extract) 1 $(filter %.md,$^) > plugin.gs
	valac --ccode plugin.gs
	gcc -fPIC -shared -o tmp/libplugin.so plugin.c \
	    $$(pkg-config --libs --cflags gobject-2.0 gmodule-2.0)
	LD_LIBRARY_PATH=$$PWD/tmp ./tmp/TypeModuleSample-2.exe

# TypeModules
tmp/plugin-interface.gs: TypeModules.md $(extract)
	$(extract) 1 $(filter %.md,$^) > $@

tmp/main2.exe: TypeModules.md tmp/plugin-interface.gs $(extract)
	$(extract) 2 $(filter %.md,$^) > tmp/main2.gs
	valac --pkg=gmodule-2.0 tmp/main2.gs \
	    tmp/plugin-interface.gs -o tmp/main2.exe

tmp/libplugin2.so: TypeModules.md tmp/main2.exe tmp/plugin-interface.gs $(extract)
	$(extract) 3 $(filter %.md,$^) > tmp/plugin2.gs
	valac --pkg=gmodule-2.0 -C tmp/plugin2.gs tmp/plugin-interface.gs
	gcc -shared -fPIC  -o tmp/libplugin2.so tmp/plugin2.c \
	    $$(pkg-config --cflags --libs glib-2.0 gmodule-2.0)
	LD_LIBRARY_PATH=$$PWD/tmp ./tmp/main2.exe


# SDLBouncing
tmp/SDLBouncingBall.exe: SDLBouncingBall.md $(extract)
	$(extract) 1 $(filter %.md,$^) > tmp/sdl_world.gs
	$(extract) 2 $(filter %.md,$^) > tmp/sdl_window.gs
	$(extract) 3 $(filter %.md,$^) > tmp/sdl_ball.gs
	$(extract) 4 $(filter %.md,$^) > tmp/sdl_bounce.gs
	$ valac -g --pkg=sdl --pkg=sdl-gfx -X -lSDL_gfx -X -I/usr/include/SDL \
	    tmp/sdl_world.gs tmp/sdl_window.gs tmp/sdl_ball.gs tmp/sdl_bounce.gs \
	    -X -lm -o tmp/SDLBouncingBall.exe

