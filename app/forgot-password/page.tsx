"use client";

import React, { useState } from "react";
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
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LeafIcon } from "@/components/ui/botanical";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (_values: ForgotPasswordValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setSubmitted(true);
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

          {submitted ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                Check Your Email
              </h1>
              <p className="mt-3 text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                If an account exists with that email, we&apos;ll send password
                reset instructions shortly.
              </p>
              <Link
                href="/login"
                className={cn(
                  "inline-flex items-center justify-center gap-2 h-12 w-full rounded-xl font-semibold text-white transition-all duration-200 mt-8",
                  "botanical-btn hover:scale-[1.01] active:scale-[0.99]"
                )}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                  <Mail className="w-7 h-7 text-emerald-500" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  Forgot Password?
                </h1>
                <p className="mt-2 text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
                  Enter your email and we&apos;ll send you reset instructions
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                  noValidate
                >
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

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      "relative flex items-center justify-center gap-2 h-12 w-full rounded-xl font-semibold text-white transition-all duration-200",
                      isLoading
                        ? "bg-zinc-700 cursor-not-allowed"
                        : "botanical-btn hover:scale-[1.01] active:scale-[0.99]"
                    )}
                    aria-busy={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      "Send Reset Instructions"
                    )}
                  </button>
                </form>
              </Form>

              <p className="mt-7 text-center text-sm text-zinc-500 dark:text-zinc-400">
                <Link
                  href="/login"
                  className="font-semibold text-emerald-500 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
