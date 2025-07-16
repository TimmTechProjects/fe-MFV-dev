"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { cn, loginUser } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  username: z.string().min(2).max(30),
  password: z.string().min(8),
});

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (searchParams.get("unauthorized") === "true") {
      toast.error("Please login to access that page.");
    }
  }, [searchParams]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const user = await loginUser(values);

    if (!user) {
      setIsLoading(false);
      form.setError("username", {
        type: "manual",
        message: "Invalid username or password",
      });
      return;
    }

    toast.success(`Welcome back, ${user.firstName || user.username}!`);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);

    const redirect = searchParams.get("redirect") || "/";
    router.push(redirect);
  };

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Welcome Back
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Login to access your Floral Vault account and manage your plant
          journey.
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
                    <Input placeholder="username" {...field} />
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
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 font-semibold" />
                </FormItem>
              )}
            />

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "group/btn relative block h-10 w-full rounded-md font-medium text-white transition",
                isLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-br from-black to-neutral-600 hover:scale-[1.01]"
              )}
            >
              {isLoading ? "Logging in..." : "Login →"}
            </button>
          </form>
        </Form>

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

export default LoginForm;
