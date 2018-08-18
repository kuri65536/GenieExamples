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

### Compile with:

```shell
$ valac --pkg=gl --pkg=libglfw glfw-sample.vala
```


## Using GtkGLExt: Coloured Triangle

GtkGLExt adds OpenGL capabilities to GTK+ widgets.

```genie
// vala-test:examples/opengl-gtkglext.vala
using Gtk;
using Gdk;
using GL;
class GtkGLExtSample : Gtk.Window {
    public GtkGLExtSample () {
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
    }
    /* Widget is resized */
    private bool on_configure_event (Widget widget, EventConfigure event) {
        GLContext glcontext = WidgetGL.get_gl_context (widget);
        GLDrawable gldrawable = WidgetGL.get_gl_drawable (widget);
        if (!gldrawable.gl_begin (glcontext))
            return false;
        glViewport (0, 0, (GLsizei) widget.allocation.width,
                          (GLsizei) widget.allocation.height);
        gldrawable.gl_end ();
        return true;
    }
    /* Widget is asked to paint itself */
    private bool on_expose_event (Widget widget, EventExpose event) {
        GLContext glcontext = WidgetGL.get_gl_context (widget);
        GLDrawable gldrawable = WidgetGL.get_gl_drawable (widget);
        if (!gldrawable.gl_begin (glcontext))
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
        if (gldrawable.is_double_buffered ())
            gldrawable.swap_buffers ();
        else
            glFlush ();
        gldrawable.gl_end ();
        return true;
    }
}
void main (string[] args) {
    Gtk.init (ref args);
    Gtk.gl_init (ref args);
    var sample = new GtkGLExtSample ();
    sample.show_all ();
    Gtk.main ();
}
```

### Compile with:

```shell
$ valac --pkg gtk+-2.0 --pkg gl --pkg gtkglext-1.0 gtkglext-sample.vala
```


## Using GtkGLExt: Spotlight
Move the light with the arrow keys!

```genie
// vala-test:examples/opengl-gtkglext-spot.vala using Gtk;
using Gdk;
using GL;
using GLU;
class SpotSample : Gtk.Window {
    static GLfloat xRot = 0.0f;
    static GLfloat yRot = 0.0f;
    static int iShade = 2;
    static int iTess = 3;
    static const GLfloat[] lightPos = { 0.0f, 0.0f, 75.0f, 1.0f };
    static const GLfloat[] specular = { 1.0f, 1.0f, 1.0f, 1.0f };
    static const GLfloat[] specref =  { 1.0f, 1.0f, 1.0f, 1.0f };
    static const GLfloat[] ambientLight = { 0.5f, 0.5f, 0.5f, 1.0f };
    static const GLfloat[] spotDir = { 0.0f, 0.0f, -1.0f };
    public SpotSample () {
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
    }
    /* Widget gets initialized */
    private void on_realize (Widget widget) {
        GLContext glcontext = WidgetGL.get_gl_context (widget);
        GLDrawable gldrawable = WidgetGL.get_gl_drawable (widget);
        if (!gldrawable.gl_begin (glcontext))
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
    }
    /* Widget is resized */
    private bool on_configure_event (Widget widget, EventConfigure event) {
        GLContext glcontext = WidgetGL.get_gl_context (widget);
        GLDrawable gldrawable = WidgetGL.get_gl_drawable (widget);
        if (!gldrawable.gl_begin (glcontext))
            return false;
        int w = widget.allocation.width;
        int h = widget.allocation.height;
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
    }
    /* Widget is asked to paint itself */
    private bool on_expose_event (Widget widget, EventExpose event) {
        GLContext glcontext = WidgetGL.get_gl_context (widget);
        GLDrawable gldrawable = WidgetGL.get_gl_drawable (widget);
        if (!gldrawable.gl_begin (glcontext))
            return false;
        if (iShade == 1)
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
        if (iTess == 1) {
            GLDraw.sphere (true, 30.0f, 7, 7);
        } else {
            if (iTess == 2)
                GLDraw.sphere (true, 30.0f, 15, 15);
            else
                GLDraw.sphere (true, 30.0f, 50, 50);
        }
        if (gldrawable.is_double_buffered ())
            gldrawable.swap_buffers ();
        else
            glFlush ();
        gldrawable.gl_end ();
        return true;
    }
    /* A key was pressed */
    private bool on_key_press_event (Widget drawing_area, EventKey event) {
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
    }
}
void main (string[] args) {
    Gtk.init (ref args);
    Gtk.gl_init (ref args);
    var sample = new SpotSample ();
    sample.show_all ();
    Gtk.main ();
}
```

