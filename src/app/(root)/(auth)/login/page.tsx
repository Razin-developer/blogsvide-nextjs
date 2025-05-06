"use client";

import { useEffect, useTransition } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import AuthImagePattern from "@/components/auth/AuthImagePattern";
import Link from "next/link";
import loginSchema from "@/lib/zod/loginSchema";
import { z } from "zod";
import Form from "@/components/auth/Form";
import { Frame, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { login } from "@/actions/auth";
import { signIn, useSession } from "next-auth/react";

const LoginPage = () => {
  const router = useRouter();
  const { checkAuth, setAuthUser } = useAuthStore();
  const [pending, startTransition] = useTransition()
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/"); // Redirect logged-in users
    }
  }, [status, router]);

  const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      const res = await login(data);

      if (res?.ok) {
        const checkAuthRes = await checkAuth();
        if (checkAuthRes?.ok) {
          toast.success("Logged in successfully");
        } else {
          toast.error("Login Failed");
        }
        router.push("/");
      } else {
        setAuthUser(null);
        toast.error(res?.error);
      }
    })
  };

  useEffect(() => {
    scrollTo(0, 0)
  }, [])

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 mt-10">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <Frame className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          <Form
            buttonName="Log In"
            defaultValues={{
              email: "",
              password: "",
            }}
            fields={[
              {
                name: "email",
                text: "Email",
                placeholder: "you@example.com",
                icon: <Mail className="h-5 w-5 text-base-content/40" />,
                type: "email",
              },
              {
                name: "password",
                text: "Password",
                placeholder: "••••••••",
                icon: <Lock className="h-5 w-5 text-base-content/40" />,
                type: "password",
              },
            ]}
            handleSubmit={handleSubmit}
            zodSchema={loginSchema}
            loadingState={pending}
          />

          {/* Form
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-base-content/40" />
                          </div>
                          <Input
                            {...field}
                            placeholder="you@example.com"
                            type="email"
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-base-content/40" />
                          </div>
                          <Input
                            {...field}
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            className="pl-10"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-base-content/40" />
                            ) : (
                              <Eye className="h-5 w-5 text-base-content/40" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <button type="submit" className="bg-primary hover:bg-primary-focus h-10 rounded-lg text-white w-full" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Log in"
                )}
              </button>
            </form>

          </Form> */}

          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
            <p className="text-base-content/60">
              Forgot your password?{" "}
              <Link href="/forgot" className="link link-primary">
                Forgot password
              </Link>
            </p>
          </div>
          <form action={async () => {
            await signIn("google", { callbackUrl: "/" });
          }}>
            <button type="submit" className="bg-primary h-12 w-full dark:bg-gray-200 border hover:text-gray-300 shadow-md flex items-center justify-center gap-2 rounded-lg text-sm font-medium text-gray-200 dark:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </svg>
              <span>Continue with Google</span>
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Log in to continue with our features and services."}
      />
    </div >
  );
};
export default LoginPage;
