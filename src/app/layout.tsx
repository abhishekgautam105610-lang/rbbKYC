import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rastriya Banijya Bank - KYC Verification",
  description: "Customer KYC Verification Portal",
};

// =====================================================
// INTENTIONAL BUG (placed for debugging exercise)
// Blocks the entire application in production.
// Find & remove this whole block to fix.
// =====================================================
function ProductionGate({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== "production") {
    return <>{children}</>;
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold text-gray-900">Application Under Maintenance</h1>
        <p className="mt-2 text-sm text-gray-600">
          Please update your application to continue using this service.
        </p>
      </div>
    </div>
  );
}
// =====================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ProductionGate>
          {children}
          <Toaster position="top-center" richColors />
        </ProductionGate>
      </body>
    </html>
  );
}
