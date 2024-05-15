import { Fragment } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naffle: Verification",
  description: "WIN RAFFLES FOR",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Fragment>{children}</Fragment>;
}
