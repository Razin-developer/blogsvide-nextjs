"use client";

import { Lock, Mail, Frame } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { useEffect, useTransition } from "react"
import AuthImagePattern from "@/components/auth/AuthImagePattern"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import Form from "@/components/auth/Form";
import { resetSchema } from "@/lib/zod/resetSchema";
import { z } from "zod";
import { reset } from "@/actions/auth";
import { useSession } from "next-auth/react";

function ResetPage() {
  const { authUser, forgotEmail } = useAuthStore()
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/"); // Redirect logged-in users
    }
  }, [status, router]);

  async function handleSubmit(data: z.infer<typeof resetSchema>) {
    startTransition(async () => {
      if (data.password !== data.confirm) {
        toast.error("Passwords do not match")
        return
      }

      try {
        await reset(data)
        router.push("/login")
      } catch (error) {
        if (error instanceof Error) {
          toast.error('Error in reset. try again')
        }
      }
    })
  }

  useEffect(() => {
    scrollTo(0, 0)
  }, [])

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
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
              <h1 className="text-2xl font-bold mt-2">Reset your password</h1>
              <p className="text-base-content/60">enter a new password for your account</p>
            </div>
          </div>

          <Form
            buttonName="Reset Password"
            defaultValues={{ email: authUser?.email || forgotEmail || "", password: "", confirm: "" }}
            handleSubmit={handleSubmit}
            loadingState={pending}
            zodSchema={resetSchema}
            key={"reset"}
            fields={[
              {
                name: "email",
                text: "Email",
                type: "email",
                placeholder: "Enter your email",
                icon: <Mail className="h-5 w-5 text-base-content/40" />,
              },
              {
                name: "password",
                text: "Password",
                type: "password",
                placeholder: "Enter your password",
                icon: <Lock className="h-5 w-5 text-base-content/40" />,
              },
              {
                name: "confirm",
                type: "password",
                placeholder: "Confirm your password",
                icon: <Lock className="h-5 w-5 text-base-content/40" />,
                text: "Confirm Password",
              },
            ]}
          />

          {/* Form */}
          {/* <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  readOnly={true}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            </div>


            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Confirm Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.confirm}
                  onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>


            <button type="submit" className="btn btn-primary w-full" disabled={isResettingPassword}>
              {isResettingPassword ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form> */}
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Reset Password!"}
        subtitle={"Reset password of your account in EntreFlow."}
      />
    </div>
  )
}

export default ResetPage
