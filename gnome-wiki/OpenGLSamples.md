# Projects/Vala/OpenGLSamples - GNOME Wiki!

Contents

- Vala OpenGL Samples
- Using GLFW
- Using GtkGLExt: Coloured Triangle
- Using GtkGLExt: Spotlight
- Using GLX: Coloured Triangle
- Using GLUT/FreeGLUT: Teapot


## Vala OpenGL Samples

You can find the OpenGL bindings for Vala on ../ExternalBindings


## Using GLFW
GLFW is a free, Open Source,
multi-platform library for creating OpenGL contexts.

```genie
// vala-test:examples/opengl-glfw.vala
[indent=4]
uses GLFW
uses GL

init
    var running = true
    // Initialize GLFW
    glfwInit ();
    // Open an OpenGL window (you can also try Mode.FULLSCREEN)
    if !glfwOpenWindow(640, 480, 0, 0, 0, 0, 0, 0, Mode.WINDOW)
        glfwTerminate ();
        return  // 1;

    // Main loop
    while running
        // OpenGL rendering goes here...
        glClear (GL_COLOR_BUFFER_BIT);
        glBegin (GL_TRIANGLES);
            glVertex3f ( 0.0f, 1.0f, 0.0f);
            glVertex3f (-1.0f,-1.0f, 0.0f);
            glVertex3f ( 1.0f,-1.0f, 0.0f);
        glEnd ();
        // Swap front and back rendering buffers
        glfwSwapBuffers ();
        // Check if ESC key was pressed or window was closed
        running = !glfwGetKey(Key.ESC) and (bool)glfwGetWindowParam(WindowParam.OPENED)

    // Close window and terminate GLFW
    glfwTerminate ();
    // Exit program
    // return 0;
```

### Compile with

```shell
$ valac --pkg=gl --pkg=libglfw glfw-sample.vala
```


## Using GtkGLExt: Coloured Triangle

GtkGLExt adds OpenGL capabilities to GTK+ widgets.

```genie
// vala-test:examples/opengl-gtkglext.vala
[indent=4]
uses Gtk
uses Gdk
uses GL

class GtkGLExtSample: Gtk.Window
    construct()
        this.title = "OpenGL with GtkGLExt";
        this.destroy.connect (Gtk.main_quit);
        set_reallocate_redraws (true);
        var drawing_area = new DrawingArea ();
        drawing_area.set_size_request (200, 200);
        var glconfig = new GLConfig.by_mode (GLConfigMode.RGB
                                           | GLConfigMode.DOUBLE);
        WidgetGL.set_gl_capability (drawing_area, glconfig, null, true,
                                    GLRenderType.RGBA_TYPE);
        drawing_area.configure_event.connect (on_configure_event);
        drawing_area.expose_event.connect (on_expose_event);
        add (drawing_area);

    /* Widget is resized */
    def on_configure_event (widget: Widget, event: EventConfigure): bool
        var glcontext = WidgetGL.get_gl_context(widget);
        var gldrawable = WidgetGL.get_gl_drawable(widget);
        if !gldrawable.gl_begin(glcontext)
            return false;
        glViewport (0, 0, (GLsizei) widget.allocation.width,
                          (GLsizei) widget.allocation.height);
        gldrawable.gl_end ();
        return true;

    /* Widget is asked to paint itself */
    def on_expose_event(widget: Widget, event: EventExpose): bool
        var glcontext = WidgetGL.get_gl_context(widget)
        var gldrawable = WidgetGL.get_gl_drawable(widget)
        if !gldrawable.gl_begin(glcontext)
            return false;
        glClear (GL_COLOR_BUFFER_BIT);
        glBegin (GL_TRIANGLES);
        glIndexi (0);
        glColor3f (1.0f, 0.0f, 0.0f);
        glVertex2i (0, 1);
        glIndexi (0);
        glColor3f (0.0f, 1.0f, 0.0f);
        glVertex2i (-1, -1);
        glIndexi (0);
        glColor3f (0.0f, 0.0f, 1.0f);
        glVertex2i (1, -1);
        glEnd ();
        if gldrawable.is_double_buffered()
            gldrawable.swap_buffers ();
        else
            glFlush ();
        gldrawable.gl_end ();
        return true;

init  //  (string[] args) {
    Gtk.init (ref args);
    Gtk.gl_init (ref args);
    var sample = new GtkGLExtSample ();
    sample.show_all ();
    Gtk.main ();
```

