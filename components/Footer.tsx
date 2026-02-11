import React from "react";

const Footer = () => {
  return (
    <footer className="w-full px-10 py-4 text-sm text-zinc-700 dark:text-white bg-gray-100 dark:bg-[#262624] border-t border-gray-200 dark:border-transparent">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <span>
          © {new Date().getFullYear()} FloraVault. All rights reserved.
        </span>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>
          <a href="/seller-protection" className="hover:underline">
            Seller Protection
          </a>
          <a href="/buyer-protection" className="hover:underline">
            Buyer Protection
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
