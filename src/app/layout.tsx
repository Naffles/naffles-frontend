import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import PageHeader from "@components/shared/PageHeaders/PageHeader2";
import { Providers } from "./providers";
import MagicProvider from "@blockchain/context/MagicProvider";
import { UserProvider } from "@blockchain/context/UserContext";
import LoginModal from "@components/Modal/LoginModal";
import DepositModal from "@components/Modal/DepositModal";
import "./globals.css";
import { BasicUserProvider } from "@components/context/BasicUser/BasicUser";
import { Toaster } from "react-hot-toast";

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
      <body className={`${inter.className} bg-[#464646]`}>
        <Providers>
          <BasicUserProvider>
            <MagicProvider>
              <UserProvider>
                <PageHeader />
                {children}
                <LoginModal />
                <DepositModal />
                <Toaster
                  position="bottom-center"
                  reverseOrder={false}
                  gutter={8}
                  containerClassName="z-50"
                  // containerStyle={{}}
                  toastOptions={{
                    // Define default options
                    className: "",
                    duration: 5000,
                    style: {
                      background: "#feff3d",
                      color: "#000",
                      fontWeight: "normal",
                    },
                  }}
                />
              </UserProvider>
            </MagicProvider>
          </BasicUserProvider>
        </Providers>
      </body>
    </html>
  );
}
