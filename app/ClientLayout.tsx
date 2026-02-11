"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useAppInit from "@/redux/hooks/useInit";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, initialized } = useAppInit();

  if (loading || !initialized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-[#121212] z-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#81a308] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#121212] text-zinc-900 dark:text-white">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