### Compile with

```shell
$ valac --pkg gtk+-2.0 --pkg gl --pkg gtkglext-1.0 gtkglext-sample.vala
```


## Using GtkGLExt: Spotlight
Move the light with the arrow keys!

```genie
// vala-test:examples/opengl-gtkglext-spot.vala using Gtk;
[indent=4]
uses Gdk
uses GL
uses GLU

class SpotSample: Gtk.Window
    xRot: static GLfloat = 0.0f
    yRot: static GLfloat = 0.0f
    iShade: static int = 2
    iTess: static int = 3
    const lightPos: array of GLfloat     = {0.0f, 0.0f, 75.0f, 1.0f}
    const specular: array of GLfloat     = {1.0f, 1.0f, 1.0f, 1.0f}
    const specref: array of GLfloat      = {1.0f, 1.0f, 1.0f, 1.0f}
    const ambientLight: array of GLfloat = {0.5f, 0.5f, 0.5f, 1.0f}
    const spotDir: array of GLfloat      = {0.0f, 0.0f, -1.0f}

    construct()
        this.title = "OpenGL with GtkGLExt";
        this.destroy.connect (Gtk.main_quit);
        set_reallocate_redraws (true);
        var drawing_area = new DrawingArea ();
        drawing_area.set_size_request (800, 600);
        var glconfig = new GLConfig.by_mode (GLConfigMode.RGB
                                           | GLConfigMode.DOUBLE
                                           | GLConfigMode.DEPTH);
        WidgetGL.set_gl_capability (drawing_area, glconfig, null, true,
                                    GLRenderType.RGBA_TYPE);
        drawing_area.realize.connect (on_realize);
        drawing_area.configure_event.connect (on_configure_event);
        drawing_area.expose_event.connect (on_expose_event);
        drawing_area.add_events (Gdk.EventMask.KEY_PRESS_MASK);
        drawing_area.can_focus = true;
        drawing_area.key_press_event.connect (on_key_press_event);
        add (drawing_area);

    /* Widget gets initialized */
    def on_realize(widget: Widget)
        var glcontext = WidgetGL.get_gl_context(widget)
        var gldrawable = WidgetGL.get_gl_drawable(widget)
        if !gldrawable.gl_begin(glcontext)
            return;
        glEnable (GL_DEPTH_TEST);
        glEnable (GL_CULL_FACE);
        glFrontFace (GL_CCW);
        glEnable (GL_LIGHTING);
        glLightModelfv (GL_LIGHT_MODEL_AMBIENT, ambientLight);
        glLightfv (GL_LIGHT0, GL_DIFFUSE, ambientLight);
        glLightfv (GL_LIGHT0, GL_SPECULAR, specular);
        glLightfv (GL_LIGHT0, GL_POSITION, lightPos);
        glLightf (GL_LIGHT0, GL_SPOT_CUTOFF, 50.0f);
        glEnable (GL_LIGHT0);
        glEnable (GL_COLOR_MATERIAL);
        glColorMaterial (GL_FRONT, GL_AMBIENT_AND_DIFFUSE);
        glMaterialfv (GL_FRONT, GL_SPECULAR, specref);
        glMateriali (GL_FRONT, GL_SHININESS,128);
        glClearColor (0.0f, 0.0f, 0.0f, 1.0f);
        gldrawable.gl_end ();

    /* Widget is resized */
    def on_configure_event(widget: Widget, event: EventConfigure): bool
        var glcontext = WidgetGL.get_gl_context(widget)
        var gldrawable = WidgetGL.get_gl_drawable(widget)
        if !gldrawable.gl_begin(glcontext)
            return false;
        var w = widget.allocation.width
        var h = widget.allocation.height
        glViewport (0, 0, (GLsizei) w, (GLsizei) h);
        glMatrixMode (GL_PROJECTION);
        glLoadIdentity ();
        GLfloat fAspect = (GLfloat) w / (GLfloat) h;
        gluPerspective (35.0f, fAspect, 1.0f, 500.0f);
        glMatrixMode (GL_MODELVIEW);
        glLoadIdentity ();
        glTranslatef (0.0f, 0.0f, -250.0f);
        gldrawable.gl_end ();
        return true;

    /* Widget is asked to paint itself */
    def on_expose_event (widget: Widget, event: EventExpose): bool
        GLContext glcontext = WidgetGL.get_gl_context (widget);
        GLDrawable gldrawable = WidgetGL.get_gl_drawable (widget);
        if !gldrawable.gl_begin (glcontext)
            return false;
        if iShade == 1
            glShadeModel (GL_FLAT);
        else
            glShadeModel (GL_SMOOTH);
        glClear (GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        glPushMatrix ();
        glRotatef (xRot, 1.0f, 0.0f, 0.0f);
        glRotatef (yRot, 0.0f, 1.0f, 0.0f);
        glLightfv (GL_LIGHT0, GL_POSITION, lightPos);
        glLightfv (GL_LIGHT0, GL_SPOT_DIRECTION, spotDir);
        glColor3ub (255,0,0);
        glTranslatef (lightPos[0], lightPos[1], lightPos[2]);
        GLDraw.cone (true, 4.0f, 6.0f, 15, 15);
        glPushAttrib (GL_LIGHTING_BIT);
        glDisable (GL_LIGHTING);
        glColor3ub (255,255,0);
        GLDraw.sphere (true, 3.0f, 15, 15);
        glPopAttrib ();
        glPopMatrix ();
        glColor3ub (0, 0, 255);
        if iTess == 1
            GLDraw.sphere (true, 30.0f, 7, 7);
        else
            if iTess == 2
                GLDraw.sphere (true, 30.0f, 15, 15);
            else
                GLDraw.sphere (true, 30.0f, 50, 50);
        if gldrawable.is_double_buffered()
            gldrawable.swap_buffers ();
        else
            glFlush ();
        gldrawable.gl_end ();
        return true;

    /* A key was pressed */
    def on_key_press_event(drawing_area: Widget, event: EventKey): bool
        string key = Gdk.keyval_name (event.keyval);
        if (key == "Up")
            xRot-= 5.0f;
        if (key == "Down")
            xRot += 5.0f;
        if (key == "Left")
            yRot -= 5.0f;
        if (key == "Right")
            yRot += 5.0f;
        if (xRot > 356.0f)
            xRot = 0.0f;
        if (xRot < -1.0f)
            xRot = 355.0f;
        if (yRot > 356.0f)
            yRot = 0.0f;
        if (yRot < -1.0f)
            yRot = 355.0f;
        queue_draw ();
        return true;

init  //  (string[] args) {
    Gtk.init (ref args);
    Gtk.gl_init (ref args);
    var sample = new SpotSample ();
    sample.show_all ();
    Gtk.main ();
```

