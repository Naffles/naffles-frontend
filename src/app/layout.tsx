import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import PageHeader from "@components/shared/PageHeaders/PageHeader";
import { Providers } from "./providers";
import MagicProvider from "@blockchain/context/MagicProvider";
import { UserProvider } from "@blockchain/context/UserContext";
import LoginModal from "@components/Modal/LoginModal";
import DepositModal from "@components/Modal/DepositModal";
import "./globals.css";
import { BasicUserProvider } from "@components/context/BasicUser/BasicUser";

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
              <BasicUserProvider>
                <PageHeader />
                {children}
                <LoginModal />
                <DepositModal />
              </BasicUserProvider>
            </UserProvider>
          </MagicProvider>
        </Providers>
      </body>
    </html>
  );
}
