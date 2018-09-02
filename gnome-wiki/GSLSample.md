# Projects/Vala/GSLSample - GNOME Wiki!

Contents

- GNU Scientific Library - Vala Samples
- Statistics Sample
- Special Functions Sample
- Combination Sample
- Linear Algebra Sample
- Eigen System Sample
- Random Number Generation Sample
- Integration Sample
- Monte Carlo Integration Sample
- Multidimensional Root-Finding Sample
- Nonlinear Least-Squares Fitting Sample

# GNU Scientific Library - Vala Samples

These samples are found in the reference manual of GSL and were rewritten for
vala.  Compile all the examples with:

```shell
$ valac sample.gs --pkg=gsl
```

and prerequiste on Ubuntu 18.04

```
$ apt install libgsl-dev
```


## Statistics Sample

```genie
// vala-test:examples/gsl-stats.vala
[indent=4]
uses GLib
uses Gsl

init  // atic void main (string[] args)
    mean, max, min: double
    var data = new array of double = {17.2, 18.1, 16.5, 18.3, 12.6}
    mean = Stats.mean (data, 1, data.length);
    Stats.minmax (out min, out max, data, 1, data.length);
    stdout.printf("promedio %g\n", mean);
    stdout.printf("minimo %g\n", min);
    stdout.printf("maximo %g\n", max);
```

## Special Functions Sample

```genie
[indent=4]
// vala-test:examples/gsl-function.vala
uses GLib
uses Gsl

init
    var x = 5.0;
    res: Result
    var expected = -0.17759677131433830434739701;
    Bessel.J0_e (x, out res);
    stdout.printf("J0(5.0) = %.18f\n+/- %.18f\n", res.val, res.err);
    stdout.printf("exact   = %.18f\n", expected);
```

```shell
$ valac sample.gs --pkg=gsl
```


## Combination Sample

```genie
// vala-test:examples/gsl-combination.vala
[indent=4]
uses GLib
uses Gsl

init  // id main (string[] args)
    i: size_t = 0
    stdout.printf("All subsets of {0,1,2,3} by size:\n");
    while i <= 4
        var c = new Combination.with_zeros (4, i);
        do
            stdout.printf ("{");
            Combination.fprintf (stdout, c, " %u");
            stdout.printf (" }\n");
        while (c.next() == Status.SUCCESS);
        i += 1
```

```shell
$ valac sample.gs --pkg=gsl
```


## Linear Algebra Sample
```genie
// vala-test:examples/gsl-linear-algebra.vala
[indent=4]
uses GLib
uses Gsl

init
    var a_data = new array of double = {0.18, 0.60, 0.57, 0.96,
                                        0.41, 0.24, 0.99, 0.58,
                                        0.14, 0.30, 0.97, 0.66,
                                        0.51, 0.13, 0.19, 0.85};
    var b_data = new array of double = {1.0, 2.0, 3.0, 4.0};
    var m = MatrixView.@array(a_data, 4, 4)
    var b = VectorView.@array(b_data)
    var x = new Vector (4);
    s: int
    var p = new Permutation (4);
    LinAlg.LU_decomp ((Matrix)(&m.matrix), p, out s);
    LinAlg.LU_solve ((Matrix)(&m.matrix), p, (Vector)(&b.vector), x);
    stdout.printf("x = \n");
    Vector.fprintf(stdout, x, "%g");
```

```shell
$ valac sample.gs --pkg=gsl
```

## Eigen System Sample
```genie
[indent=4]
// vala-test:examples/gsl-eigen-system.vala
uses GLib
uses Gsl

init
    var data = new array of double = {1.0  , 1/2.0, 1/3.0, 1/4.0,
                                      1/2.0, 1/3.0, 1/4.0, 1/5.0,
                                      1/3.0, 1/4.0, 1/5.0, 1/6.0,
                                      1/4.0, 1/5.0, 1/6.0, 1/7.0};
    var m = MatrixView.@array(data, 4, 4)
    var eval = new Vector (4);
    var evec = new Matrix (4, 4);
    var w = new EigenSymmvWorkspace(4)
    w.init ((Matrix)(&m.matrix), eval, evec);
    EigenSort.symmv_sort (eval, evec, EigenSortType.ABS_ASC);
    var i = 0
    while i < 4
        var eval_i = eval.get (i);
        var evec_i = evec.column (i);
        stdout.printf("eigenvalue = %g\n", eval_i);
        stdout.printf("eigenvector = \n");
        Vector.fprintf(stdout, (Vector)(&evec_i.vector), "%g");
        i += 1
```

```shell
$ valac sample.gs --pkg=gsl
```


## Random Number Generation Sample
```genie
// vala-test:examples/gsl-random.vala
[indent=4]
uses GLib
uses Gsl

// lic class RNGSample : GLib.Object
const N: int = 10

init
    RNG.env_setup ();
    var T = (RNGType*)RNGTypes.default
    var r = new RNG(T)
    var i = 0
    while i < N
        var u = r.uniform()
        stdout.printf ("%d %.5f\n", i, u);
        i += 1
```

```shell
$ valac sample.gs --pkg=gsl
```


