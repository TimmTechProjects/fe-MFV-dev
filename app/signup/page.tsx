"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  UserPlus,
  User,
  Mail,
  Lock,
  AtSign,
} from "lucide-react";
import { toast } from "sonner";
import useAuth from "@/redux/hooks/useAuth";
import useAppInit from "@/redux/hooks/useInit";
import { cn } from "@/lib/utils";
import { LeafIcon } from "@/components/ui/botanical";

const signupSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name must be less than 50 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name must be less than 50 characters" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username must be less than 30 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignUp = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { getSignup, signInWithGoogle } = useAuth();
  const { __init } = useAppInit();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    getSignup(
      values,
      async () => {
        await __init();
        toast.success("Account created successfully!");
        router.push("/");
      },
      (error: { errors?: { field: string; message?: string }[]; message?: string }) => {
        if (error?.errors) {
          error.errors.forEach((err) => {
            const fieldName = err.field as keyof SignupFormValues;
            form.setError(fieldName, {
              message: err.message || "Invalid input",
            });
          });
          setErrorMessage("Please fix the highlighted fields below.");
        } else {
          setErrorMessage(
            error?.message || "Registration failed. Please try again."
          );
        }

        setIsLoading(false);
      }
    );
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setErrorMessage(null);
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google!");
      router.push("/");
    } catch {
      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const passwordValue = form.watch("password");
  const passwordChecks = {
    length: passwordValue?.length >= 8,
    uppercase: /[A-Z]/.test(passwordValue || ""),
    number: /[0-9]/.test(passwordValue || ""),
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-[480px] relative">
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
              <UserPlus className="w-7 h-7 text-emerald-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Create Your Account
            </h1>
            <p className="mt-2 text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
              Join Floral Vault and start your botanical journey
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
              className="space-y-4"
              noValidate
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-700 dark:text-zinc-300 text-sm font-medium">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                          <Input
                            placeholder="John"
                            autoComplete="given-name"
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
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-700 dark:text-zinc-300 text-sm font-medium">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                          <Input
                            placeholder="Doe"
                            autoComplete="family-name"
                            {...field}
                            className="botanical-input w-full pl-10 h-12 text-sm sm:text-base"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs flex items-center gap-1.5 mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 dark:text-zinc-300 text-sm font-medium">
                      Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        <Input
                          placeholder="Choose a unique username"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 dark:text-zinc-300 text-sm font-medium">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
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
                    <FormLabel className="text-zinc-700 dark:text-zinc-300 text-sm font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          autoComplete="new-password"
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
                    {passwordValue && passwordValue.length > 0 && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                        <span className={cn("text-xs flex items-center gap-1", passwordChecks.length ? "text-emerald-500" : "text-zinc-500")}>
                          <span className={cn("inline-block w-1.5 h-1.5 rounded-full", passwordChecks.length ? "bg-emerald-500" : "bg-zinc-600")} />
                          8+ characters
                        </span>
                        <span className={cn("text-xs flex items-center gap-1", passwordChecks.uppercase ? "text-emerald-500" : "text-zinc-500")}>
                          <span className={cn("inline-block w-1.5 h-1.5 rounded-full", passwordChecks.uppercase ? "bg-emerald-500" : "bg-zinc-600")} />
                          Uppercase
                        </span>
                        <span className={cn("text-xs flex items-center gap-1", passwordChecks.number ? "text-emerald-500" : "text-zinc-500")}>
                          <span className={cn("inline-block w-1.5 h-1.5 rounded-full", passwordChecks.number ? "bg-emerald-500" : "bg-zinc-600")} />
                          Number
                        </span>
                      </div>
                    )}
                    <FormMessage className="text-red-400 text-xs flex items-center gap-1.5 mt-1" />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "relative flex items-center justify-center gap-2 h-12 w-full rounded-xl font-semibold text-white transition-all duration-200 mt-2",
                  isLoading
                    ? "bg-zinc-700 cursor-not-allowed"
                    : "botanical-btn hover:scale-[1.01] active:scale-[0.99]"
                )}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Create Account"
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
            onClick={handleGoogleSignup}
            className={cn(
              "w-full flex items-center justify-center gap-3 h-12 rounded-xl text-sm font-medium transition-all duration-200",
              "border border-zinc-700/60 bg-zinc-800/50 text-zinc-200",
              "hover:bg-zinc-700/60 hover:border-zinc-600 active:scale-[0.99]",
              googleLoading && "cursor-not-allowed opacity-70"
            )}
            disabled={googleLoading}
            type="button"
            aria-busy={googleLoading}
          >
            {googleLoading ? (
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
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
