import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import PageHeader from "@components/shared/PageHeaders/PageHeader2";
import { GameZoneProvider } from "@components/context/GameZoneContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naffle: Game Zone",
  description: "WIN RAFFLES FOR",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GameZoneProvider>
          <PageHeader />
          {children}
        </GameZoneProvider>
      </body>
    </html>
  );
}