## Integration Sample
```genie
// vala-test:examples/gsl-integration.vala
[indent=4]
uses GLib
uses Gsl

// ss IntegrationSample : GLib.Object
def f(x: double, @params: double*): double
    var alpha = *@params;
    return Math.log(alpha * x) / Math.sqrt(x)

init  // atic void main (string[] args)
    var w = new IntegrationWorkspace(1000)
    integration_result, error: double
    var expected = -4.0;
    var alpha = 1.0;
    var F = Function () {function=f, @params=&alpha};
    Integration.qags(&F, 0, 1, 0, 1.0e-7, 1000, w,
                     out integration_result, out error)
    stdout.printf ("result          = %.18f\n", integration_result);
    stdout.printf ("exact result    = %.18f\n", expected);
    stdout.printf ("extimated error = %.18f\n", error);
    stdout.printf ("actual error    = %.18f\n", integration_result - expected);
    stdout.printf ("intervals = %i\n", (int)w.size);
```

```shell
$ valac sample.gs --pkg=gsl
```


## Monte Carlo Integration Sample
```genie
// vala-test:examples/gsl-monte-carlo-integration.vala
[indent=4]
uses GLib
uses Gsl

// lic class MonteSample : GLib.Object
const exact: double = 1.3932039296856768591842462603255

def g(k: double*, dim: size_t, @params: void*): double
    var A = 1.0 / (Math.PI * Math.PI * Math.PI)
    return A / (1.0 - Math.cos(k[0]) * Math.cos(k[1]) * Math.cos(k[2]));

def display_results(title: string, result: double, error: double)
    stdout.printf ("%s ==================\n", title);
    stdout.printf ("result = % .6f\n", result);
    stdout.printf ("sigma  = % .6f\n", error);
    stdout.printf ("exact  = % .6f\n", exact);
    stdout.printf("error  = % .6f = %.1g sigma\n",
                  result - exact, Math.fabs (result - exact) / error)

init  // atic void main (string[] args)
    res, err: double
    var xl = new array of double = {0, 0, 0}
    var xu = new array of double = {Math.PI, Math.PI, Math.PI}
    var G = MonteFunction() {f=g, dim=3, @params=null}
    calls: size_t = 500000
    RNG.env_setup ();
    var T = (RNGType*)RNGTypes.default
    var r = new RNG(T)

    var s1 = new MontePlainState(3)
    MontePlainState.integrate(&G, xl, xu, 3, calls, r, s1, out res, out err)
    display_results ("plain", res, err);

    var s2 = new MonteMiserState(3)
    MonteMiserState.integrate(&G, xl, xu, 3, calls, r, s2, out res, out err)
    display_results ("miser", res, err);

    var s = new MonteVegasState(3)
    MonteVegasState.integrate(&G, xl, xu, 3, 10000, r, s, out res, out err)
    display_results ("vegas warm_up", res, err);

    stdout.printf ("converging...\n");
    do
        MonteVegasState.integrate (&G, xl, xu, 3, calls/5, r, s, out res, out err);
        stdout.printf ("result = % .6f sigma = % .6f chisq/dof = %.1f\n", res, err, s.chisq);
    while Math.fabs(s.chisq - 1.0) > 0.5
    display_results ("vegas final", res, err);
```

```shell
$ valac sample.gs --pkg=gsl
```


## Multidimensional Root-Finding Sample
```genie
// vala-test:examples/gsl-multidimensional.vala
[indent=4]
uses GLib
uses Gsl

// ss MultiRootSample: GLib.Object
struct RParams
    a: double
    b: double

def rosenbrock_f(x: Vector, @params: void*, f: Vector): int
    var a = ((RParams*)@params)->a
    var b = ((RParams*)@params)->b
    var x0 = x.get(0)
    var x1 = x.get(1)
    var y0 = a * (1 - x0)
    var y1 = b * (x1 - x0 * x0)
    f.set (0, y0);
    f.set (1, y1);
    return Status.SUCCESS;

def rosenbrock_df(x: Vector, @params: void*, J: Matrix): int
    var a = ((RParams*)@params)->a;
    var b = ((RParams*)@params)->b;
    var x0 = x.get (0);
    //double x1 = x.get (1);
    var df00 = -a
    var df01 = 0
    var df10 = -2 * b * x0
    var df11 = b
    J.set (0, 0, df00);
    J.set (0, 1, df01);
    J.set (1, 0, df10);
    J.set (1, 1, df11);
    return Status.SUCCESS;

def rosenbrock_fdf(x: Vector, @params: void*, f: Vector, J: Matrix): int
    rosenbrock_f (x, @params, f);
    rosenbrock_df (x, @params, J);
    return Status.SUCCESS;

def print_state(iter: size_t, s: MultirootFdfsolver)
    stdout.printf("iter = %3u x = % .3f % .3f f(x) = % .3e % .3e\n",
                  (uint)iter, s.x.get(0), s.x.get(1), s.f.get(0), s.f.get(1))

init  // atic void main (string[] args)
    var status = 0;
    iter: size_t = 0
    n: size_t = 2
    var p = RParams() {a=1.0, b=10.0};
    var f = MultirootFunctionFdf () {
        f=rosenbrock_f, df=rosenbrock_df, fdf=rosenbrock_fdf, n=n, @params=&p}
    var x_init = new array of double = {-10.0, -5.0}
    var x = new Vector(n)
    x.set (0, x_init[0]);
    x.set (1, x_init[1]);
    var T = (MultirootFdfsolverType*)MultirootFdfsolverTypes.gnewton;
    var s = new MultirootFdfsolver (T, n);
    s.set (&f, x);
    print_state (iter, s);
    do
        iter++;
        status = s.iterate ();
        print_state (iter, s);
        if ((bool)status)
            break;
        status = MultirootTest.residual (s.f, 1.0e-7);
    while status == Status.CONTINUE && iter < 1000
```

