src := $(shell ls *.gs)

FLAGS_GENIE := --pkg sdl --pkg sdl-gfx -X -lSDL_gfx --Xcc=-I/usr/include/SDL

sdlsample: basic.gs
	valac $(FLAGS_GENIE) -o basic $<

# sdlsample: $(src)

