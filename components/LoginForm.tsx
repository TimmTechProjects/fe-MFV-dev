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
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import useAuth from "@/redux/hooks/useAuth";
import useAppInit from "@/redux/hooks/useInit";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const SignInForm = () => {
  const { getLogin, signInWithGoogle } = useAuth();
  const { __init } = useAppInit();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const { user } = useSelector((state: any) => state.auth);

  const [loading, setLoading] = useState(false);
  const [btnLoadings, setBtnLoadings] = useState({ google: false });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    getLogin(
      values,
      async () => {
        await __init();
        toast.success("Logged in successfully!");
        router.push(from);
      },
      (error: any) => {
        console.error("Login Error:", error);
        toast.error("Invalid credentials");
        setLoading(false);
      }
    );
  };

  const handleGoogleLogin = async () => {
    setBtnLoadings((prev) => ({ ...prev, google: true }));
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google!");
      router.push(from);
    } catch (err) {
      toast.error("Google sign-in failed");
    } finally {
      setBtnLoadings((prev) => ({ ...prev, google: false }));
    }
  };

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Sign In
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Login to continue managing your dashboard.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="my-8 space-y-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="yourusername" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500 font-semibold" />
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
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500 font-semibold" />
                </FormItem>
              )}
            />

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "group/btn relative block h-10 w-full rounded-md font-medium text-white transition",
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-br from-black to-neutral-600 hover:scale-[1.01]"
              )}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
        </Form>

        <button
          onClick={handleGoogleLogin}
          className="mt-2 w-full rounded-md border px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
          disabled={btnLoadings.google}
        >
          {btnLoadings.google
            ? "Signing in with Google..."
            : "Sign in with Google"}
        </button>

        <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-[#81a308] hover:underline"
          >
            Create one here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
