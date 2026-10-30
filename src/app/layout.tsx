import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { OfflineBanner } from "@/components/ui/offline-banner";
import { ServiceWorkerRegister } from "@/components/sw-register";
import { UserProvider } from "@/features/auth/user-provider";
import { ProviderDraftProvider } from "@/features/provider/draft-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#FF8811",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "ServiceHub",
  description:
    "Find trusted local experts for your home, or grow your business with ServiceHub.",
  appleWebApp: {
    title: "ServiceHub",
    capable: true,
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-cream text-ink antialiased`}>
        <UserProvider>
          <ProviderDraftProvider>
            <ServiceWorkerRegister />
            <OfflineBanner />
            {children}
          </ProviderDraftProvider>
        </UserProvider>
      </body>
    </html>
  );
}
