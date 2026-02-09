"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAuth from "@/redux/hooks/useAuth";
import { Check, X, ChevronDown, ChevronUp, Leaf, Crown } from "lucide-react";

const membershipTiers = [
  {
    name: "Free",
    icon: <Leaf className="w-6 h-6" />,
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for casual plant enthusiasts getting started.",
    benefits: [
      "Save up to 25 plants",
      "Access public collections",
      "Browse marketplace",
      "Community comments",
    ],
    plan: "free",
    popular: false,
  },
  {
    name: "Premium",
    icon: <Crown className="w-6 h-6" />,
    price: { monthly: 5, yearly: 50 },
    description: "Unlimited access for serious collectors & sellers.",
    benefits: [
      "Unlimited plant storage",
      "Sell on marketplace",
      "Private collections",
      "Custom profile",
      "All listings featured",
      "Discounted listing fee",
      "Video thumbnails",
      "Priority support",
    ],
    plan: "premium",
    popular: true,
  },
];

const comparisonFeatures = [
  { feature: "Plant storage", free: "25 plants", premium: "Unlimited" },
  { feature: "Public collections", free: true, premium: true },
  { feature: "Marketplace browsing", free: true, premium: true },
  { feature: "Community comments", free: true, premium: true },
  { feature: "Sell on marketplace", free: false, premium: true },
  { feature: "Private collections", free: false, premium: true },
  { feature: "Custom profile", free: false, premium: true },
  { feature: "Featured listings", free: false, premium: true },
  { feature: "Discounted listing fee", free: false, premium: true },
  { feature: "Video thumbnails", free: false, premium: true },
  { feature: "Priority support", free: false, premium: true },
];

const faqs = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, debit cards, and PayPal through our secure payment processor.",
  },
  {
    q: "Is there a free trial for Premium?",
    a: "New users get a 14-day free trial of Premium features. No credit card required to start.",
  },
  {
    q: "What happens to my plants if I downgrade?",
    a: "Your plants remain safe. If you exceed the Free tier limit, your collections become read-only until you reduce below 25 plants or upgrade again.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Absolutely. Cancel anytime from your account settings. You'll retain access until the end of your billing period.",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Plant Collector",
    text: "Premium transformed how I manage my 200+ plant collection. The private collections feature is a game-changer.",
    avatar: "S",
  },
  {
    name: "Marcus T.",
    role: "Marketplace Seller",
    text: "Featured listings doubled my marketplace sales in the first month. Worth every penny.",
    avatar: "M",
  },
  {
    name: "Lily R.",
    role: "Hobbyist",
    text: "Started with Free and loved it so much I upgraded. The community here is amazing!",
    avatar: "L",
  },
];

const MembershipPage = () => {
  const { user } = useAuth();
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentPlan = user?.plan ?? "free";

  const handleUpgrade = (plan: string) => {
    console.log(`Upgrade to ${plan} clicked`);
  };

  const handleCancelMembership = () => {
    console.log("Cancel membership clicked");
  };

  const formatPrice = (amount: number) => {
    if (amount === 0) return "$0";
    return `$${amount}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/10" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-400 text-sm font-medium mb-6 border border-purple-500/20">
            Choose Your Plan
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Grow Your Collection,{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Your Way</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            From casual hobbyist to professional seller, we have a plan that fits your botanical journey.
          </p>

          <div className="inline-flex items-center gap-3 bg-gray-900/80 backdrop-blur rounded-full p-1.5 border border-gray-800">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                !isYearly
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                isYearly
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="ml-1.5 text-xs opacity-80">Save $10</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {membershipTiers.map((tier) => (
            <Card
              key={tier.plan}
              className={`relative border bg-[#1f1f1f] flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] ${
                tier.popular
                  ? "border-purple-500 shadow-lg shadow-purple-500/20 scale-[1.02]"
                  : currentPlan === tier.plan
                  ? "border-purple-500/50"
                  : "border-gray-800 hover:border-gray-600"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Best Value
                  </span>
                </div>
              )}
              <CardHeader className="text-center pt-8">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-4 ${
                  tier.popular
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400"
                    : "bg-gray-800 text-gray-400"
                }`}>
                  {tier.icon}
                </div>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold">
                    {formatPrice(isYearly ? tier.price.yearly : tier.price.monthly)}
                  </span>
                  <span className="text-gray-400 text-sm ml-1">
                    /{isYearly ? "yr" : "mo"}
                  </span>
                </div>
                {isYearly && tier.price.yearly > 0 && (
                  <p className="text-xs text-purple-400 mt-2">
                    Save ${tier.price.monthly * 12 - tier.price.yearly}/year
                  </p>
                )}
                <p className="text-sm text-gray-400 mt-4">{tier.description}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 text-sm text-gray-300 flex-1">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${tier.popular ? "text-purple-400" : "text-green-400"}`} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  {currentPlan === tier.plan ? (
                    <Button
                      disabled
                      className="w-full bg-gray-700 cursor-default rounded-full py-3 h-12"
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className={`w-full rounded-full py-3 h-12 transition-all font-semibold ${
                        tier.popular
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                          : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                      }`}
                      onClick={() => handleUpgrade(tier.plan)}
                    >
                      {tier.plan === "free" ? "Downgrade" : "Upgrade Now"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Feature</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium">Free</th>
                  <th className="text-center py-4 px-4 text-purple-400 font-medium">Premium</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, i) => (
                  <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors">
                    <td className="py-3.5 px-4 text-sm text-gray-300">{row.feature}</td>
                    {(["free", "premium"] as const).map((plan) => {
                      const val = row[plan];
                      return (
                        <td key={plan} className="text-center py-3.5 px-4">
                          {typeof val === "boolean" ? (
                            val ? (
                              <Check className={`w-5 h-5 mx-auto ${plan === "premium" ? "text-purple-400" : "text-green-400"}`} />
                            ) : (
                              <X className="w-5 h-5 text-gray-600 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-gray-300">{val}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            What Our Members Say
          </h2>
          <p className="text-gray-400 text-center mb-10 max-w-lg mx-auto">
            Join thousands of plant enthusiasts who upgraded their experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-[#1f1f1f] border border-gray-800 rounded-2xl p-6 hover:border-purple-500/30 transition-colors"
              >
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-medium text-gray-200 pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {currentPlan !== "free" && (
          <div className="mt-16 text-center border border-gray-800 rounded-2xl p-8 max-w-2xl mx-auto bg-[#1f1f1f]">
            <h2 className="text-2xl font-semibold mb-4">Manage Subscription</h2>
            <p className="text-gray-300 mb-6">
              You are currently subscribed to the{" "}
              <span className="text-purple-400 font-semibold">{currentPlan}</span>{" "}
              plan. You can cancel your subscription anytime.
            </p>
            <Button
              variant="destructive"
              className="rounded-full px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleCancelMembership}
            >
              Cancel Membership
            </Button>
          </div>
        )}

        <div className="mt-12 text-center text-gray-500 text-sm">
          Need help? Contact{" "}
          <a
            href="/contact"
            className="text-purple-400 hover:underline font-medium"
          >
            support
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;
