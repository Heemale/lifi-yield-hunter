import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ChatProvider } from "@/context/ai/ChatContext";
import { BalanceProvider } from "@/context/wallet/BalanceContext";
import { UIActionProvider } from "@/context/ai/UIActionContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { AIPanel } from "@/components/chat/AIPanel";
import { WalletProvider } from "@/components/wallet/WalletProvider";
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
  title: "Yield Hunter",
  description: "Find the best DeFi yield opportunities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          <WalletProvider>
            <BalanceProvider>
              <ChatProvider>
                <UIActionProvider>
                  <AppLayout aiPanel={<AIPanel />}>
                    {children}
                  </AppLayout>
                </UIActionProvider>
              </ChatProvider>
            </BalanceProvider>
          </WalletProvider>
        </body>
    </html>
  );
}
