src := $(shell ls *.gs)

# save_c := --save-temps
FLAGS_GENIE := --pkg sdl2 --pkg SDL2_image --pkg SDL2_gfx \
               --Xcc=-I/usr/include/SDL2 $(save_c)

sdlsample: basic.gs
	valac $(FLAGS_GENIE) -o basic $<