### Compile with

```shell
$ valac --pkg=gtk+-2.0 --pkg=gl --pkg=glu --pkg=gtkglext-1.0 gtkglext-spot-sample.vala
```


## Using GLX: Coloured Triangle

```genie
// vala-test:examples/opengl-glx.vala using Gtk;
[indent=4]
uses Gdk
uses GLX
uses GL

class GLXSample: Gtk.Window
    xdisplay: X.Display
    context: GLX.Context;
    xvinfo: XVisualInfo

    construct()
        this.title = "OpenGL with GLX";
        set_reallocate_redraws (true);
        destroy.connect (Gtk.main_quit);
        var attrlist: array of int = {
            GLX_RGBA,
            GLX_RED_SIZE, 1,
            GLX_GREEN_SIZE, 1,
            GLX_BLUE_SIZE, 1,
            GLX_DOUBLEBUFFER, 0
        };
        this.xdisplay = x11_get_default_xdisplay ();
        if !glXQueryExtension (xdisplay, null, null)
            stderr.printf ("OpenGL not supported\n");
        this.xvinfo = glXChooseVisual (xdisplay, x11_get_default_screen (), attrlist);
        if xvinfo == null
            stderr.printf ("Error configuring OpenGL\n");
        var drawing_area = new DrawingArea ();
        drawing_area.set_size_request (300, 300);
        drawing_area.set_double_buffered (false);
        this.context = glXCreateContext (xdisplay, xvinfo, null, true);
        drawing_area.configure_event.connect (on_configure_event);
        drawing_area.expose_event.connect (on_expose_event);
        add (drawing_area);

    def on_configure_event(widget: Widget, event: Gdk.EventConfigure): bool
        if !glXMakeCurrent(xdisplay,
                           x11_drawable_get_xid(widget.window), context)
            return false;
        glViewport (0, 0, (GLsizei) widget.allocation.width,
                          (GLsizei) widget.allocation.height);
        return true;

    def on_expose_event(widget: Widget widget, event: Gdk.EventExpose): bool
        if !glXMakeCurrent(xdisplay,
                           x11_drawable_get_xid (widget.window), context)
            return false;
        glClear (GL_COLOR_BUFFER_BIT);
        glBegin (GL_TRIANGLES);
            glIndexi (0);
            glColor3f (1.0f, 0.0f, 0.0f);
            glVertex2i (0, 1);
            glIndexi (0);
            glColor3f (0.0f, 1.0f, 0.0f);
            glVertex2i (-1, -1);
            glIndexi (0);
            glColor3f (0.0f, 0.0f, 1.0f);
            glVertex2i (1, -1);
        glEnd ();
        glXSwapBuffers (xdisplay, x11_drawable_get_xid (widget.window));
        return true;

init  //  (string[] args) {
    Gtk.init (ref args);
    var sample = new GLXSample ();
    sample.show_all ();
    Gtk.main ();
```

