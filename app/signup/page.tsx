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
import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/lib/utils";
import { toast } from "sonner";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters long")
    .max(30, "Username can not be more than 30 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const SignUp = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const { setUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);

    const result = await registerUser(values);

    // Check if user already exists in userData with email or username
    if (!result || result.error || !result.user || !result.token) {
      setIsLoading(false);

      if (Array.isArray(result?.errors)) {
        result.errors.forEach((err) => {
          form.setError(err.field as keyof z.infer<typeof signupSchema>, {
            message: err.message || "Invalid input",
          });
        });
        toast.error("Please fix highlighted fields", {
          description: "Username or email might already be in use.",
        });
      } else {
        toast.error(result?.error || "Registration failed. Please try again.");
      }
      return;
    }

    const { user, token } = result;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // save user data to local storage and to db then redirect to home page
    setIsLoading(false);
    setUser(user);

    router.push("/");
  };

  return (
    <div className="flex h-[80vh] pt-5 items-center justify-center">
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="w-full items-center text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Welcome to Floral Vault
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Your personal vault for all your floral needs. Sign up to get started.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="my-8 space-y-6"
          >
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="Tyler" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Durden" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" type="text" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="flex gap-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="youremail@email.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
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
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
            >
              {isLoading ? "Creating account..." : `Sign up →`}
            </Button>

            <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

            <div className="flex flex-col space-y-4">
              <OAuthButton icon={<IconBrandGithub />} label="GitHub" />
              <OAuthButton icon={<IconBrandGoogle />} label="Google" />
            </div>
          </form>
        </Form>

        <div className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#81a308] hover:underline"
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
    className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
    type="button"
  >
    {icon}
    <span className="text-sm text-neutral-700 dark:text-neutral-300">
      {label}
    </span>
    <BottomGradient />
  </button>
);

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

export default SignUp;
