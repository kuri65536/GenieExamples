# Projects/Vala/ClutterSamples - GNOME Wiki!
# Vala Clutter Samples

## Animated Actors

```genie
[indent=4]
uses Clutter

class ClutterDemo
    stage: Stage
    rectangles: array of Actor
    const colors: array of string = {
        "blanched almond",
        "OldLace",
        "MistyRose",
        "White",
        "LavenderBlush",
        "CornflowerBlue",
        "chartreuse",
        "chocolate",
        "light coral",
        "medium violet red",
        "LemonChiffon2",
        "RosyBrown3"
    }

    construct()
        stage = new Stage()
        stage.set_size(512,512);
        stage.background_color = Color () { alpha = 255 };
        rectangles = new array of Actor[colors.length]
        stage.hide.connect (Clutter.main_quit);
        create_rectangles ();
        stage.show ();

    def create_rectangles()
        var i = 0
        while (i < colors.length)
            var r = new Actor();
            r.width = r.height = stage.height / colors.length;
            r.background_color = Color.from_string (colors[i]);
            var point = Point.alloc();
            point.init(0.5f,0.5f) ;
            r.pivot_point = point;
            r.y = i * r.height;
            stage.add_child (r);
            rectangles[i] = r;
            i += 1

    def start()
        var transitions = new array of PropertyTransition[rectangles.length]
        var i = 0
        while (i < rectangles.length)
            var transgroup = new TransitionGroup();
            var transition = new PropertyTransition ("x");
            transition.set_to_value(stage.width/2 - rectangles[i].width/2);
            transition.set_duration(2000);
            transition.set_progress_mode (AnimationMode.LINEAR);
            transgroup.add_transition(transition);
            transition = new PropertyTransition ("rotation_angle_z");
            transition.set_to_value(500.0);
            transition.set_duration(2000);
            transition.set_progress_mode (AnimationMode.LINEAR);
            transgroup.add_transition(transition);
            transgroup.set_duration(2000);
            rectangles[i].add_transition("rectAnimation", transgroup);
            transitions[i] = transition;
            i += 1

        transitions[transitions.length - 1].completed += def (ptr)
            var CONGRATS_EXPLODE_DURATION = 3000;
            var text = new Text.full ("Bitstream Vera Sans 40",
                "Congratulations!",
                Color.from_string ("white"));
            var point = Point.alloc();
            point.init(0.5f, 0.5f);
            text.pivot_point = point;
            text.x = stage.width / 2 - text.width / 2;
            text.y = -text.height;    // Off-stage
            stage.add_child (text);
            var transition = new PropertyTransition ("y");
            transition.set_to_value(stage.height/2 - text.height/2);
            transition.set_duration(CONGRATS_EXPLODE_DURATION / 2);
            transition.set_progress_mode(AnimationMode.EASE_OUT_BOUNCE);
            text.add_transition("rectAnimation", transition);
            var j = 0
            while (j < rectangles.length)
                var transgroup = new TransitionGroup();
                /* "x" property transition */
                transition = new PropertyTransition("x");
                transition.set_to_value(Random.next_double() * stage.width );
                transition.set_duration(CONGRATS_EXPLODE_DURATION);
                transgroup.add_transition(transition);
                transition.set_progress_mode(AnimationMode.EASE_OUT_BOUNCE);
                /* "y" property transition */
                transition = new PropertyTransition("y");
                transition.set_to_value(Random.next_double() * stage.height/2 +
                        stage.height/2);
                transition.set_duration(CONGRATS_EXPLODE_DURATION);
                transition.set_progress_mode(AnimationMode.EASE_OUT_BOUNCE);
                transgroup.add_transition(transition);
                /* "opacity" property transition */
                transition = new PropertyTransition("opacity");
                transition.set_to_value(0);
                transition.set_duration(CONGRATS_EXPLODE_DURATION );
                transition.set_progress_mode(AnimationMode.EASE_OUT_BOUNCE);
                transgroup.add_transition(transition);
                /* TransitionGroup duration seems to be set explicitely -
                 * at least so large value as the longest duration among
                 * included Transitions */
                transgroup.set_duration(CONGRATS_EXPLODE_DURATION);
                transgroup.delay = CONGRATS_EXPLODE_DURATION/3;
                rectangles[j].add_transition("transbox", transgroup);
                j += 1

init
    if Clutter.init(ref args) < 0
        stderr.printf("Failed to initialize clutter\n")
        return  // 1
    var demo = new ClutterDemo ()
    demo.start ()
    Clutter.main ()
    // TODO(shimoda): return 0; in init()
```

```shell
# (install required in Ubuntu 18.04): sudo apt install libclutter-1.0-dev
$ valac --pkg=clutter-1.0 clutter-demo.vala
$ ./clutter-demo
```

## Animated Actors - original
compilable as for clutter 1.16.4, but using deprecated APIs
Requires Vala >= 0.7.9

