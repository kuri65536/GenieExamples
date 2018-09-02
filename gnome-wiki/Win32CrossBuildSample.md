Projects/Vala/Win32CrossBuildSample - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
	   
	    
Projects/Vala/Win32CrossBuildSampleHomeRecentChangesScheduleLogin
This sample shows you how to cross build WIN32 binary in Linux. First, I assume you are using Ubuntu, so, all the packages we need are installed via apt-get. Second, use CMake as build system, nsis as package system. So your project might build in both Linux and Windows with only small among of modifications. Install prerequisites $ sudo apt-get install mingw32 mingw32-binutils mwingw32-runtime
$ sudo apt-get install cmake nsis
$ sudo apt-get install libgtk2-devDownload pre-built Gtk all-in-one bundle from here http://www.gtk.org/download/win32.php $ wget http://ftp.gnome.org/pub/gnome/binaries/win32/gtk+/2.24/gtk+-bundle_2.24.10-20120208_win32.zip -O ~/Download/gtk+-bundle_2.24.10-20120208_win32.zipCreate directory for your project $ mkdir ~/vala-win32-sample
$ cd ~/vala-win32-sampleUncompress all-in-one bundle $ mkdir win32
$ cd win32
$ unzip ~/Download/gtk+-bundle_2.24.10-20120208_win32.zipFix prefix in .pc files so pkg-config can report correct package information $ find -name '*pc' | while read pc; do sed -e "s@^prefix=.*@prefix=$PWD@" -i "$pc"; doneTo ease our fingers, save following commands in shell script named ~/vala-win32-sample/autogen.sh src_dir=$(dirname $(readlink -f $0))
bld_dir=$PWD
if [[ "$src" != "$bld_dir" ]]; then
        rm -rf "${bld_dir}"/*
fi
ROOT="$src_dir"/win32/
PKG_CONFIG_PATH="${ROOT}lib/pkgconfig:${ROOT}share/pkgconfig" \
cmake -DCMAKE_INSTALL_PREFIX=/usr \
        -DCMAKE_SYSTEM_PREFIX_PATH=$PWD/win32 \
        -DCMAKE_TOOLCHAIN_FILE=Toolchain.cmake \
        $src_dirThis minimal ~/vala-win32-sample/Toolchain.cmake tells CMake what build target looks like, which toolchain to use. set( CHOST i586-mingw32msvc )
set( CMAKE_SYSTEM_NAME Windows )
set( CMAKE_RC_COMPILER ${CHOST}-windres )
set( CMAKE_C_COMPILER ${CHOST}-gcc )
set( CMAKE_CXX_COMPILER ${CHOST}-g++ )~/vala-win32-sample/CMakeLists.txt is the core project build/install/package script. cmake_minimum_required( VERSION 2.8 )
project( vala-xbuild-sample )
set( CPACK_PACKAGE_NAME ${CMAKE_PROJECT_NAME} )
if( CMAKE_SYSTEM_NAME STREQUAL "Windows" )
        set( CPACK_GENERATOR "NSIS" )
        add_definitions( -mms-bitfields )
else()
        set( CPACK_GENERATOR "DEB" )
        set( CPACK_PACKAGE_CONTACT "daiderek@gmail.com" )
        set( CPACK_DEBIAN_PACKAGE_MAINTAINER "daiderek@gmail.com" )
endif()
find_package( PkgConfig )
pkg_check_modules( GTK REQUIRED gtk+-2.0 )
include_directories( ${GTK_INCLUDE_DIRS} )
link_directories( ${GTK_LIBRARY_DIRS} )
add_executable( hello-world hello-world.c )
target_link_libraries( hello-world ${GTK_LIBRARIES} )
install( TARGETS hello-world RUNTIME DESTINATION bin )
include( CPack )~/vala-win32-sample/hello-world.c #include <gtk/gtk.h>
int main(int argc, char * args[])
{
        GtkWidget * win;
        gtk_init(& argc, & args);
        win = gtk_window_new(GTK_WINDOW_TOPLEVEL);
        gtk_widget_show(win);
        gtk_main();
        return 0;
}Now you should have following files in ~/vala-win32-sample $ ls
autogen.sh  CMakeLists.txt  hello-world.c  toolchain.cmake  win32Try native build to ensure your build environment is OK $ cd ~/vala-win32-sample
$ mkdir build && cd build
$ cmake .. && make && hello-worldIf hello-world build and run successfully, try cross build now $ ../autogen.sh && make
$ pushd ../win32/bin && wine ../../build/hello-world.exe; popdWhere is Vala?  Vala/Examples Projects/Vala/Win32CrossBuildSample  (last edited 2013-11-22 16:48:30 by WilliamJonMcCann)
Search:
<input id="searchinput" type="text" name="value" value="" size="20"
    onfocus="searchFocus(this)" onblur="searchBlur(this)"
    onkeyup="searchChange(this)" onchange="searchChange(this)" alt="Search">
<input id="titlesearch" name="titlesearch" type="submit"
    value="Titles" alt="Search Titles">
<input id="fullsearch" name="fullsearch" type="submit"
    value="Text" alt="Search Full Text">
<!--// Initialize search form
var f = document.getElementById('searchform');
f.getElementsByTagName('label')[0].style.display = 'none';
var e = document.getElementById('searchinput');
searchChange(e);
searchBlur(e);
//-->
        Copyright &copy; 2005 -  The GNOME Project.
        Hosted by Red Hat.
  document.getElementById('current-year').innerHTML = new Date().getFullYear();
