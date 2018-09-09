src := \
    subprocess_pipe.md:1 \
    delegate.md:1

extract := ./extract

# ver.2: extract specified blocks to compile.
fn_gs = $(subst .exe,.gs,$(1))
fn_md = $(subst tmp/,,$(word 1,$(subst -, ,$(1))).md)
fn_nm = $(word 2,$(subst -, ,$(subst .exe,,$(1))))

func1 = $(foreach i,$(subst -, ,$(word 2,$(1))), \
          $(subst .md,-$(i).exe,$(word 1,$(1))))
bin_examples := $(foreach i,$(src),$(call func1,$(subst :, ,$(i))))
bin_examples := $(addprefix tmp/,$(bin_examples))


build: $(bin_examples) tmp/twofiles.exe
	@echo $(src)
	@echo $(bin_examples)

$(extract): ../tools/extract.gs
	valac -o $@ ../tools/extract.gs --pkg gio-2.0

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

tmp/twofiles.exe: twofiles.md $(extract)
	$(extract) 1 $(filter %.md,$^) > tmp/b.gs
	$(extract) 2 $(filter %.md,$^) > tmp/a.gs
	valac -o $@ tmp/b.gs tmp/a.gs $$($(extract) --opt 1)

