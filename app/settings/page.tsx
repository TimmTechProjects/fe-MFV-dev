"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useAuth from "@/redux/hooks/useAuth";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { useUploadThing } from "@/lib/uploadthingClient";
import {
  Camera,
  Lock,
  User,
  Crown,
  Loader2,
  Check,
  Leaf,
  Shield,
  CreditCard,
  ExternalLink,
  AtSign,
  X,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { checkUsernameAvailability } from "@/lib/utils";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  bio: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const SettingsPage = () => {
  const {
    user,
    EditProfile,
    ChangePassword,
    ChangeUsername,
    CreateCheckoutSession,
    ManageSubscription,
  } = useAuth();
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid" | "same"
  >("idle");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isUsernameSaving, setIsUsernameSaving] = useState(false);
  const [showUsernameConfirm, setShowUsernameConfirm] = useState(false);
  const usernameCheckTimer = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const { startUpload } = useUploadThing("imageUploader");

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

  useEffect(() => {
    if (user?.avatarUrl) {
      setAvatarPreview(user.avatarUrl);
    }
  }, [user?.avatarUrl]);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      bio: user?.bio || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onAvatarDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setAvatarPreview(URL.createObjectURL(file));
      setIsUploadingAvatar(true);

      try {
        const uploadResult = await startUpload([file]);
        if (uploadResult && uploadResult[0]) {
          const newUrl = uploadResult[0].ufsUrl || uploadResult[0].url;
          setAvatarPreview(newUrl);
          const res = await EditProfile({ avatarUrl: newUrl });
          if (res) {
            toast.success("Avatar updated!");
          } else {
            toast.error("Failed to save avatar.");
          }
        }
      } catch {
        toast.error("Avatar upload failed.");
        setAvatarPreview(user?.avatarUrl || null);
      } finally {
        setIsUploadingAvatar(false);
      }
    },
    [startUpload, EditProfile, user?.avatarUrl]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onAvatarDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple: false,
    maxSize: 4 * 1024 * 1024,
  });

  const validateUsernameFormat = (username: string): string | null => {
    if (!username) return null;
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 30) return "Username must be at most 30 characters";
    if (!/^[a-zA-Z]/.test(username)) return "Username must start with a letter";
    if (!/^[a-zA-Z0-9_-]+$/.test(username))
      return "Only letters, numbers, underscores, and hyphens allowed";
    return null;
  };

  const handleUsernameChange = (value: string) => {
    const trimmed = value.trim();
    setNewUsername(trimmed);

    if (usernameCheckTimer.current) {
      clearTimeout(usernameCheckTimer.current);
    }

    if (!trimmed) {
      setUsernameStatus("idle");
      setUsernameMessage("");
      return;
    }

    if (trimmed.toLowerCase() === user?.username?.toLowerCase()) {
      setUsernameStatus("same");
      setUsernameMessage("This is your current username");
      return;
    }

    const formatError = validateUsernameFormat(trimmed);
    if (formatError) {
      setUsernameStatus("invalid");
      setUsernameMessage(formatError);
      return;
    }

    setUsernameStatus("checking");
    setUsernameMessage("Checking availability...");

    usernameCheckTimer.current = setTimeout(async () => {
      const result = await checkUsernameAvailability(trimmed);
      if (result.available) {
        setUsernameStatus("available");
        setUsernameMessage(result.message || "Username is available");
      } else {
        setUsernameStatus("taken");
        setUsernameMessage(result.message || "Username is not available");
      }
    }, 500);
  };

  const getUsernameCooldownDaysLeft = (): number | null => {
    if (!user?.usernameLastChangedAt) return null;
    const lastChanged = new Date(user.usernameLastChangedAt);
    const now = new Date();
    const diffMs = now.getTime() - lastChanged.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays >= 30) return null;
    return 30 - diffDays;
  };

  const cooldownDaysLeft = getUsernameCooldownDaysLeft();
  const isOnCooldown = cooldownDaysLeft !== null;

  const onUsernameSubmit = async () => {
    if (usernameStatus !== "available" || !newUsername || isOnCooldown) return;
    setShowUsernameConfirm(true);
  };

  const confirmUsernameChange = async () => {
    setShowUsernameConfirm(false);
    setIsUsernameSaving(true);
    try {
      const res = await ChangeUsername(newUsername);
      if (res) {
        toast.success("Username changed successfully!");
        setNewUsername("");
        setUsernameStatus("idle");
        setUsernameMessage("");
        router.push(`/profiles/${newUsername}`);
      } else {
        toast.error("Failed to change username. Please try again.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsUsernameSaving(false);
    }
  };

  const onProfileSubmit = async (values: ProfileFormValues) => {
    setIsProfileSaving(true);
    try {
      const res = await EditProfile(values);
      if (res) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsProfileSaving(false);
    }
  };

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setIsPasswordSaving(true);
    try {
      const res = await ChangePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      if (res) {
        toast.success("Password changed successfully!");
        passwordForm.reset();
      } else {
        toast.error("Failed to change password. Check your current password.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const handleUpgrade = async (interval: "month" | "year") => {
    setIsCheckoutLoading(true);
    try {
      const res = await CreateCheckoutSession({
        priceInterval: interval,
      });
      if (res?.url) {
        window.location.href = res.url;
      } else {
        toast.error("Could not start checkout. Please try again.");
      }
    } catch {
      toast.error("Checkout failed.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsPortalLoading(true);
    try {
      const res = await ManageSubscription();
      if (res?.url) {
        window.location.href = res.url;
      } else {
        toast.error("Could not open subscription portal.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsPortalLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const currentTier = user.subscriptionTier || "free";
  const isPremium = currentTier === "premium";
  const isGoogleUser =
    user.authProvider === "google" ||
    (user.avatarUrl?.includes("googleusercontent.com") ?? false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="botanical-pattern leaf-pattern">
        <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-50">
                Account Settings
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                Manage your profile, security, and subscription
              </p>
            </div>
          </div>

          <section className="garden-card p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg font-semibold text-zinc-100">Profile</h2>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div
                {...getRootProps()}
                className={`relative w-28 h-28 rounded-full cursor-pointer group transition-all ${
                  isDragActive
                    ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-zinc-900"
                    : "hover:ring-2 hover:ring-emerald-500/50 hover:ring-offset-2 hover:ring-offset-zinc-900"
                }`}
              >
                <input {...getInputProps()} />
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Avatar"
                    width={112}
                    height={112}
                    className="w-28 h-28 rounded-full object-cover border-2 border-zinc-700 group-hover:border-emerald-500/50 transition-colors"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                    <User className="w-10 h-10 text-zinc-500" />
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {isUploadingAvatar ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
              <p className="text-xs text-zinc-500">
                Click or drag to update avatar
              </p>
            </div>

            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="space-y-5"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <FormField
                    control={profileForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-zinc-300">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="botanical-input border-zinc-700 focus:border-emerald-500/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-zinc-300">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="botanical-input border-zinc-700 focus:border-emerald-500/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          disabled={isGoogleUser}
                          className="botanical-input border-zinc-700 focus:border-emerald-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </FormControl>
                      {isGoogleUser && (
                        <p className="text-xs text-zinc-500">
                          Email is managed by your Google account
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          placeholder="Tell us about yourself and your garden..."
                          className="botanical-input border-zinc-700 focus:border-emerald-500/50 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isProfileSaving}
                  className="w-full botanical-btn text-white font-semibold py-2.5"
                >
                  {isProfileSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </Form>
          </section>

          <section className="garden-card p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <AtSign className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg font-semibold text-zinc-100">
                Change Username
              </h2>
            </div>

            <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
              <p className="text-sm text-zinc-400 mb-1">
                Current username
              </p>
              <p className="text-zinc-100 font-medium">@{user.username}</p>
            </div>

            {isOnCooldown ? (
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <p className="text-sm font-medium text-amber-300">
                    Username change unavailable
                  </p>
                </div>
                <p className="text-sm text-zinc-400">
                  You can only change your username once every 30 days. You can
                  change it again in{" "}
                  <span className="text-amber-300 font-medium">
                    {cooldownDaysLeft} {cooldownDaysLeft === 1 ? "day" : "days"}
                  </span>
                  .
                </p>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/30">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <p className="text-xs text-zinc-400">
                      You can only change your username once every 30 days.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-zinc-300">
                    New Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500 select-none">
                      @
                    </span>
                    <Input
                      value={newUsername}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      placeholder="Enter new username"
                      className="botanical-input border-zinc-700 focus:border-emerald-500/50 pl-8 pr-10"
                      maxLength={30}
                    />
                    {usernameStatus === "checking" && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 animate-spin" />
                    )}
                    {usernameStatus === "available" && (
                      <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                    )}
                    {(usernameStatus === "taken" || usernameStatus === "invalid") && (
                      <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                    )}
                    {usernameStatus === "same" && (
                      <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  {usernameMessage && (
                    <p
                      className={`text-xs ${
                        usernameStatus === "available"
                          ? "text-emerald-400"
                          : usernameStatus === "checking"
                            ? "text-zinc-400"
                            : usernameStatus === "same"
                              ? "text-amber-400"
                              : "text-red-400"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <p className="text-xs text-zinc-500">
                    3-30 characters. Letters, numbers, underscores, and hyphens
                    only. Must start with a letter.
                  </p>
                </div>

                <Button
                  onClick={onUsernameSubmit}
                  disabled={
                    isUsernameSaving ||
                    usernameStatus !== "available" ||
                    !newUsername
                  }
                  className="w-full botanical-btn text-white font-semibold py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUsernameSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Change Username"
                  )}
                </Button>
              </>
            )}

            {showUsernameConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="w-full max-w-md mx-4 p-6 rounded-2xl bg-zinc-900 border border-zinc-700 shadow-xl space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-semibold text-zinc-100">
                      Confirm Username Change
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-zinc-300">
                      Are you sure you want to change your username?
                    </p>
                    <div className="p-3 rounded-lg bg-zinc-800/80 border border-zinc-700/50 space-y-1">
                      <p className="text-xs text-zinc-400">
                        Current:{" "}
                        <span className="text-zinc-200">@{user.username}</span>
                      </p>
                      <p className="text-xs text-zinc-400">
                        New:{" "}
                        <span className="text-emerald-400">@{newUsername}</span>
                      </p>
                    </div>
                    <p className="text-xs text-amber-400">
                      You will not be able to change your username again for 30
                      days.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowUsernameConfirm(false)}
                      className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={confirmUsernameChange}
                      disabled={isUsernameSaving}
                      className="flex-1 botanical-btn text-white font-semibold"
                    >
                      {isUsernameSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Changing...
                        </>
                      ) : (
                        "Confirm Change"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="garden-card p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg font-semibold text-zinc-100">Security</h2>
            </div>

            {isGoogleUser ? (
              <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
                <p className="text-sm text-zinc-400">
                  You signed in with Google. Your password and email are managed
                  through your Google account. You can update your name, bio,
                  and avatar here.
                </p>
              </div>
            ) : (
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">
                          Current Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <Input
                              type="password"
                              {...field}
                              className="botanical-input border-zinc-700 focus:border-emerald-500/50 pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col md:flex-row gap-4">
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-zinc-300">
                            New Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              className="botanical-input border-zinc-700 focus:border-emerald-500/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-zinc-300">
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              className="botanical-input border-zinc-700 focus:border-emerald-500/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isPasswordSaving}
                    className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-2.5"
                  >
                    {isPasswordSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </section>

          <section className="garden-card p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg font-semibold text-zinc-100">
                Subscription
              </h2>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
              <div
                className={`p-2 rounded-lg ${
                  isPremium
                    ? "bg-amber-500/10 border border-amber-500/20"
                    : "bg-zinc-700/50 border border-zinc-600/50"
                }`}
              >
                {isPremium ? (
                  <Crown className="w-5 h-5 text-amber-400" />
                ) : (
                  <Leaf className="w-5 h-5 text-zinc-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-zinc-100">
                  {isPremium ? "Premium" : "Free"} Plan
                </p>
                <p className="text-sm text-zinc-400">
                  {isPremium
                    ? user.subscriptionEndsAt
                      ? `Renews ${new Date(user.subscriptionEndsAt).toLocaleDateString()}`
                      : "Active subscription"
                    : "Basic features included"}
                </p>
              </div>
              {isPremium && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active
                </span>
              )}
            </div>

            {isPremium ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <h3 className="font-medium text-emerald-300 mb-2">
                    Premium Benefits
                  </h3>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      Unlimited plant saves
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      Sell on marketplace
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      Private collections
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      Custom profile features
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={handleManageSubscription}
                  disabled={isPortalLoading}
                  className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-2.5"
                >
                  {isPortalLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Manage Subscription
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 via-zinc-800/50 to-amber-500/5 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <h3 className="font-semibold text-zinc-100">
                      Upgrade to Premium
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-400 mb-4">
                    Unlock unlimited plant saves, marketplace selling, private
                    collections, and more.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleUpgrade("month")}
                      disabled={isCheckoutLoading}
                      className="p-4 rounded-xl bg-zinc-800/80 border border-zinc-700 hover:border-emerald-500/40 transition-all text-center group"
                    >
                      <p className="text-2xl font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                        $2.99
                      </p>
                      <p className="text-xs text-zinc-400">per month</p>
                    </button>
                    <button
                      onClick={() => handleUpgrade("year")}
                      disabled={isCheckoutLoading}
                      className="p-4 rounded-xl bg-zinc-800/80 border border-emerald-500/30 hover:border-emerald-500/50 transition-all text-center relative group"
                    >
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-white">
                        SAVE 72%
                      </span>
                      <p className="text-2xl font-bold text-emerald-300 group-hover:text-emerald-200 transition-colors">
                        $0.99
                      </p>
                      <p className="text-xs text-zinc-400">per year</p>
                    </button>
                  </div>
                </div>

                {isCheckoutLoading && (
                  <div className="flex items-center justify-center gap-2 text-sm text-zinc-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Redirecting to checkout...
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
