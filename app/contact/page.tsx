"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  MessageSquare,
  LifeBuoy,
  Bug,
  Lightbulb,
  CreditCard,
  User,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import type { TicketCategory, ContactFormInput } from "@/types/support";

const apiBase =
  process.env.NEXT_PUBLIC_FLORAL_VAULT_DEV_API_URL ||
  process.env.NEXT_PUBLIC_FLORAL_VAULT_API_URL ||
  "https://floral-vault-api.onrender.com";

const CATEGORY_OPTIONS: { value: TicketCategory; label: string; icon: typeof Bug }[] = [
  { value: "bug", label: "Bug Report", icon: Bug },
  { value: "feature", label: "Feature Request", icon: Lightbulb },
  { value: "account", label: "Account Issue", icon: User },
  { value: "payment", label: "Payment", icon: CreditCard },
  { value: "other", label: "Other", icon: HelpCircle },
];

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormInput>({
    name: "",
    email: "",
    subject: "",
    category: "other",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormInput, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormInput, string>> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email address";
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) newErrors.message = "Message is required";
    else if (form.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/api/support/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success("Message sent successfully!");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again later.");
    }
    setSubmitting(false);
  };

  const updateField = (field: keyof ContactFormInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
          Message Sent!
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm mb-6">
          Thank you for reaching out. Our team will review your message and get
          back to you as soon as possible.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setSubmitted(false);
              setForm({ name: "", email: "", subject: "", category: "other", message: "" });
            }}
            variant="outline"
            className="border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
          >
            Send Another
          </Button>
          <Link href="/">
            <Button className="bg-[#81a308] hover:bg-[#6c8a0a] text-white">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-[#81a308]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-emerald-600 dark:text-[#81a308]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Contact Us
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Have a question, feedback, or need help? Fill out the form below and
            our team will get back to you.
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Your name"
                className={`bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 ${
                  errors.name ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="you@example.com"
                className={`bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 ${
                  errors.email ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
              Subject <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.subject}
              onChange={(e) => updateField("subject", e.target.value)}
              placeholder="Brief description of your inquiry"
              className={`bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 ${
                errors.subject ? "border-red-500 dark:border-red-500" : ""
              }`}
            />
            {errors.subject && (
              <p className="text-xs text-red-500 mt-1">{errors.subject}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORY_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = form.category === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField("category", opt.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                      isSelected
                        ? "border-[#81a308] bg-[#81a308]/10 text-[#81a308]"
                        : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
              Message <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              placeholder="Tell us more about your question or issue..."
              rows={6}
              className={`bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 resize-none ${
                errors.message ? "border-red-500 dark:border-red-500" : ""
              }`}
            />
            {errors.message && (
              <p className="text-xs text-red-500 mt-1">{errors.message}</p>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-[#81a308] hover:bg-[#6c8a0a] text-white"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Send Message
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/support"
              className="text-[#81a308] hover:underline"
            >
              Visit the Support Center
            </Link>{" "}
            to track your tickets.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
            <MessageSquare className="w-5 h-5 text-[#81a308] mb-2" />
            <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-1">
              Quick Response
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              We typically respond within 24 hours
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
            <LifeBuoy className="w-5 h-5 text-[#81a308] mb-2" />
            <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-1">
              Expert Support
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Our team is here to help you
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
            <Mail className="w-5 h-5 text-[#81a308] mb-2" />
            <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-1">
              Track Your Request
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Sign up to track ticket progress
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