```shell
$ valac sample.gs --pkg=gsl
```


## Nonlinear Least-Squares Fitting Sample
```genie
// vala-test:examples/gsl-least-squares-fitting.vala
[indent=4]
uses GLib
uses Gsl

// ss FitSample
struct Data
    n: size_t
    y: double*
    sigma: double*

def expb_f(x: Vector, data: void*, f: Vector): int
    var n = ((Data*)data)->n;
    var y = ((Data*)data)->y;
    var sigma = ((Data*)data)->sigma;
    var A = x.get(0)
    var lambda = x.get(1)
    var b = x.get(2)

    i: size_t = 0
    while i < n
        /* Model Yi = A * exp(-lambda * i) + b */
        var t = (double)i;
        var Yi = A * Math.exp (-lambda * t) + b;
        f.set (i, (Yi - y[i])/sigma[i]);
        i += 1
    return Status.SUCCESS;

def expb_df(x: Vector, data: void*, J: Matrix): int
    var n = ((Data*)data)->n
    var sigma = ((Data*)data)->sigma
    var A = x.get(0)
    var lambda = x.get(1)

    i: size_t = 0
    while i < n
        /* Jacobian matrix J(i,j) = dfi / dxj, */
        /* where fi = (Yi - yi)/sigma[i],        */
        /*         Yi = A * exp(-lambda * i) + b */
        /* and the xj are the parameters (A,lambda,b) */
        var t = i
        var s = sigma[i]
        var e = Math.exp(-lambda * t)
        J.set (i, 0, e/s);
        J.set (i, 1, -t * A * e/s);
        J.set (i, 2, 1/s);
        i += 1
    return Status.SUCCESS;

def expb_fdf(x: Vector, data: void*, f: Vector, J: Matrix): int
    expb_f (x, data, f);
    expb_df (x, data, J);
    return Status.SUCCESS;

def print_state(iter: size_t, s: MultifitFdfsolver)
    stdout.printf("iter: %3u x = % 15.8f % 15.8f % 15.8f\n",
                  (uint)iter, s.x.get(0), s.x.get(1), s.x.get(2))

init  // atic void main (string[] args)
    var status = 0;
    n: size_t = 40;
    p: size_t = 3;
    var covar = new Matrix(p, p)
    var y = new array of double[40]
    var sigma = new array of double[40]
    var d = Data() {n = n, y = y, sigma = sigma}
    var x_init = new array of double = {1.0, 0.0, 0.0}
    var x = VectorView.@array(x_init)
    RNG.env_setup ();
    var type = (RNGType*)RNGTypes.default;
    var r = new RNG (type);
    var f = MultifitFunctionFdf() {
        f=expb_f, df=expb_df, fdf=expb_fdf, n=n, p=p, @params=&d}

    i: uint = 0
    while i < n
        t: double = i
        y[i] = 1.0 + 5 * Math.exp (-0.1 * t) + Randist.gaussian (r, 0.1);
        sigma[i] = 0.1;
        stdout.printf ("data: %u %g %g\n", i, y[i], sigma[i]);
        i += 1

    var T = (MultifitFdfsolverType*)MultifitFdfsolverTypes.lmsder;
    var s = new MultifitFdfsolver(T, n, p)
    s.set (&f, (Vector)(&x.vector));

    iter: uint = 0
    print_state (iter, s);
    do
        iter++;
        status = s.iterate ();
        stdout.printf ("status = %s\n", Gsl.Error.strerror (status));
        print_state (iter, s);
        if (bool)status
            break;
        status = MultifitTest.delta (s.dx, s.x, 1.0e-4, 1.0e-4);
    while status == Status.CONTINUE && iter < 500;
    // TODO: can't build with error: gsl_multifit_fdfsolver `s` not have J.
    // Multifit.covar ((Matrix)(s.J), 0.0, covar);
    stdout.printf ("A      = %.5f\n", s.x.get (0));
    stdout.printf ("lambda = %.5f\n", s.x.get (1));
    stdout.printf ("b      = %.5f\n", s.x.get (2));
    stdout.printf ("status = %s\n", Gsl.Error.strerror (status));
```

```shell
$ valac sample.gs --pkg=gsl
```


Vala/Examples Projects/Vala/GSLSample
    (last edited 2013-11-22 16:48:25 by WilliamJonMcCann)