### Compile with:

```shell
$ valac --pkg gtk+-2.0 --pkg gl --pkg glu --pkg gtkglext-1.0 gtkglext-spot-sample.vala
```


## Using GLX: Coloured Triangle

```genie
// vala-test:examples/opengl-glx.vala using Gtk;
using Gdk;
using GLX;
using GL;
class GLXSample : Gtk.Window {
    private X.Display xdisplay;
    private GLX.Context context;
    private XVisualInfo xvinfo;
    public GLXSample () {
        this.title = "OpenGL with GLX";
        set_reallocate_redraws (true);
        destroy.connect (Gtk.main_quit);
        int[] attrlist = {
            GLX_RGBA,
            GLX_RED_SIZE, 1,
            GLX_GREEN_SIZE, 1,
            GLX_BLUE_SIZE, 1,
            GLX_DOUBLEBUFFER, 0
        };
        this.xdisplay = x11_get_default_xdisplay ();
        if (!glXQueryExtension (xdisplay, null, null)) {
            stderr.printf ("OpenGL not supported\n");
        }
        this.xvinfo = glXChooseVisual (xdisplay, x11_get_default_screen (), attrlist);
        if (xvinfo == null) {
            stderr.printf ("Error configuring OpenGL\n");
        }
        var drawing_area = new DrawingArea ();
        drawing_area.set_size_request (300, 300);
        drawing_area.set_double_buffered (false);
        this.context = glXCreateContext (xdisplay, xvinfo, null, true);
        drawing_area.configure_event.connect (on_configure_event);
        drawing_area.expose_event.connect (on_expose_event);
        add (drawing_area);
    }
    private bool on_configure_event (Widget widget, Gdk.EventConfigure event) {
        if (!glXMakeCurrent (xdisplay, x11_drawable_get_xid (widget.window), context))
            return false;
        glViewport (0, 0, (GLsizei) widget.allocation.width,
                          (GLsizei) widget.allocation.height);
        return true;
    }
    private bool on_expose_event (Widget widget, Gdk.EventExpose event) {
        if (!glXMakeCurrent (xdisplay, x11_drawable_get_xid (widget.window), context))
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
    }
}
void main (string[] args) {
    Gtk.init (ref args);
    var sample = new GLXSample ();
    sample.show_all ();
    Gtk.main ();
}
```

### Compile with:

```shell
$ valac --pkg gtk+-2.0 --pkg gdk-x11-2.0 --pkg gl --pkg glx glx-sample.vala
```


## Using GLUT/FreeGLUT: Teapot
WARNING: It is not finished at all, it works correctly

