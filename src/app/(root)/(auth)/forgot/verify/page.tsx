"use client";

import AuthImagePattern from "@/components/auth/AuthImagePattern";
import { Loader2, Frame } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

// Mock function for verifying the code (replace with actual implementation or import)
import Link from "next/link";
import { forgot, verifyForgot } from "@/actions/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

function ForgotVerifyPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { forgotEmail } = useAuthStore();
  const router = useRouter();
  const [pending, startTransition] = useTransition()
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/"); // Redirect logged-in users
    }
  }, [status, router]);

  const handleChange = (index: number, value: string) => {
    const newCode = [...code];

    if (value.length === 6) {
      const pastedCode = value.slice(0, 6).split("");
      setCode(pastedCode);
      inputRefs.current[5]?.focus();
    } else {
      newCode[index] = value.slice(-1);
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    startTransition(async () => {

      e.preventDefault();
      const verificationCode = code.join("");
      const res = await verifyForgot(Number(verificationCode));

      if (res.ok) {
        router.push("/reset");
      } else {
        toast.error(res.error);
      }
    })
  }, [code, router]);

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit({ preventDefault: () => { } } as React.FormEvent);
    }
  }, [code, handleSubmit]);

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <div className="h-screen grid lg:grid-cols-2 bg-white text-gray-800">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center transition-colors">
                <Frame className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Did you forget your password?</h1>
              <p className="text-sm text-gray-600">Enter your code to reset your password</p>
            </div>
          </div>

          <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Verification Code</label>
              <div className="flex gap-4 justify-around">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-2xl font-bold bg-gray-200 text-black border-2 border-gray-400 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md text-white font-semibold transition ${pending ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              disabled={pending}
            >
              {pending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify Code"
              )}
            </button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              <button
                onClick={async () => {
                  setCode(["", "", "", "", "", ""]);

                  await forgot({ email: forgotEmail });
                }}
                className="text-blue-600 hover:underline font-medium"
              >
                Resend Code
              </button>
            </p>
            <p className="text-sm text-gray-600">
              <Link href="/forgot" className="text-blue-600 hover:underline font-medium">
                Go Back
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image or Pattern */}
      <AuthImagePattern
        title="Check your mailbox!"
        subtitle="Enter the code in the mail to get back into your account."
      />
    </div>
  );
}

export default ForgotVerifyPage;
