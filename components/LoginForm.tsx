"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth from "@/redux/hooks/useAuth";
import useAppInit from "@/redux/hooks/useInit";
import { cn } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Lock,
  User,
} from "lucide-react";
import { LeafIcon } from "@/components/ui/botanical";

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username or email must be at least 3 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const SignInForm = () => {
  const { getLogin, signInWithGoogle } = useAuth();
  const { __init } = useAppInit();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from") || searchParams.get("redirect") || "/";
  const from = (() => {
    try {
      const url = new URL(fromParam, window.location.origin);
      if (url.origin !== window.location.origin) return "/";
      return fromParam;
    } catch {
      if (fromParam.startsWith("/")) return fromParam;
      return "/";
    }
  })();

  const [loading, setLoading] = useState(false);
  const [btnLoadings, setBtnLoadings] = useState({ google: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setErrorMessage(null);

    const isEmail = values.username.includes("@");
    const loginData = isEmail
      ? { email: values.username, password: values.password }
      : { username: values.username, password: values.password };

    getLogin(
      loginData,
      async () => {
        await __init();
        toast.success("Logged in successfully!");
        router.push(from);
      },
      (error: { message?: string }) => {
        const msg = error?.message || "Invalid credentials. Please check your username/email and password.";
        setErrorMessage(msg);
        setLoading(false);
      }
    );
  };

  const handleGoogleLogin = async () => {
    setBtnLoadings((prev) => ({ ...prev, google: true }));
    setErrorMessage(null);
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google!");
      router.push(from);
    } catch {
      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setBtnLoadings((prev) => ({ ...prev, google: false }));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-[440px] relative">
        <div className="absolute -top-6 -left-6 opacity-[0.04] pointer-events-none hidden sm:block">
          <LeafIcon className="w-24 h-24 text-emerald-500 rotate-[-30deg]" />
        </div>
        <div className="absolute -bottom-4 -right-4 opacity-[0.04] pointer-events-none hidden sm:block">
          <LeafIcon className="w-20 h-20 text-emerald-500 rotate-[150deg]" />
        </div>

        <div className="garden-card p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500/60 via-emerald-400/40 to-emerald-500/60" />

          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
              <Lock className="w-7 h-7 text-emerald-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
              Sign in to your Floral Vault account
            </p>
          </div>

          {errorMessage && (
            <div
              className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 flex items-start gap-3"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{errorMessage}</p>
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 dark:text-zinc-300 text-sm font-medium">
                      Username or Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        <Input
                          placeholder="Enter your username or email"
                          autoComplete="username"
                          {...field}
                          className="botanical-input w-full pl-10 h-12 text-sm sm:text-base"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs flex items-center gap-1.5 mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-zinc-700 dark:text-zinc-300 text-sm font-medium">
                        Password
                      </FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
                        tabIndex={-1}
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          {...field}
                          className="botanical-input w-full pl-10 pr-11 h-12 text-sm sm:text-base"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-0.5"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs flex items-center gap-1.5 mt-1" />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "relative flex items-center justify-center gap-2 h-12 w-full rounded-xl font-semibold text-white transition-all duration-200 mt-2",
                  loading
                    ? "bg-zinc-700 cursor-not-allowed"
                    : "botanical-btn hover:scale-[1.01] active:scale-[0.99]"
                )}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </Form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700/60" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="garden-card border-0 px-4 text-zinc-500 uppercase tracking-wider text-[11px] font-medium">
                or
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className={cn(
              "w-full flex items-center justify-center gap-3 h-12 rounded-xl text-sm font-medium transition-all duration-200",
              "border border-zinc-700/60 bg-zinc-800/50 text-zinc-200",
              "hover:bg-zinc-700/60 hover:border-zinc-600 active:scale-[0.99]",
              btnLoadings.google && "cursor-not-allowed opacity-70"
            )}
            disabled={btnLoadings.google}
            aria-busy={btnLoadings.google}
          >
            {btnLoadings.google ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <p className="mt-7 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
