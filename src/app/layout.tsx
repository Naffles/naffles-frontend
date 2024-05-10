import type { Metadata } from "next";
import Script from "next/script";
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
      <Script id="mailerlite-init" strategy="beforeInteractive">
        {`(function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[]).push(arguments);},l=d.createElement(e),l.async=1,l.src=u,n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');ml('account', '923624');`}
      </Script>
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
