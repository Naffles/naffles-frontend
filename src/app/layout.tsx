import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import PageHeader from "@components/shared/PageHeaders/PageHeader";
import { Providers } from "./providers";
import MagicProvider from "@blockchain/context/MagicProvider";
import { UserProvider } from "@blockchain/context/UserContext";
import LoginModal from "@components/Modal/LoginModal";
import DepositModal from "@components/Modal/DepositModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naffle",
  description: "WIN RAFFLES FOR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <MagicProvider>
            <UserProvider>
              <PageHeader />
              {children}
              <LoginModal />
              <DepositModal />
            </UserProvider>
          </MagicProvider>
        </Providers>
      </body>
    </html>
  );
}
