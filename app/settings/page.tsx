"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const settingsSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

const SettingsPage = () => {
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to access this page.");
      setTimeout(() => {
        router.push(
          `/login?unauthorized=true&redirect=${encodeURIComponent(pathname)}`
        );
      }, 100);
    }
  }, [user, router, pathname]);

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      bio: user?.bio || "",
      avatarUrl: user?.avatarUrl || "",
    },
  });

  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    if (!user?.username || !user?.id || !user?.joinedAt) {
      console.error("Missing critical user fields.");
      return;
    }

    setIsLoading(true);

    const updatedUser = {
      ...user,
      ...values,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    // Optional: Show toast or redirect
    if (!values.email.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }

    toast.success("Your settings have been saved!");
    setIsLoading(false);
  };

  if (!user) {
    return null;
  }

  return (
    // Protected route, only accessible to logged-in users

    <div className="min-h-screen px-4 py-10 md:px-12 bg-gradient-to-r from-[#3A3A38] to-[#151512] text-white">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SettingsPage;
