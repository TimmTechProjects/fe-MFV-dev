import React from "react";
import Link from "next/link";

const SellerProtection = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold mb-4">Seller Protection Program</h1>
      <p>Last updated: February 11, 2026</p>

      <p className="mt-4">
        FloraVault is committed to creating a safe and trustworthy marketplace
        for sellers. Our Seller Protection Program is designed to help protect
        you against fraudulent transactions, unfair disputes, and unauthorized
        claims so you can sell with confidence.
      </p>

      <h2 className="mt-8 font-semibold text-lg">1. Eligibility</h2>
      <p className="mt-2">
        All sellers with an active FloraVault Premium account in good standing
        are automatically enrolled in the Seller Protection Program. To remain
        eligible, sellers must:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1">
        <li>Maintain accurate and honest listing descriptions</li>
        <li>Ship items within the stated handling time</li>
        <li>Provide valid tracking information for all shipments</li>
        <li>Respond to buyer inquiries within 48 hours</li>
        <li>Comply with all FloraVault marketplace policies</li>
      </ul>

      <h2 className="mt-8 font-semibold text-lg">2. What Is Covered</h2>
      <p className="mt-2">
        The Seller Protection Program covers the following scenarios:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1">
        <li>
          <strong>Unauthorized claims:</strong> A buyer claims they did not
          authorize a purchase
        </li>
        <li>
          <strong>Item not received claims:</strong> A buyer claims they did not
          receive an item that tracking confirms was delivered
        </li>
        <li>
          <strong>Fraudulent returns:</strong> A buyer returns a different item
          or an empty package
        </li>
        <li>
          <strong>Chargeback protection:</strong> A buyer initiates a chargeback
          through their payment provider after receiving the item
        </li>
        <li>
          <strong>False damage claims:</strong> A buyer falsely claims an item
          arrived damaged when evidence shows otherwise
        </li>
      </ul>

      <h2 className="mt-8 font-semibold text-lg">3. What Is Not Covered</h2>
      <p className="mt-2">
        The following situations are not eligible for seller protection:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1">
        <li>Items shipped without valid tracking information</li>
        <li>Listings with inaccurate or misleading descriptions</li>
        <li>Transactions conducted outside the FloraVault platform</li>
        <li>Items that arrive significantly different from the listing</li>
        <li>Sellers with a history of policy violations</li>
        <li>Digital goods or services</li>
      </ul>

      <h2 className="mt-8 font-semibold text-lg">4. Dispute Resolution Process</h2>
      <p className="mt-2">
        When a buyer opens a dispute, the following process is followed:
      </p>
      <ol className="list-decimal ml-6 mt-2 space-y-2">
        <li>
          <strong>Notification:</strong> You will receive an immediate
          notification when a dispute is opened. You have 5 business days to
          respond with supporting evidence.
        </li>
        <li>
          <strong>Evidence Review:</strong> Our team reviews all evidence from
          both parties, including tracking information, photos, messages, and
          transaction records.
        </li>
        <li>
          <strong>Mediation:</strong> If the dispute cannot be resolved through
          evidence alone, FloraVault may facilitate communication between both
          parties to reach a resolution.
        </li>
        <li>
          <strong>Decision:</strong> FloraVault will issue a final decision
          within 10 business days of receiving all evidence. Decisions are based
          on the preponderance of evidence.
        </li>
        <li>
          <strong>Appeal:</strong> Either party may appeal the decision within 7
          days by providing new evidence not previously considered.
        </li>
      </ol>

      <h2 className="mt-8 font-semibold text-lg">5. Fraud Protection</h2>
      <p className="mt-2">
        FloraVault actively monitors the marketplace for fraudulent activity.
        Our fraud prevention measures include:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1">
        <li>Automated detection of suspicious buyer behavior</li>
        <li>Buyer account verification requirements</li>
        <li>Payment hold periods for new or flagged accounts</li>
        <li>Pattern analysis to identify serial dispute abusers</li>
        <li>Permanent bans for confirmed fraudulent accounts</li>
      </ul>

      <h2 className="mt-8 font-semibold text-lg">6. Refund and Payment Protection</h2>
      <p className="mt-2">
        If a dispute is resolved in the seller&apos;s favor:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1">
        <li>The full transaction amount will be released to the seller</li>
        <li>Any held funds will be returned within 3-5 business days</li>
        <li>Chargeback fees incurred will be reimbursed</li>
        <li>The dispute will not negatively affect the seller&apos;s account standing</li>
      </ul>

      <h2 className="mt-8 font-semibold text-lg">7. Seller Best Practices</h2>
      <p className="mt-2">
        To maximize your protection, we recommend:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1">
        <li>Always use tracked and insured shipping methods</li>
        <li>Photograph items before shipping as proof of condition</li>
        <li>Keep all communication within the FloraVault messaging system</li>
        <li>Provide clear and accurate descriptions with multiple photos</li>
        <li>Document any special packaging for fragile or live plants</li>
        <li>Respond promptly to buyer questions and concerns</li>
      </ul>

      <h2 className="mt-8 font-semibold text-lg">8. Reporting Issues</h2>
      <p className="mt-2">
        If you encounter a problem with a transaction, you can:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1">
        <li>Open a dispute from your order management dashboard</li>
        <li>Contact our support team at support@floravault.com</li>
        <li>Report suspicious buyer activity through the listing page</li>
      </ul>

      <h2 className="mt-8 font-semibold text-lg">9. Policy Updates</h2>
      <p className="mt-2">
        FloraVault reserves the right to modify this Seller Protection Program
        at any time. Sellers will be notified of significant changes via email.
        Continued use of the marketplace after changes constitutes acceptance of
        the updated policy.
      </p>

      <div className="mt-8 p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
        <p className="text-xs text-zinc-500">
          See also:{" "}
          <Link href="/buyer-protection" className="underline hover:text-zinc-300">
            Buyer Protection Program
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

export default SellerProtection;
