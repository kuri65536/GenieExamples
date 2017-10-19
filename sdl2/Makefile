src := $(shell ls *.gs)

# FLAGS_GENIE := --pkg sdl --pkg sdl-gfx -X -lSDL_gfx --Xcc=-I/usr/include/SDL
FLAGS_GENIE := --pkg sdl2 --pkg SDL2_image --pkg SDL2_gfx \
               --Xcc=-I/usr/include/SDL2 --save-temps

sdlsample: basic.gs
	valac $(FLAGS_GENIE) -o basic $<

# sdlsample: $(src)

