"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import useAuth from "@/redux/hooks/useAuth";

const membershipTiers = [
  {
    name: "Free",
    price: {
      monthly: "$0/mo",
      yearly: "$0/yr",
    },
    description: "Basic access for hobbyists & casual users.",
    benefits: [
      "Save up to 25 plants",
      "Access public collections",
      "Marketplace access",
      "Community comments",
    ],
    plan: "free",
  },
  {
    name: "Premium",
    price: {
      monthly: "$2.99/mo",
      yearly: "$0.99/yr",
    },
    description: "Unlimited access for serious enthusiasts & sellers.",
    benefits: [
      "Save unlimited plants",
      "Sell on marketplace",
      "Private your collections",
      "Custom profile",
      "All listings are featured",
      "Discounted listing fee",
      "Unlock video thumbnails",
    ],
    plan: "premium",
  },
];

const MembershipPage = () => {
  const { user, CreateCheckoutSession, ManageSubscription } = useAuth();
  const [isYearly, setIsYearly] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const currentPlan = user?.subscriptionTier ?? user?.plan ?? "free";

  const handleUpgrade = async (plan: string) => {
    if (plan === "free") return;
    setIsCheckoutLoading(true);
    try {
      const res = await CreateCheckoutSession({
        priceInterval: isYearly ? "year" : "month",
      });
      if (res?.url) {
        window.location.href = res.url;
      } else {
        toast.error("Could not start checkout. Please try again.");
      }
    } catch {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleCancelMembership = async () => {
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 text-white">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
        Membership Plans
      </h1>
      <p className="text-gray-400 text-center mb-8 max-w-lg mx-auto">
        Choose the plan that fits your botanical journey
      </p>

      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-3">
          <span
            className={!isYearly ? "font-bold text-[#81a308]" : "text-gray-400"}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-12 h-6 flex items-center rounded-full p-1 transition ${
              isYearly ? "bg-[#81a308]" : "bg-gray-600"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                isYearly ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span
            className={isYearly ? "font-bold text-[#81a308]" : "text-gray-400"}
          >
            Yearly
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
        {membershipTiers.map((tier) => (
          <Card
            key={tier.plan}
            className={`border ${
              tier.plan === "premium"
                ? "border-[#81a308] shadow-lg shadow-[#81a308]/10"
                : currentPlan === tier.plan
                ? "border-[#81a308]/50"
                : "border-gray-700"
            } bg-[#1f1f1f] flex flex-col justify-between relative`}
          >
            {tier.plan === "premium" && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#81a308] text-white text-xs font-medium rounded-full">
                Recommended
              </div>
            )}
            <CardHeader className="pt-6">
              <CardTitle className="text-2xl text-center">
                {tier.name}
              </CardTitle>
              <p className="text-center text-lg text-gray-300 mt-2">
                {isYearly ? tier.price.yearly : tier.price.monthly}
              </p>
              {isYearly && tier.plan === "premium" && (
                <p className="text-center text-xs text-[#81a308] mt-1">
                  Save 72% vs monthly
                </p>
              )}
              <p className="text-center text-sm text-gray-400 mt-2">
                {tier.description}
              </p>
            </CardHeader>
            <CardContent>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                {tier.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#81a308] font-bold">&#10003;</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex justify-center">
                {currentPlan === tier.plan ? (
                  <Button
                    disabled
                    className="bg-gray-600 cursor-default rounded-xl px-6 py-2 w-full"
                  >
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className={`rounded-xl px-6 py-2 w-full ${
                      tier.plan === "premium"
                        ? "bg-[#81a308] hover:bg-[#6c8a0a] text-white"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                    onClick={() => handleUpgrade(tier.plan)}
                    disabled={isCheckoutLoading}
                  >
                    {isCheckoutLoading && tier.plan === "premium" ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirecting...
                      </span>
                    ) : tier.plan === "free" ? "Downgrade" : "Upgrade"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {currentPlan !== "free" && (
        <div className="mt-12 text-center border border-gray-700 rounded-2xl p-6 max-w-2xl mx-auto bg-[#1f1f1f]">
          <h2 className="text-2xl font-semibold mb-4">Manage Subscription</h2>
          <p className="text-gray-300 mb-6">
            You are currently subscribed to the{" "}
            <span className="text-[#81a308] font-semibold">{currentPlan}</span>{" "}
            plan. You can cancel your subscription anytime.
          </p>
          <Button
            variant="destructive"
            className="rounded-xl px-6 py-2 bg-red-600 hover:bg-red-700 text-white"
            onClick={handleCancelMembership}
            disabled={isPortalLoading}
          >
            {isPortalLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </span>
            ) : "Manage Subscription"}
          </Button>
        </div>
      )}

      <div className="mt-10 text-center text-gray-400 text-sm">
        Need help? Contact{" "}
        <a
          href="/contact"
          className="text-[#81a308] hover:underline font-medium"
        >
          support
        </a>
        .
      </div>
    </div>
  );
};

export default MembershipPage;