### Compile with

```shell
$ valac --pkg=gtk+-2.0 --pkg=gdk-x11-2.0 --pkg=gl --pkg=glx glx-sample.vala
```


## Using GLUT/FreeGLUT: Teapot
WARNING: It is not finished at all, it works correctly

```genie
// vala-test:examples/opengl-glut.vala using GLib;
[indent=4]
uses GL
uses GLU
uses GLUT

enum EColorBack
    BLACK
    DARKRED
    DARKGREEN
    DARKBLUE
enum EColorDraw
    WHITE
    LIGHTRED
    LIGHTGREEN
    LIGHTBLUE
enum ESolid
    WIRE; SOLID
enum EModel
    TEAPOT
    CUBE
    SPHERE
    CONE
    TORUS
    DODECAHEDRON
    OCTAHEDRON
    TETRAHEDRON
    ICOSAHEDRON
enum EAxes
    AXESNO
    AXESSIMPLE

struct SRgba
    R: GLdouble
    G: GLdouble
    B: GLdouble
    A: GLdouble

    construct(r: GLdouble=0, g: GLdouble=0, b: GLdouble=0, a: GLdouble=1)
        R = r;
        G = g;
        B = b;
        A = a;

struct SPreferences
    ColorFondo: SRgba
    ColorDibujo: SRgba
    Iluminacion: bool
    Solid: ESolid
    Model: EModel
    Axes: EAxes
    Animation: bool

    construct()
        ColorFondo = SRgba (0.0f, 0.0f, 0.0f, 1.0f);
        ColorDibujo = SRgba (1.0f, 1.0f, 1.0f, 1.0f);
        Iluminacion = true;
        Solid = ESolid.WIRE;
        Model = EModel.TEAPOT;
        Axes = EAxes.AXESNO;
        Animation = false;

public class Example : Object {
    alpha: static GLfloat
    beta: static GLfloat
    x0: static int
    y0: static int
    preferences: static SPreferences

    def static on_glutDisplayFunc()
        glClearColor ((GLclampf) preferences.ColorFondo.R,
                        (GLclampf) preferences.ColorFondo.G,
                        (GLclampf) preferences.ColorFondo.B,
                        (GLclampf) preferences.ColorFondo.A);
        glClear (GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        glColor3d (preferences.ColorDibujo.R,
                        preferences.ColorDibujo.G,
                        preferences.ColorDibujo.B);
        glMatrixMode (GL_PROJECTION);
        glLoadIdentity ();
        gluPerspective (20.0f, 1.0f, 1.0f, 10.0f);
        glMatrixMode (GL_MODELVIEW);
        glLoadIdentity ();
        gluLookAt (0.0f, 0.0f, 5.0f,
                        0.0f, 0.0f, 0.0f,
                        0.0f, 1.0f, 0.0f);
        glRotatef (alpha, 1.0f, 0.0f, 0.0f);
        glRotatef (beta, 0.0f, 1.0f, 0.0f);
        if preferences.Axes == EAxes.AXESSIMPLE
            glBegin (GL_LINES);
            glVertex3f (0.0f, 0.0f, 0.0f);
            glVertex3f (0.8f, 0.0f, 0.0f);
            glVertex3f (0.0f, 0.0f, 0.0f);
            glVertex3f (0.0f, 0.8f, 0.0f);
            glVertex3f (0.0f, 0.0f, 0.0f);
            glVertex3f (0.0f, 0.0f, 0.8f);
            glEnd ();
        if preferences.Solid == ESolid.WIRE
            case preferences.Model
                when EModel.TEAPOT
                    glutWireTeapot (0.5);
                when EModel.CUBE
                    glutWireCube (0.5);
                when EModel.SPHERE
                    glutWireSphere (0.5, 40, 40);
                when EModel.CONE
                    glutWireCone (0.5, 0.8, 40, 40);
                when EModel.TORUS
                    glutWireTorus (0.2, 0.5, 40, 40);
                when EModel.DODECAHEDRON
                    glutWireDodecahedron ();
                when EModel.OCTAHEDRON
                    glutWireOctahedron ();
                when EModel.TETRAHEDRON
                    glutWireTetrahedron ();
                when EModel.ICOSAHEDRON
                    glutWireIcosahedron ();
        else  // ESolid.SOLID
            case preferences.Model
                when EModel.TEAPOT
                    glutSolidTeapot (0.5);
                when EModel.CUBE
                    glutSolidCube (0.5);
                when EModel.SPHERE
                    glutSolidSphere (0.5, 40, 40);
                when EModel.CONE
                    glutSolidCone (0.5, 0.8, 40, 40);
                when EModel.TORUS
                    glutSolidTorus (0.2, 0.5, 40, 40);
                when EModel.DODECAHEDRON
                    glutSolidDodecahedron ();
                when EModel.OCTAHEDRON
                    glutSolidOctahedron ();
                when EModel.TETRAHEDRON
                    glutSolidTetrahedron ();
                when EModel.ICOSAHEDRON
                    glutSolidIcosahedron ();
        glFlush ();
        glutSwapBuffers ();

    def static on_glutMouseFunc(button: int, state: int, x: int, y: int)
        if (button == GLUT_LEFT_BUTTON) and (state == GLUT_DOWN)
            x0 = x;
            y0 = y;

    def static on_glutMotionFunc (x: int, y: int) {
        alpha = (alpha + (y - y0));
        beta = (beta + (x - x0));
        x0 = x;
        y0 = y;
        glutPostRedisplay();

    def static on_glutCreateMenu (opcion: int)
        pass

    def static on_glutCreateMenu_EColorBack (opcion: int) {
        case  opcion
            when EColorBack.BLACK
                preferences.ColorFondo.R = 0.0f;
                preferences.ColorFondo.G = 0.0f;
                preferences.ColorFondo.B = 0.0f;
            when EColorBack.DARKRED
                preferences.ColorFondo.R = 0.25f;
                preferences.ColorFondo.G = 0.05f;
                preferences.ColorFondo.B = 0.05f;
            when EColorBack.DARKGREEN
                preferences.ColorFondo.R = 0.05f;
                preferences.ColorFondo.G = 0.25f;
                preferences.ColorFondo.B = 0.05f;
            when EColorBack.DARKBLUE
                preferences.ColorFondo.R = 0.05f;
                preferences.ColorFondo.G = 0.05f;
                preferences.ColorFondo.B = 0.25f;
        glutPostRedisplay();

    def static on_glutCreateMenu_EColorDraw (opcion: int) {
        case opcion
            when EColorDraw.WHITE
                preferences.ColorDibujo.R = 1.0f;
                preferences.ColorDibujo.G = 1.0f;
                preferences.ColorDibujo.B = 1.0f;
            when EColorDraw.LIGHTRED
                preferences.ColorDibujo.R = 0.65f;
                preferences.ColorDibujo.G = 0.05f;
                preferences.ColorDibujo.B = 0.05f;
            when EColorDraw.LIGHTGREEN
                preferences.ColorDibujo.R = 0.05f;
                preferences.ColorDibujo.G = 0.65f;
                preferences.ColorDibujo.B = 0.05f;
            when EColorDraw.LIGHTBLUE
                preferences.ColorDibujo.R = 0.05f;
                preferences.ColorDibujo.G = 0.05f;
                preferences.ColorDibujo.B = 0.65f;
        glutPostRedisplay();

    def static on_glutCreateMenu_ESolid(opcion: int)
        preferences.Solid = (ESolid) opcion;
        glutPostRedisplay();

    def static on_glutCreateMenu_EModel(opcion: int)
        preferences.Model = (EModel) opcion;
        glutPostRedisplay();

    def static on_glutCreateMenu_EAxes(opcion: int)
        preferences.Axes = (EAxes) opcion;
        glutPostRedisplay();

    def static on_glutCreateMenu_Animation(opcion: int) {
        case opcion
            when 0
                preferences.Animation = false;
            when 1
                preferences.Animation = true;
                glutTimerFunc (20, on_glutTimerFunc, 1);
        glutPostRedisplay();

    def static on_glutTimerFunc()
        glutPostRedisplay();
        beta ++;
        if preferences.Animation == true
            glutTimerFunc (20, on_glutTimerFunc, 1);

    def static Init_Window(args: array of string)
        glutInit (ref args.length, args);
        glutInitDisplayMode (GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
        glutInitWindowSize (400, 400);
        glutInitWindowPosition (100, 100);
        glutCreateWindow ("Glut example");

    def static Init_Events()
        glutDisplayFunc (on_glutDisplayFunc);
        glutMouseFunc (on_glutMouseFunc);
        glutMotionFunc (on_glutMotionFunc);

    def static Init_Menu()
        var menuBack = glutCreateMenu (on_glutCreateMenu_EColorBack);
        glutAddMenuEntry ("Black", EColorBack.BLACK);
        glutAddMenuEntry ("Dark red", EColorBack.DARKRED);
        glutAddMenuEntry ("Dark green", EColorBack.DARKGREEN);
        glutAddMenuEntry ("Dark blue", EColorBack.DARKBLUE);
        var menuDraw = glutCreateMenu (on_glutCreateMenu_EColorDraw);
        glutAddMenuEntry ("White", EColorDraw.WHITE);
        glutAddMenuEntry ("Light red", EColorDraw.LIGHTRED);
        glutAddMenuEntry ("Light green", EColorDraw.LIGHTGREEN);
        glutAddMenuEntry ("Light blue", EColorDraw.LIGHTBLUE);
        var menuSolid = glutCreateMenu (on_glutCreateMenu_ESolid);
        glutAddMenuEntry ("Wire", ESolid.WIRE);
        glutAddMenuEntry ("Solid", ESolid.SOLID);
        var menuModel = glutCreateMenu (on_glutCreateMenu_EModel);
        glutAddMenuEntry ("Teapot", EModel.TEAPOT);
        glutAddMenuEntry ("Cube", EModel.CUBE);
        glutAddMenuEntry ("Sphere", EModel.SPHERE);
        glutAddMenuEntry ("Cone", EModel.CONE);
        glutAddMenuEntry ("Torus", EModel.TORUS);
        glutAddMenuEntry ("Dodecahedron", EModel.DODECAHEDRON);
        glutAddMenuEntry ("Octahedron", EModel.OCTAHEDRON);
        glutAddMenuEntry ("Tetrahedron", EModel.TETRAHEDRON);
        glutAddMenuEntry ("Icosahedron", EModel.ICOSAHEDRON);
        var menuAxes = glutCreateMenu (on_glutCreateMenu_EAxes);
        glutAddMenuEntry ("No axes", EAxes.AXESNO);
        glutAddMenuEntry ("Simple axes", EAxes.AXESSIMPLE);
        var menuAnimation = glutCreateMenu (on_glutCreateMenu_Animation);
        glutAddMenuEntry ("Disable", 0);
        glutAddMenuEntry ("Enable", 1);
        var menuMain = glutCreateMenu(on_glutCreateMenu);
        glutAddSubMenu ("Background color", menuBack);
        glutAddSubMenu ("Color drawing", menuDraw);
        glutAddSubMenu ("Type of representation", menuSolid);
        glutAddSubMenu ("Model", menuModel);
        glutAddSubMenu ("Axes", menuAxes);
        glutAddSubMenu ("Animation", menuAnimation);
        glutAttachMenu ((int)GLUT_RIGHT_BUTTON);

    def static Init_Options()
        glPolygonMode (GL_FRONT, GL_FILL);
        glFrontFace   (GL_CCW);
        glCullFace    (GL_BACK);
        glEnable      (GL_CULL_FACE);
        // glShadeModel  (GL_FLAT);
        glShadeModel  (GL_SMOOTH);
        glDepthFunc   (GL_LEQUAL);
        glEnable      (GL_DEPTH_TEST);
        glEnable      (GL_NORMALIZE);

    def static Init_Lighting()
        position: array of GLfloat = {0.0f, 1.0f, 1.0f, 1.0f}
        diffuse : array of GLfloat = {0.7f, 0.7f, 0.7f, 1.0f}
        specular: array of GLfloat = {0.2f, 0.2f, 0.2f, 1.0f}
        ambient : array of GLfloat = {0.2f, 0.2f, 0.2f, 1.0f}
        glLightModelfv (GL_LIGHT_MODEL_AMBIENT, ambient);
        glLightfv (GL_LIGHT0, GL_POSITION, position);
        glLightfv (GL_LIGHT0, GL_DIFFUSE,  diffuse);
        glLightfv (GL_LIGHT0, GL_SPECULAR, specular);
        glEnable (GL_LIGHTING);
        glEnable (GL_LIGHT0);

    def static Init_Material()
        colorAmbientDiffuse: array of GLfloat = {0.1f, 0.5f, 0.8f, 1.0f};
        colorSpecular      : array of GLfloat = {1.0f, 1.0f, 1.0f, 1.0f};
        shineSpecular      : array of GLfloat = {10.0f};
        glMaterialfv (GL_FRONT, GL_AMBIENT_AND_DIFFUSE, colorAmbientDiffuse);
        glMaterialfv (GL_FRONT, GL_SPECULAR, colorSpecular);
        glMaterialfv (GL_FRONT, GL_SHININESS, shineSpecular);

init  // atic void main (string[] args) {
    preferences = SPreferences ();
    Init_Window (args);
    Init_Events ();
    Init_Menu ();
    Init_Options ();
    Init_Lighting ();
    Init_Material ();
    glutMainLoop();
```

### Compile with

```shell
$ valac --pkg=gl --pkg=glu --pkg=glut -X -lglut glut-sample.vala
```

Vala/Examples Projects/Vala/OpenGLSamples
    (last edited 2013-11-22 16:48:29 by WilliamJonMcCann)
