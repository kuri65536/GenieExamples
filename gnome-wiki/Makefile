# Copyright (c) 2018, shimoda as kuri65536 _dot_ hot mail _dot_ com
#                       ( email address: convert _dot_ to . and joint string )
#
# This Source Code Form is subject to the terms of the Mozilla Public License,
# v.2.0. If a copy of the MPL was not distributed with this file,
# You can obtain one at https://mozilla.org/MPL/2.0/.

# disabled: CairoSample.md:2-3, by gtk+-2.0 dependencies.
# disabled: ClutterSample.md:3, by mash-0.1 dependencies.
# disabled: DBusClientSamplesWaiting.md:1 by string[][]
# disabled: DBusServerSamplePassingObjects.md:1-2-3 old?
# disabled: GeeSamples.md:4 can't compile by Gee.Traverse.

src := \
    AdvancedSample.md:1-2 \
    AsyncSamples.md:1-2-3-4-5 \
    BasicSample.md:1-2-3-4-5-6-7-8 \
    CairoSample.md:1-4 \
    CharacterSample.md:1 \
    ClutterSamples.md:1-2 \
    CursesSample.md:1 \
    CustomWidgetSamples.md:1-2 \
    DBusClientSamples.md:1-2-3 \
    DBusServerSample.md:1-2-3 \
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
    GeeSamples.md:1-2-3 \
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

build: $(bin_examples)

extract: ../tools/extract.gs
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

tmp/%.exe: tmp/%.gs extract
	mkdir -p tmp
	n=$(word 2,$(subst -, ,$(subst .gs,,$<))); \
	valac -o $@ $@.gs $$(./extract --opt $$n $<)