```genie
// vala-test:examples/opengl-glut.vala using GLib;
using GL;
using GLU;
using GLUT;
public enum EColorBack {BLACK, DARKRED, DARKGREEN, DARKBLUE}
public enum EColorDraw {WHITE, LIGHTRED, LIGHTGREEN, LIGHTBLUE}
public enum ESolid {WIRE, SOLID}
public enum EModel {TEAPOT, CUBE, SPHERE, CONE, TORUS, DODECAHEDRON, OCTAHEDRON, TETRAHEDRON, ICOSAHEDRON}
public enum EAxes {AXESNO, AXESSIMPLE}
public struct SRgba {
        public GLdouble R;
        public GLdouble G;
        public GLdouble B;
        public GLdouble A;
        public SRgba (GLdouble r = 0, GLdouble g = 0, GLdouble b = 0, GLdouble a = 1) {
                R = r;
                G = g;
                B = b;
                A = a;
        }
}
public struct SPreferences {
        public SRgba ColorFondo;
        public SRgba ColorDibujo;
        public bool Iluminacion;
        public ESolid Solid;
        public EModel Model;
        public EAxes Axes;
        public bool Animation;
        public SPreferences () {
                ColorFondo = SRgba (0.0f, 0.0f, 0.0f, 1.0f);
                ColorDibujo = SRgba (1.0f, 1.0f, 1.0f, 1.0f);
                Iluminacion = true;
                Solid = ESolid.WIRE;
                Model = EModel.TEAPOT;
                Axes = EAxes.AXESNO;
                Animation = false;
        }
}
public class Example : Object {
        private static GLfloat alpha;
        private static GLfloat beta;
        private static int x0;
        private static int y0;
        private static SPreferences preferences;
        protected static void on_glutDisplayFunc () {
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
                if (preferences.Axes == EAxes.AXESSIMPLE) {
                        glBegin (GL_LINES);
                                glVertex3f (0.0f, 0.0f, 0.0f);
                                glVertex3f (0.8f, 0.0f, 0.0f);
                                glVertex3f (0.0f, 0.0f, 0.0f);
                                glVertex3f (0.0f, 0.8f, 0.0f);
                                glVertex3f (0.0f, 0.0f, 0.0f);
                                glVertex3f (0.0f, 0.0f, 0.8f);
                        glEnd ();
                }
                if (preferences.Solid == ESolid.WIRE ) {
                        switch (preferences.Model) {
                        case EModel.TEAPOT:
                                glutWireTeapot (0.5);
                                break;
                        case EModel.CUBE:
                                glutWireCube (0.5);
                                break;
                        case EModel.SPHERE:
                                glutWireSphere (0.5, 40, 40);
                                break;
                        case EModel.CONE:
                                glutWireCone (0.5, 0.8, 40, 40);
                                break;
                        case EModel.TORUS:
                                glutWireTorus (0.2, 0.5, 40, 40);
                                break;
                        case EModel.DODECAHEDRON:
                                glutWireDodecahedron ();
                                break;
                        case EModel.OCTAHEDRON:
                                glutWireOctahedron ();
                                break;
                        case EModel.TETRAHEDRON:
                                glutWireTetrahedron ();
                                break;
                        case EModel.ICOSAHEDRON:
                                glutWireIcosahedron ();
                                break;
                        }
                } else { // ESolid.SOLID
                        switch (preferences.Model) {
                        case EModel.TEAPOT:
                                glutSolidTeapot (0.5);
                                break;
                        case EModel.CUBE:
                                glutSolidCube (0.5);
                                break;
                        case EModel.SPHERE:
                                glutSolidSphere (0.5, 40, 40);
                                break;
                        case EModel.CONE:
                                glutSolidCone (0.5, 0.8, 40, 40);
                                break;
                        case EModel.TORUS:
                                glutSolidTorus (0.2, 0.5, 40, 40);
                                break;
                        case EModel.DODECAHEDRON:
                                glutSolidDodecahedron ();
                                break;
                        case EModel.OCTAHEDRON:
                                glutSolidOctahedron ();
                                break;
                        case EModel.TETRAHEDRON:
                                glutSolidTetrahedron ();
                                break;
                        case EModel.ICOSAHEDRON:
                                glutSolidIcosahedron ();
                                break;
                        }
                }
                glFlush ();
                glutSwapBuffers ();
        }
        protected static void on_glutMouseFunc (int button, int state, int x, int y) {
                if ((button == GLUT_LEFT_BUTTON) &amp; (state == GLUT_DOWN)) {
                        x0 = x;
                        y0 = y;
                }
        }
        protected static void on_glutMotionFunc (int x, int y) {
                alpha = (alpha + (y - y0));
                beta = (beta + (x - x0));
                x0 = x;
                y0 = y;
                glutPostRedisplay();
        }
        protected static void on_glutCreateMenu (int opcion) { }
        protected static void on_glutCreateMenu_EColorBack (int opcion) {
                switch (opcion) {
                case EColorBack.BLACK:
                        preferences.ColorFondo.R = 0.0f;
                        preferences.ColorFondo.G = 0.0f;
                        preferences.ColorFondo.B = 0.0f;
                        break;
                case EColorBack.DARKRED:
                        preferences.ColorFondo.R = 0.25f;
                        preferences.ColorFondo.G = 0.05f;
                        preferences.ColorFondo.B = 0.05f;
                        break;
                case EColorBack.DARKGREEN:
                        preferences.ColorFondo.R = 0.05f;
                        preferences.ColorFondo.G = 0.25f;
                        preferences.ColorFondo.B = 0.05f;
                        break;
                case EColorBack.DARKBLUE:
                        preferences.ColorFondo.R = 0.05f;
                        preferences.ColorFondo.G = 0.05f;
                        preferences.ColorFondo.B = 0.25f;
                        break;
                }
                glutPostRedisplay();
        }
        protected static void on_glutCreateMenu_EColorDraw (int opcion) {
                switch (opcion) {
                case EColorDraw.WHITE:
                        preferences.ColorDibujo.R = 1.0f;
                        preferences.ColorDibujo.G = 1.0f;
                        preferences.ColorDibujo.B = 1.0f;
                        break;
                case EColorDraw.LIGHTRED:
                        preferences.ColorDibujo.R = 0.65f;
                        preferences.ColorDibujo.G = 0.05f;
                        preferences.ColorDibujo.B = 0.05f;
                        break;
                case EColorDraw.LIGHTGREEN:
                        preferences.ColorDibujo.R = 0.05f;
                        preferences.ColorDibujo.G = 0.65f;
                        preferences.ColorDibujo.B = 0.05f;
                        break;
                case EColorDraw.LIGHTBLUE:
                        preferences.ColorDibujo.R = 0.05f;
                        preferences.ColorDibujo.G = 0.05f;
                        preferences.ColorDibujo.B = 0.65f;
                        break;
                }
                glutPostRedisplay();
        }
        protected static void on_glutCreateMenu_ESolid (int opcion) {
                preferences.Solid = (ESolid) opcion;
                glutPostRedisplay();
        }
        protected static void on_glutCreateMenu_EModel (int opcion) {
                preferences.Model = (EModel) opcion;
                glutPostRedisplay();
        }
        protected static void on_glutCreateMenu_EAxes (int opcion) {
                preferences.Axes = (EAxes) opcion;
                glutPostRedisplay();
        }
        protected static void on_glutCreateMenu_Animation (int opcion) {
                switch (opcion) {
                case 0:
                        preferences.Animation = false;
                        break;
                case 1:
                        preferences.Animation = true;
                        glutTimerFunc (20, on_glutTimerFunc, 1);
                        break;
                }
                glutPostRedisplay();
        }
        protected static void on_glutTimerFunc () {
                glutPostRedisplay();
                beta ++;
                if (preferences.Animation == true)
                        glutTimerFunc (20, on_glutTimerFunc, 1);
        }
        protected static void Init_Window (string[] args) {
                glutInit (ref args.length, args);
                glutInitDisplayMode (GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
                glutInitWindowSize (400, 400);
                glutInitWindowPosition (100, 100);
                glutCreateWindow ("Glut example");
        }
        protected static void Init_Events () {
                glutDisplayFunc (on_glutDisplayFunc);
                glutMouseFunc (on_glutMouseFunc);
                glutMotionFunc (on_glutMotionFunc);
        }
        protected static void Init_Menu () {
                int menuMain, menuBack, menuDraw, menuSolid, menuModel, menuAxes, menuAnimation;
                menuBack = glutCreateMenu (on_glutCreateMenu_EColorBack);
                glutAddMenuEntry ("Black", EColorBack.BLACK);
                glutAddMenuEntry ("Dark red", EColorBack.DARKRED);
                glutAddMenuEntry ("Dark green", EColorBack.DARKGREEN);
                glutAddMenuEntry ("Dark blue", EColorBack.DARKBLUE);
                menuDraw = glutCreateMenu (on_glutCreateMenu_EColorDraw);
                glutAddMenuEntry ("White", EColorDraw.WHITE);
                glutAddMenuEntry ("Light red", EColorDraw.LIGHTRED);
                glutAddMenuEntry ("Light green", EColorDraw.LIGHTGREEN);
                glutAddMenuEntry ("Light blue", EColorDraw.LIGHTBLUE);
                menuSolid = glutCreateMenu (on_glutCreateMenu_ESolid);
                glutAddMenuEntry ("Wire", ESolid.WIRE);
                glutAddMenuEntry ("Solid", ESolid.SOLID);
                menuModel = glutCreateMenu (on_glutCreateMenu_EModel);
                glutAddMenuEntry ("Teapot", EModel.TEAPOT);
                glutAddMenuEntry ("Cube", EModel.CUBE);
                glutAddMenuEntry ("Sphere", EModel.SPHERE);
                glutAddMenuEntry ("Cone", EModel.CONE);
                glutAddMenuEntry ("Torus", EModel.TORUS);
                glutAddMenuEntry ("Dodecahedron", EModel.DODECAHEDRON);
                glutAddMenuEntry ("Octahedron", EModel.OCTAHEDRON);
                glutAddMenuEntry ("Tetrahedron", EModel.TETRAHEDRON);
                glutAddMenuEntry ("Icosahedron", EModel.ICOSAHEDRON);
                menuAxes = glutCreateMenu (on_glutCreateMenu_EAxes);
                glutAddMenuEntry ("No axes", EAxes.AXESNO);
                glutAddMenuEntry ("Simple axes", EAxes.AXESSIMPLE);
                menuAnimation = glutCreateMenu (on_glutCreateMenu_Animation);
                glutAddMenuEntry ("Disable", 0);
                glutAddMenuEntry ("Enable", 1);
                menuMain = glutCreateMenu(on_glutCreateMenu);
                glutAddSubMenu ("Background color", menuBack);
                glutAddSubMenu ("Color drawing", menuDraw);
                glutAddSubMenu ("Type of representation", menuSolid);
                glutAddSubMenu ("Model", menuModel);
                glutAddSubMenu ("Axes", menuAxes);
                glutAddSubMenu ("Animation", menuAnimation);
                glutAttachMenu ((int)GLUT_RIGHT_BUTTON);
        }
        protected static void Init_Options () {
                glPolygonMode (GL_FRONT, GL_FILL);
                glFrontFace   (GL_CCW);
                glCullFace    (GL_BACK);
                glEnable      (GL_CULL_FACE);
//              glShadeModel  (GL_FLAT);
                glShadeModel  (GL_SMOOTH);
                glDepthFunc   (GL_LEQUAL);
                glEnable      (GL_DEPTH_TEST);
                glEnable      (GL_NORMALIZE);
        }
        protected static void Init_Lighting () {
                GLfloat[] position = {0.0f, 1.0f, 1.0f, 1.0f};
                GLfloat[] diffuse  = {0.7f, 0.7f, 0.7f, 1.0f};
                GLfloat[] specular = {0.2f, 0.2f, 0.2f, 1.0f};
                GLfloat[] ambient  = {0.2f, 0.2f, 0.2f, 1.0f};
                glLightModelfv (GL_LIGHT_MODEL_AMBIENT, ambient);
                glLightfv (GL_LIGHT0, GL_POSITION, position);
                glLightfv (GL_LIGHT0, GL_DIFFUSE,  diffuse);
                glLightfv (GL_LIGHT0, GL_SPECULAR, specular);
                glEnable (GL_LIGHTING);
                glEnable (GL_LIGHT0);
        }
        protected static void Init_Material () {
                GLfloat[] colorAmbientDiffuse = {0.1f, 0.5f, 0.8f, 1.0f};
                GLfloat[] colorSpecular       = {1.0f, 1.0f, 1.0f, 1.0f};
                GLfloat[] shineSpecular       = {10.0f};
                glMaterialfv (GL_FRONT, GL_AMBIENT_AND_DIFFUSE, colorAmbientDiffuse);
                glMaterialfv (GL_FRONT, GL_SPECULAR, colorSpecular);
                glMaterialfv (GL_FRONT, GL_SHININESS, shineSpecular);
        }
        public static void main (string[] args) {
                preferences = SPreferences ();
                Init_Window (args);
                Init_Events ();
                Init_Menu ();
                Init_Options ();
                Init_Lighting ();
                Init_Material ();
                glutMainLoop();
        }
}
```

### Compile with:

```shell
$ valac --pkg gl --pkg glu --pkg glut -X -lglut glut-sample.vala
```

Vala/Examples Projects/Vala/OpenGLSamples
    (last edited 2013-11-22 16:48:29 by WilliamJonMcCann)
