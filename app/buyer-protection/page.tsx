import React from "react";
import Link from "next/link";

const BuyerProtection = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
      <h1 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Buyer Protection Program</h1>
      <p className="text-zinc-500 dark:text-zinc-400">Last updated: February 11, 2026</p>

      <p className="mt-4">
        FloraVault is committed to ensuring a safe and reliable shopping
        experience on our marketplace. Our Buyer Protection Program safeguards
        your purchases so you can shop with confidence knowing that your
        transactions are protected.
      </p>

      <h2 className="mt-8 font-semibold text-lg">1. Eligibility</h2>
      <p className="mt-2">
        All purchases made through the FloraVault marketplace are automatically
        covered by the Buyer Protection Program, provided that:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1">
        <li>The transaction was completed entirely on the FloraVault platform</li>
        <li>Payment was made through FloraVault&apos;s approved payment methods</li>
        <li>The buyer has an account in good standing</li>
        <li>The dispute is filed within 30 days of the expected delivery date</li>
      </ul>

      <h2 className="mt-8 font-semibold text-lg">2. What Is Covered</h2>
      <p className="mt-2">
        The Buyer Protection Program covers the following situations:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1">
        <li>
          <strong>Item not received:</strong> Your order does not arrive within
          the estimated delivery window and the seller cannot provide proof of
          delivery
        </li>
        <li>
          <strong>Item not as described:</strong> The item you receive is
          significantly different from the listing description, photos, or
          stated condition
        </li>
        <li>
          <strong>Damaged in transit:</strong> The item arrives damaged due to
          inadequate packaging or shipping mishandling
        </li>
        <li>
          <strong>Wrong item received:</strong> You receive a completely
          different item than what was ordered
        </li>
        <li>
          <strong>Counterfeit or misrepresented items:</strong> The item is
          counterfeit or the species/variety was intentionally misrepresented
        </li>
      </ul>

      <h2 className="mt-8 font-semibold text-lg">3. What Is Not Covered</h2>
      <p className="mt-2">
        The following situations are not eligible for buyer protection:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1">
        <li>Transactions conducted outside the FloraVault platform</li>
        <li>Disputes filed more than 30 days after expected delivery</li>
        <li>Items that match the listing description but the buyer changed their mind</li>
        <li>Normal plant stress or adjustment periods after shipping</li>
        <li>Minor variations in color, size, or appearance typical of live plants</li>
        <li>Items damaged due to buyer negligence after delivery</li>
        <li>Purchases where the buyer provided an incorrect shipping address</li>
      </ul>

      <h2 className="mt-8 font-semibold text-lg">4. Dispute Resolution Process</h2>
      <p className="mt-2">
        If you have an issue with a purchase, follow these steps:
      </p>
      <ol className="list-decimal ml-6 mt-2 space-y-2">
        <li>
          <strong>Contact the seller:</strong> Reach out to the seller directly
          through FloraVault messaging. Many issues can be resolved through
          direct communication. Allow 48 hours for a response.
        </li>
        <li>
          <strong>Open a dispute:</strong> If you cannot resolve the issue with
          the seller, open a formal dispute through your order details page.
          Include a detailed description of the problem and supporting evidence
          such as photos.
        </li>
        <li>
          <strong>Evidence review:</strong> Our team will review all submitted
          evidence from both parties, including listing details, communications,
          photos, and tracking information.
        </li>
        <li>
          <strong>Mediation:</strong> FloraVault may facilitate a mediation
          between the buyer and seller to find a mutually acceptable resolution
          such as a partial refund or replacement.
        </li>
        <li>
          <strong>Final decision:</strong> If mediation does not resolve the
          dispute, FloraVault will issue a binding decision within 10 business
          days based on all available evidence.
        </li>
        <li>
          <strong>Appeal:</strong> Either party may appeal the decision within 7
          days by providing new evidence not previously considered.
        </li>
      </ol>

      <h2 className="mt-8 font-semibold text-lg">5. Refund Policy</h2>
      <p className="mt-2">
        If a dispute is resolved in the buyer&apos;s favor, the following refund
        options may apply:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1">
        <li>
          <strong>Full refund:</strong> The complete purchase price including
          shipping costs is returned to the original payment method
        </li>
        <li>
          <strong>Partial refund:</strong> A portion of the purchase price is
          refunded when the item is received but does not fully match the
          description
        </li>
        <li>
          <strong>Replacement:</strong> The seller sends a replacement item at
          no additional cost to the buyer
        </li>
        <li>
          <strong>FloraVault credit:</strong> In certain cases, credit may be
          issued to the buyer&apos;s FloraVault account
        </li>
      </ul>
      <p className="mt-2">
        Refunds are typically processed within 5-10 business days after a
        decision is made.
      </p>

      <h2 className="mt-8 font-semibold text-lg">6. Fraud Protection</h2>
      <p className="mt-2">
        FloraVault employs multiple layers of fraud protection to keep buyers
        safe:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1">
        <li>Seller verification and review systems</li>
        <li>Secure payment processing through trusted providers</li>
        <li>Automated detection of fraudulent listings</li>
        <li>Seller performance monitoring and rating systems</li>
        <li>Immediate suspension of accounts engaged in fraudulent activity</li>
      </ul>

      <h2 className="mt-8 font-semibold text-lg">7. Buyer Best Practices</h2>
      <p className="mt-2">
        To ensure the best shopping experience and maximize your protection:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1">
        <li>Read listing descriptions and photos carefully before purchasing</li>
        <li>Check seller ratings and reviews before buying</li>
        <li>Keep all communication within FloraVault messaging</li>
        <li>Photograph items immediately upon delivery, especially live plants</li>
        <li>Report any issues as soon as possible</li>
        <li>Never complete transactions outside the FloraVault platform</li>
        <li>Verify your shipping address is correct before placing an order</li>
      </ul>

      <h2 className="mt-8 font-semibold text-lg">8. Live Plant Guarantee</h2>
      <p className="mt-2">
        We understand that live plants require special care during shipping.
        FloraVault offers additional protections for live plant purchases:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1">
        <li>
          Plants that arrive dead or severely damaged are eligible for a full
          refund or replacement
        </li>
        <li>
          Buyers must photograph and report dead-on-arrival plants within 24
          hours of delivery
        </li>
        <li>
          Sellers are encouraged to include heat packs, cold packs, or
          insulation as appropriate for weather conditions
        </li>
        <li>
          Buyers should be aware of weather advisories and may request a
          shipping delay if extreme temperatures are forecast
        </li>
      </ul>

      <h2 className="mt-8 font-semibold text-lg">9. Reporting Issues</h2>
      <p className="mt-2">
        If you need help with a purchase, you can:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1">
        <li>Open a dispute from your order history page</li>
        <li>Contact our support team at support@floravault.com</li>
        <li>Report suspicious listings or seller behavior</li>
      </ul>

      <h2 className="mt-8 font-semibold text-lg">10. Policy Updates</h2>
      <p className="mt-2">
        FloraVault reserves the right to modify this Buyer Protection Program at
        any time. Buyers will be notified of significant changes via email.
        Continued use of the marketplace after changes constitutes acceptance of
        the updated policy.
      </p>

      <div className="mt-8 p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
        <p className="text-xs text-zinc-500">
          See also:{" "}
          <Link href="/seller-protection" className="underline hover:text-[#81a308]">
            Seller Protection Program
          </Link>
          {" | "}
          <Link href="/terms" className="underline hover:text-zinc-300">
            Terms of Service
          </Link>
          {" | "}
          <Link href="/privacy" className="underline hover:text-zinc-300">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default BuyerProtection;
