Projects/Vala/GSLSample - GNOME Wiki!
<!--
var search_hint = "Search";
//-->
Projects/Vala/GSLSampleHomeRecentChangesScheduleLogin
Contents
GNU Scientific Library - Vala Samples
Statistics Sample
Special Functions Sample
Combination Sample
Linear Algebra Sample
Eigen System Sample
Random Number Generation Sample
Integration Sample
Monte Carlo Integration Sample
Multidimensional Root-Finding Sample
Nonlinear Least-Squares Fitting Sample 
GNU Scientific Library - Vala Samples
These samples are found in the reference manual of GSL and were rewritten for vala.  Compile all the examples with: $ valac sample.vala --pkg gsl
Statistics Sample
vala-test:examples/gsl-stats.vala using GLib;
using Gsl;
public class Test : GLib.Object
{
        public static void main (string[] args)
        {
                double mean, max, min;
                double[] data = new double[] { 17.2, 18.1, 16.5, 18.3, 12.6 };
                mean = Stats.mean (data, 1, data.length);
                Stats.minmax (out min, out max, data, 1, data.length);
                stdout.printf("promedio %g\n", mean);
                stdout.printf("minimo %g\n", min);
                stdout.printf("maximo %g\n", max);
        }
}
Special Functions Sample
vala-test:examples/gsl-function.vala using GLib;
using Gsl;
public class Test : GLib.Object
{
        public static void main (string[] args)
        {
                double x = 5.0;
                Result res;
                double expected = -0.17759677131433830434739701;
                Bessel.J0_e (x, out res);
                stdout.printf("J0(5.0) = %.18f\n+/- %.18f\n", res.val, res.err);
                stdout.printf("exact   = %.18f\n", expected);
        }
}
Combination Sample
vala-test:examples/gsl-combination.vala using GLib;
using Gsl;
public class Test : GLib.Object
{
        public static void main (string[] args)
        {
                Combination c;
                size_t i;
                stdout.printf("All subsets of {0,1,2,3} by size:\n");
                for (i=0; i<=4; i++)
                {
                        c = new Combination.with_zeros (4, i);
                        do
                        {
                                stdout.printf ("{");
                                Combination.fprintf (stdout, c, " %u");
                                stdout.printf (" }\n");
                        } while (c.next() == Status.SUCCESS);
                }
        }
}
Linear Algebra Sample
vala-test:examples/gsl-linear-algebra.vala using GLib;
using Gsl;
public class Test : GLib.Object
{
        public static void main (string[] args)
        {
                double[] a_data = new double[] { 0.18, 0.60, 0.57, 0.96,
                                                                                 0.41, 0.24, 0.99, 0.58,
                                                                                 0.14, 0.30, 0.97, 0.66,
                                                                                 0.51, 0.13, 0.19, 0.85 };
                double[] b_data = new double[] { 1.0, 2.0, 3.0, 4.0 };
                MatrixView m = MatrixView.array (a_data, 4, 4);
                VectorView b = VectorView.array (b_data);
                Vector x = new Vector (4);
                int s;
                Permutation p = new Permutation (4);
                LinAlg.LU_decomp ((Matrix)(&amp;m.matrix), p, out s);
                LinAlg.LU_solve ((Matrix)(&amp;m.matrix), p, (Vector)(&amp;b.vector), x);
                stdout.printf("x = \n");
                Vector.fprintf(stdout, x, "%g");
        }
}
Eigen System Sample
vala-test:examples/gsl-eigen-system.vala using GLib;
using Gsl;
public class Test : GLib.Object
{
        public static void main (string[] args)
        {
                double[] data = new double[] { 1.0  , 1/2.0, 1/3.0, 1/4.0,
                                                                           1/2.0, 1/3.0, 1/4.0, 1/5.0,
                                                                           1/3.0, 1/4.0, 1/5.0, 1/6.0,
                                                                           1/4.0, 1/5.0, 1/6.0, 1/7.0 };
                MatrixView m = MatrixView.array (data, 4, 4);
                Vector eval = new Vector (4);
                Matrix evec = new Matrix (4, 4);
                EigenSymmvWorkspace w = new EigenSymmvWorkspace (4);
                w.init ((Matrix)(&amp;m.matrix), eval, evec);
                EigenSort.symmv_sort (eval, evec, EigenSortType.ABS_ASC);
                for (int i=0; i<4; i++)
                {
                        double eval_i = eval.get (i);
                        VectorView evec_i = evec.column (i);
                        stdout.printf("eigenvalue = %g\n", eval_i);
                        stdout.printf("eigenvector = \n");
                        Vector.fprintf(stdout, (Vector)(&amp;evec_i.vector), "%g");
                }
        }
}
Random Number Generation Sample
vala-test:examples/gsl-random.vala using GLib;
using Gsl;
public class RNGSample : GLib.Object
{
        public static void main (string[] args)
        {
                RNGType* T;
                RNG r;
                int i, n=10;
                RNG.env_setup ();
                T = (RNGType*)RNGTypes.default;
                r = new RNG (T);
                for (i=0; i<n; i++)
                {
                        double u = r.uniform ();
                        stdout.printf ("%d %.5f\n", i, u);
                }
        }
}
Integration Sample
vala-test:examples/gsl-integration.vala using GLib;
using Gsl;
public class IntegrationSample : GLib.Object
{
        public static double f (double x, double* params)
        {
                double alpha = *params;
                double f = Math.log (alpha*x) / Math.sqrt(x);
                return f;
        }
        public static void main (string[] args)
        {
                IntegrationWorkspace w = new IntegrationWorkspace (1000);
                double integration_result, error;
                double expected = -4.0;
                double alpha = 1.0;
                Function F = Function () { function = f, params = &amp;alpha };
                Integration.qags (&amp;F, 0, 1, 0, 1e-7, 1000, w, out integration_result, out error);
                stdout.printf ("result          = %.18f\n", integration_result);
                stdout.printf ("exact result    = %.18f\n", expected);
                stdout.printf ("extimated error = %.18f\n", error);
                stdout.printf ("actual error    = %.18f\n", integration_result - expected);
                stdout.printf ("intervals = %i\n", (int)w.size);
        }
}
Monte Carlo Integration Sample
vala-test:examples/gsl-monte-carlo-integration.vala using GLib;
using Gsl;
public class MonteSample : GLib.Object
{
        static double exact = 1.3932039296856768591842462603255;
        static double g (double* k, size_t dim, void* params)
        {
                double A = 1.0 / (Math.PI * Math.PI * Math.PI);
                return A / (1.0 - Math.cos(k[0]) * Math.cos(k[1]) * Math.cos(k[2]));
        }
        static void display_results (string title, double result, double error)
        {
                stdout.printf ("%s ==================\n", title);
                stdout.printf ("result = % .6f\n", result);
                stdout.printf ("sigma  = % .6f\n", error);
                stdout.printf ("exact  = % .6f\n", exact);
                stdout.printf ("error  = % .6f = %.1g sigma\n", result - exact, Math.fabs (result-exact)/error);
        }
        public static void main (string[] args)
        {
                double res, err;
                double[] xl = new double[] { 0, 0, 0 };
                double[] xu = new double[] { Math.PI, Math.PI, Math.PI };
                RNGType* T;
                RNG r;
                MonteFunction G = { g, 3, null};
                size_t calls = 500000;
                RNG.env_setup ();
                T = (RNGType*)RNGTypes.default;
                r = new RNG (T);
                {
                        MontePlainState s = new MontePlainState (3);
                        MontePlainState.integrate (&amp;G, xl, xu, 3, calls, r, s, out res, out err);
                        display_results ("plain", res, err);
                }
                {
                        MonteMiserState s = new MonteMiserState (3);
                        MonteMiserState.integrate (&amp;G, xl, xu, 3, calls, r, s, out res, out err);
                        display_results ("miser", res, err);
                }
                {
                        MonteVegasState s = new MonteVegasState (3);
                        MonteVegasState.integrate (&amp;G, xl, xu, 3, 10000, r, s, out res, out err);
                        display_results ("vegas warm_up", res, err);
                        stdout.printf ("converging...\n");
                        do
                        {
                                MonteVegasState.integrate (&amp;G, xl, xu, 3, calls/5, r, s, out res, out err);
                                stdout.printf ("result = % .6f sigma = % .6f chisq/dof = %.1f\n", res, err, s.chisq);
                        } while (Math.fabs (s.chisq - 1.0) > 0.5 );
                        display_results ("vegas final", res, err);
                }
        }
}
Multidimensional Root-Finding Sample
vala-test:examples/gsl-multidimensional.vala using GLib;
using Gsl;
public class MultiRootSample : GLib.Object
{
        struct RParams
        {
                public double a;
                public double b;
        }
        static int rosenbrock_f (Vector x, void* params, Vector f)
        {
                double a = ((RParams*)params)->a;
                double b = ((RParams*)params)->b;
                double x0 = x.get (0);
                double x1 = x.get (1);
                double y0 = a*(1-x0);
                double y1 = b*(x1-x0*x0);
                f.set (0, y0);
                f.set (1, y1);
                return Status.SUCCESS;
        }
        static int rosenbrock_df (Vector x, void* params, Matrix J)
        {
                double a = ((RParams*)params)->a;
                double b = ((RParams*)params)->b;
                double x0 = x.get (0);
                //double x1 = x.get (1);
                double df00 = -a;
                double df01 = 0;
                double df10 = -2*b*x0;
                double df11 = b;
                J.set (0, 0, df00);
                J.set (0, 1, df01);
                J.set (1, 0, df10);
                J.set (1, 1, df11);
                return Status.SUCCESS;
        }
        static int rosenbrock_fdf (Vector x, void* params, Vector f, Matrix J)
        {
                rosenbrock_f (x, params, f);
                rosenbrock_df (x, params, J);
                return Status.SUCCESS;
        }
        static void print_state (size_t iter, MultirootFdfsolver s)
        {
                stdout.printf ("iter = %3u x = % .3f % .3f f(x) = % .3e % .3e\n", (uint)iter, s.x.get (0), s.x.get (1), s.f.get (0), s.f.get (1));
        }
        public static void main (string[] args)
        {
                MultirootFdfsolverType* T;
                MultirootFdfsolver s;
                int status = 0;
                size_t iter=0;
                size_t n = 2;
                RParams p = { 1.0, 10.0 };
                MultirootFunctionFdf f = MultirootFunctionFdf () { f = rosenbrock_f, df = rosenbrock_df, fdf = rosenbrock_fdf, n = n, params = &amp;p };
                double[] x_init = new double[] { -10.0, -5.0 };
                Vector x = new Vector (n);
                x.set (0, x_init[0]);
                x.set (1, x_init[1]);
                T = (MultirootFdfsolverType*)MultirootFdfsolverTypes.gnewton;
                s = new MultirootFdfsolver (T, n);
                s.set (&amp;f, x);
                print_state (iter, s);
                do
                {
                        iter++;
                        status = s.iterate ();
                        print_state (iter, s);
                        if ((bool)status)
                                break;
                        status = MultirootTest.residual (s.f, 1.0e-7);
                } while (status==Status.CONTINUE &amp;&amp; iter < 1000);
        }
}
Nonlinear Least-Squares Fitting Sample
vala-test:examples/gsl-least-squares-fitting.vala using GLib;
using Gsl;
public class FitSample
{
        struct Data
        {
                public size_t n;
                public double* y;
                public double* sigma;
        }
        static int expb_f (Vector x, void* data, Vector f)
        {
                size_t n = ((Data*)data)->n;
                double* y = ((Data*)data)->y;
                double* sigma = ((Data*)data)->sigma;
                double A = x.get (0);
                double lambda = x.get (1);
                double b = x.get (2);
                size_t i;
                for (i = 0; i < n; i++)
                {
                        /* Model Yi = A * exp(-lambda * i) + b */
                        double t = i;
                        double Yi = A * Math.exp (-lambda * t) + b;
                        f.set (i, (Yi - y[i])/sigma[i]);
                }
                return Status.SUCCESS;
        }
        static int expb_df (Vector x, void* data, Matrix J)
        {
                size_t n = ((Data*)data)->n;
                double* sigma = ((Data*)data)->sigma;
                double A = x.get (0);
                double lambda = x.get (1);
                size_t i;
                for (i = 0; i < n; i++)
                {
                        /* Jacobian matrix J(i,j) = dfi / dxj, */
                        /* where fi = (Yi - yi)/sigma[i],        */
                        /*         Yi = A * exp(-lambda * i) + b */
                        /* and the xj are the parameters (A,lambda,b) */
                        double t = i;
                        double s = sigma[i];
                        double e = Math.exp(-lambda * t);
                        J.set (i, 0, e/s);
                        J.set (i, 1, -t * A * e/s);
                        J.set (i, 2, 1/s);
                }
                return Status.SUCCESS;
        }
        static int expb_fdf (Vector x, void* data, Vector f, Matrix J)
        {
                expb_f (x, data, f);
                expb_df (x, data, J);
                return Status.SUCCESS;
        }
        static void print_state (size_t iter, MultifitFdfsolver s)
        {
                stdout.printf ("iter: %3u x = % 15.8f % 15.8f % 15.8f\n", (uint)iter, s.x.get (0), s.x.get (1), s.x.get (2));
        }
        public static void main (string[] args)
        {
                MultifitFdfsolverType* T;
                MultifitFdfsolver s;
                int status = 0;
                uint i, iter = 0;
                size_t n = 40;
                size_t p = 3;
                Matrix covar = new Matrix (p, p);
                double[] y = new double[40];
                double[] sigma = new double[40];
                Data d = Data () { n = n, y = y, sigma = sigma};
                double[] x_init = new double[] { 1.0, 0.0, 0.0 };
                VectorView x = VectorView.array (x_init);
                RNGType* type;
                RNG r;
                RNG.env_setup ();
                type = (RNGType*)RNGTypes.default;
                r = new RNG (type);
                MultifitFunctionFdf f = MultifitFunctionFdf () { f = expb_f, df = expb_df, fdf = expb_fdf, n = n, p = p, params = &amp;d };
                for (i = 0; i < n; i++)
                {
                        double t = i;
                        y[i] = 1.0 + 5 * Math.exp (-0.1 * t) + Randist.gaussian (r, 0.1);
                        sigma[i] = 0.1;
                        stdout.printf ("data: %u %g %g\n", i, y[i], sigma[i]);
                }
                T = (MultifitFdfsolverType*)MultifitFdfsolverTypes.lmsder;
                s = new MultifitFdfsolver (T, n, p);
                s.set (&amp;f, (Vector)(&amp;x.vector));
                print_state (iter, s);
                do
                {
                        iter++;
                        status = s.iterate ();
                        stdout.printf ("status = %s\n", Gsl.Error.strerror (status));
                        print_state (iter, s);
                        if ((bool)status)
                                break;
                        status = MultifitTest.delta (s.dx, s.x, 1e-4, 1e-4);
                } while (status == Status.CONTINUE &amp;&amp; iter < 500);
                Multifit.covar ((Matrix)(s.J), 0.0, covar);
                stdout.printf ("A      = %.5f\n", s.x.get (0));
                stdout.printf ("lambda = %.5f\n", s.x.get (1));
                stdout.printf ("b      = %.5f\n", s.x.get (2));
                stdout.printf ("status = %s\n", Gsl.Error.strerror (status));
        }
}
 Vala/Examples Projects/Vala/GSLSample  (last edited 2013-11-22 16:48:25 by WilliamJonMcCann)
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
