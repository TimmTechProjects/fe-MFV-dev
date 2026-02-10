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
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
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
                      <Input placeholder="Tyler" {...field} className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#81a308]/50 focus-visible:ring-[#81a308]/30 rounded-xl h-11" />
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
                      <Input placeholder="Durden" {...field} className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#81a308]/50 focus-visible:ring-[#81a308]/30 rounded-xl h-11" />
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
                    <Input placeholder="username" type="text" {...field} className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#81a308]/50 focus-visible:ring-[#81a308]/30 rounded-xl h-11" />
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
                        placeholder="youremail@email.com"
                        type="email"
                        {...field}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#81a308]/50 focus-visible:ring-[#81a308]/30 rounded-xl h-11"
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
                          placeholder="••••••••"
                          {...field}
                          className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#81a308]/50 focus-visible:ring-[#81a308]/30 rounded-xl h-11 pr-10"
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
              <OAuthButton icon={<IconBrandGoogle className="w-5 h-5" />} label="Google" />
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
