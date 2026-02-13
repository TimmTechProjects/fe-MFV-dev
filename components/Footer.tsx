import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full px-10 py-4 text-sm text-zinc-700 dark:text-white bg-gray-100 dark:bg-[#262624] border-t border-gray-200 dark:border-transparent">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <span>
          © {new Date().getFullYear()} My Floral Vault. All rights reserved.
        </span>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/privacy" className="hover:underline hover:text-[#81a308] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline hover:text-[#81a308] transition-colors">
            Terms of Service
          </Link>
          <Link href="/seller-protection" className="hover:underline hover:text-[#81a308] transition-colors">
            Seller Protection
          </Link>
          <Link href="/buyer-protection" className="hover:underline hover:text-[#81a308] transition-colors">
            Buyer Protection
          </Link>
          <Link href="/contact" className="hover:underline hover:text-[#81a308] transition-colors">
            Contact Us
          </Link>
          <Link href="/support" className="hover:underline hover:text-[#81a308] transition-colors">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
