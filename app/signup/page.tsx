"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import useAuth from "@/redux/hooks/useAuth";
import useAppInit from "@/redux/hooks/useInit";

const SignUp = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { getSignup } = useAuth();
  const { __init } = useAppInit();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);

    getSignup(
      values,
      async () => {
        await __init();
        toast.success("Account created successfully!");
        router.push("/");
      },
      (error: any) => {
        console.error("Signup Error:", error);

        if (error?.errors) {
          error.errors.forEach((err: any) => {
            form.setError(err.field, {
              message: err.message || "Invalid input",
            });
          });
          toast.error("Please fix highlighted fields", {
            description: "Username or email might already be in use.",
          });
        } else {
          toast.error(
            error?.message || "Registration failed. Please try again."
          );
        }

        setIsLoading(false);
      }
    );
  };

  return (
    <div className="flex min-h-[80vh] pt-5 items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 md:p-8 shadow-xl shadow-black/20">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#81a308]/15 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#81a308]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-zinc-100">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Join Floral Vault and start your botanical journey
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-zinc-300 text-sm">First name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-zinc-800 border-zinc-700 text-white focus:border-[#81a308]/50 focus-visible:ring-[#81a308]/30 rounded-xl h-11" />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-zinc-300 text-sm">Last name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-zinc-800 border-zinc-700 text-white focus:border-[#81a308]/50 focus-visible:ring-[#81a308]/30 rounded-xl h-11" />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300 text-sm">Username</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} className="bg-zinc-800 border-zinc-700 text-white focus:border-[#81a308]/50 focus-visible:ring-[#81a308]/30 rounded-xl h-11" />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-zinc-300 text-sm">Email Address</FormLabel>
                    <FormControl>
                                            <Input
                                              type="email"
                                              {...field}
                                              className="bg-zinc-800 border-zinc-700 text-white focus:border-[#81a308]/50 focus-visible:ring-[#81a308]/30 rounded-xl h-11"
                                            />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-zinc-300 text-sm">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                                                <Input
                                                  type={showPassword ? "text" : "password"}
                                                  {...field}
                                                  className="bg-zinc-800 border-zinc-700 text-white focus:border-[#81a308]/50 focus-visible:ring-[#81a308]/30 rounded-xl h-11 pr-10"
                                                />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`relative block h-11 w-full rounded-xl font-medium text-white transition-all duration-200 mt-2 ${
                isLoading
                  ? "bg-zinc-600 cursor-not-allowed"
                  : "bg-[#81a308] hover:bg-[#6c8a0a] active:bg-[#5a7508] hover:shadow-lg hover:shadow-[#81a308]/20 hover:scale-[1.01] active:scale-[0.99]"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-zinc-900 px-3 text-zinc-500">or continue with</span>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <OAuthButton icon={<IconBrandGithub className="w-5 h-5" />} label="GitHub" />
              <OAuthButton icon={<svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>} label="Sign in with Google" />
            </div>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#81a308] hover:text-[#9bc20a] transition-colors"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

const OAuthButton = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm font-medium hover:bg-zinc-700 hover:border-zinc-600 transition-all duration-200"
    type="button"
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default SignUp;