```genie
// vala-test:examples/clutter-demo.vala
[indent=4]
uses Clutter

class ClutterDemo
    stage: Stage
    rectangles: array of Rectangle
    const colors: array of string = {
        "blanched almond",
        "OldLace",
        "MistyRose",
        "White",
        "LavenderBlush",
        "CornflowerBlue",
        "chartreuse",
        "chocolate",
        "light coral",
        "medium violet red",
        "LemonChiffon2",
        "RosyBrown3"
    };
    construct()
        stage = Stage.get_default ();
        rectangles = new array of Rectangle[colors.length];
        stage.hide.connect (Clutter.main_quit);
        create_rectangles ();
        stage.color = Color () { alpha = 255 };
        stage.show_all ();

    def create_rectangles()
        var i = 0
        while i < colors.length
            var r = new Rectangle ();
            r.width = r.height = stage.height / colors.length;
            r.color = Color.from_string (colors[i]);
            r.anchor_gravity = Gravity.CENTER;
            r.y = i * r.height + r.height / 2;
            stage.add_actor (r);
            rectangles[i] = r;
            i += 1

    def start()
        var animations = new array of Animation[rectangles.length];
        var i = 0
        while i < rectangles.length
            animations[i] = rectangles[i].animate (
                                      AnimationMode.LINEAR, 5000,
                                      x: stage.width / 2,
                                      rotation_angle_z: 500.0);
            i += 1
        animations[animations.length - 1].completed += def()
            var text = new Text.full ("Bitstream Vera Sans 40",
                                      "Congratulations!",
                                      Color.from_string ("white"));
            text.anchor_gravity = Gravity.CENTER;
            text.x = stage.width / 2;
            text.y = -text.height;    // Off-stage
            stage.add_actor (text);
            text.animate (AnimationMode.EASE_OUT_BOUNCE, 3000,
                          y: stage.height / 2);
            i = 0
            while i < rectangles.length
                rectangles[i].animate (
                        AnimationMode.EASE_OUT_BOUNCE, 3000,
                        x: Random.next_double () * stage.width,
                        y: Random.next_double () * stage.height / 2
                                                 + stage.height / 2,
                        rotation_angle_z: rectangles[i].rotation_angle_z,
                        opacity: 0);
                i += 1

init  // (string[] args) {
    Clutter.init (ref args);
    var demo = new ClutterDemo ();
    demo.start ();
    Clutter.main ();
```

```shell
# (install required in Ubuntu 18.04): sudo apt install libclutter-1.0-dev
$ valac --pkg=clutter-1.0 clutter-demo.vala
$ ./clutter-demo
```


## Blender models
Requires Vala (>= 0.9.5) You can import 3D models inside your
Clutter application using the Mash library which reads PLY formatted files
(Blender is able to export in PLY).

The following code will render and rotate a model on the Y axis.

```genie
[indent=4]
def after()
    Cogl.set_depth_test_enabled (false);

init  // (string[] args)
    Clutter.init (ref args);
    if args.length != 2 and args.length != 3
        stderr.printf ("usage: %s <ply-file> [texture]\n", args[0]);
        return 1;
    var stage = Clutter.Stage.get_default ();
    try
        var model = new Mash.Model.from_file (Mash.DataFlags.NONE, args[1]);
        if args.length > 2
            try
                var texture = new Cogl.Texture.from_file(
                    args[2], Cogl.TextureFlags.NONE, Cogl.PixelFormat.ANY);
                var material = new Cogl.Material ();
                material.set_layer (0, texture);
                model.set_material (material);
            except e: Error
                warning (e.message);
        model.set_size (stage.width * 0.7f, stage.height * 0.7f);
        model.set_position (stage.width * 0.15f, stage.height * 0.15f);
        var center_vertex = Clutter.Vertex ();
        center_vertex.x = stage.width * 0.35f;
        center_vertex.y = 0.0f;
        center_vertex.z = 0.0f;
        var anim = model.animate (Clutter.AnimationMode.LINEAR, 3000,
                                "rotation-angle-y", 360.0f,
                                "fixed::rotation-center-y", ref center_vertex);
        anim.loop = true;
        stage.add_actor (model);
        /* Enable depth testing only for this actor */
        model.paint += def()
            Cogl.set_depth_test_enabled (true);
        model.paint.connect_after(after)
    except e: Error
        warning (e.message);
    stage.show ();
    Clutter.main ();
```

Fetch a sample model: TheMonkey.ply.

The compilation command is a bit hard-coded due to missing features
in the Vala GIR parser:

`$ valac --pkg=atk --pkg=clutter-1.0 --pkg=Mash-0.1 \

```shell
$ valac --pkg=atk --pkg=clutter-1.0
    mash-demo.vala -X -I/usr/include/mash-0.1 -X -lmash-0.1
$ ./mash-demo TheMonkey.ply
```

You can pass a texture as second argument to mash-demo.

Vala/Examples Projects/Vala/ClutterSamples
    (last edited 2014-05-18 17:32:45 by TadeuszSzczyrba)

