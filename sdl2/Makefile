src := $(shell ls *.gs)

# save_c := --save-temps
FLAGS_GENIE := --pkg sdl2 --pkg SDL2_image --pkg SDL2_gfx \
               --Xcc=-I/usr/include/SDL2 $(save_c)

build: sdl2_basic.exe sdl2_texture.exe

%.exe: %.gs
	valac $(FLAGS_GENIE) -o $@ $<

