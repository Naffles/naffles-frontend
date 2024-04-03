"use client";
import Link from "next/link";
import BrandIcon from "@components/icons/brandIcon";
import { FaDiscord } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useEffect, useState } from "react";

export default function Home() {
  //  20 April 2024, 09:44 UTC
  const [countdownDays, setCountdownDays] = useState<string>("00");
  const [countdownHours, setCountdownHours] = useState<string>("00");
  const [countdownMinutes, setCountdownMinutes] = useState<string>("00");
  const [countdownSeconds, setCountdownSeconds] = useState<string>("00");

  useEffect(() => {
    var countDownDate = new Date("April 20, 2024 04:01:00 UTC").getTime();
    let cdInterval = setInterval(function () {
      var now = new Date().getTime();
      var distance = countDownDate - now;
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdownDays(("0" + days).slice(-2));
      setCountdownHours(("0" + hours).slice(-2));
      setCountdownMinutes(("0" + minutes).slice(-2));
      setCountdownSeconds(("0" + seconds).slice(-2));
    }, 1000);

    return () => {
      clearInterval(cdInterval);
    };
  }, []);

  // Update the count down every 1 second

  return (
    <main className="flex min-h-screen flex-col items-center justify-start w-full">
      <div className="w-full py-[23px] px-[31px] bg-nafl-charcoal-600">
        <div className="flex flex-col w-full bg-nafl-sponge-500 rounded-[16px] h-[694px] relative items-center justify-center py-[100px]">
          <div className="absolute bg-nafl-charcoal-600 rounded-full h-8 w-8 top-[-1rem]" />

          <div className="absolute left-[18px] top-[20px]">
            <span className="relative h-6">
              <Link href="/">
                <BrandIcon size="lg" colour="black" />
              </Link>
            </span>
          </div>

          <p className="mt-[48px] text-[119px] font-face-bebas leading-[100%] xl:w-[900px] w-[90%] text-center text-[#000]">
            the leading CHOICE FOR{" "}
            <a href="" className="text-[#00E0DF] cursor-text">
              DEGEN
            </a>{" "}
            crypto Gamers
          </p>

          <p className="mt-[55px] text-[23px] text-[#000] text-left xl:w-[890px] w-[90%]">
            Naffles provides the Gamble-Fi Infrastructure for Games Developers
            without a Gambling License, to integrate PvP and P2P crypto
            wagering, raffles and lotteries
          </p>

          <div className="flex md:flex-row flex-col items-center justify-center gap-[16px] mt-[65px]">
            <a
              href="https://discord.gg/naffles"
              className="flex items-center justify-center px-[30px] h-[54px] bg-[#464646] rounded-[8px] gap-[10px]"
            >
              <FaDiscord className="text-nafl-sponge-500 text-[24px]" />
              <p className="font-bold text-nafl-sponge-500 text-[18px]">
                JOIN THE DISCORD
              </p>
            </a>
            <a
              href="mailto:nft@naffles.com"
              className="flex items-center justify-center px-[30px] h-[54px] bg-[#464646] rounded-[8px] gap-[10px]"
            >
              <MdEmail className="text-nafl-sponge-500 text-[24px]" />
              <p className="font-bold text-nafl-sponge-500 text-[18px]">
                WRITE US A LOVELY LETTER
              </p>
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full relative bg-[#1c1c1c] overflow-hidden">
        <img
          src="/static/countdown-bg.png"
          alt="Countdown Background"
          className="w-full h-full object-cover mt-[-21px] mb-[-250px]"
        />

        <div className="flex flex-col items-center absolute top-0 z-20 py-[70px] gap-[50px]">
          <div className="flex flex-col items-center justify-center gap-[30px]">
            <p className="text-[110px] font-face-bebas">It&apos;s Coming</p>
            <div className="flex flex-row items-center justify-center gap-[15px]">
              <div className="flex flex-row items-center justify-center gap-[5px] relative">
                <div className="flex items-center justify-center w-[70px] h-[106px] relative">
                  <img
                    src="/static/cd-number-ticket.png"
                    alt="Ticket Number Background"
                    className="w-full object-contain absolute top-0"
                  />
                  <p className="text-[53px] font-face-bebas text-[#2c2d2e] z-20">
                    {countdownDays.substring(0, 1)}
                  </p>
                </div>

                <div className="flex items-center justify-center w-[70px] h-[106px] relative">
                  <img
                    src="/static/cd-number-ticket.png"
                    alt="Ticket Number Background"
                    className="w-full object-contain absolute top-0"
                  />
                  <p className="text-[53px] font-face-bebas text-[#2c2d2e] z-20">
                    {countdownDays.substring(1, 2)}
                  </p>
                </div>
                <p className="absolute top-[130px] text-[23px] font-face-bebas">
                  {" "}
                  DAYS
                </p>
              </div>
              <p className="text-[80px] font-face-bebas text-nafl-sponge-500">
                :
              </p>
              <div className="flex flex-row items-center justify-center gap-[5px] relative">
                <div className="flex items-center justify-center w-[70px] h-[106px] relative">
                  <img
                    src="/static/cd-number-ticket.png"
                    alt="Ticket Number Background"
                    className="w-full object-contain absolute top-0"
                  />
                  <p className="text-[53px] font-face-bebas text-[#2c2d2e] z-20">
                    {countdownHours.substring(0, 1)}
                  </p>
                </div>
                <div className="flex items-center justify-center w-[70px] h-[106px] relative">
                  <img
                    src="/static/cd-number-ticket.png"
                    alt="Ticket Number Background"
                    className="w-full object-contain absolute top-0"
                  />
                  <p className="text-[53px] font-face-bebas text-[#2c2d2e] z-20">
                    {countdownHours.substring(1, 2)}
                  </p>
                </div>
                <p className="absolute top-[130px] text-[23px] font-face-bebas">
                  {" "}
                  HOURS
                </p>
              </div>
              <p className="text-[80px] font-face-bebas text-nafl-sponge-500">
                :
              </p>
              <div className="flex flex-row items-center justify-center gap-[5px] relative">
                <div className="flex items-center justify-center w-[70px] h-[106px] relative">
                  <img
                    src="/static/cd-number-ticket.png"
                    alt="Ticket Number Background"
                    className="w-full object-contain absolute top-0"
                  />
                  <p className="text-[53px] font-face-bebas text-[#2c2d2e] z-20">
                    {countdownMinutes.substring(0, 1)}
                  </p>
                </div>
                <div className="flex items-center justify-center w-[70px] h-[106px] relative">
                  <img
                    src="/static/cd-number-ticket.png"
                    alt="Ticket Number Background"
                    className="w-full object-contain absolute top-0"
                  />
                  <p className="text-[53px] font-face-bebas text-[#2c2d2e] z-20">
                    {countdownMinutes.substring(1, 2)}
                  </p>
                </div>
                <p className="absolute top-[130px] text-[23px] font-face-bebas">
                  {" "}
                  MINUTES
                </p>
              </div>
              <p className="text-[80px] font-face-bebas text-nafl-sponge-500">
                :
              </p>
              <div className="flex flex-row items-center justify-center gap-[5px] relative">
                <div className="flex items-center justify-center w-[70px] h-[106px] relative">
                  <img
                    src="/static/cd-number-ticket.png"
                    alt="Ticket Number Background"
                    className="w-full object-contain absolute top-0"
                  />
                  <p className="text-[53px] font-face-bebas text-[#2c2d2e] z-20">
                    {countdownSeconds.substring(0, 1)}
                  </p>
                </div>
                <div className="flex items-center justify-center w-[70px] h-[106px] relative">
                  <img
                    src="/static/cd-number-ticket.png"
                    alt="Ticket Number Background"
                    className="w-full object-contain absolute top-0"
                  />
                  <p className="text-[53px] font-face-bebas text-[#2c2d2e] z-20">
                    {countdownSeconds.substring(1, 2)}
                  </p>
                </div>
                <p className="absolute top-[130px] text-[23px] font-face-bebas">
                  {" "}
                  SECONDS
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-[1200px] h-[2px] bg-[#fff] mt-[60px] mb-[30px]"></div>
          <div className="flex flex-row items-center justify-center gap-[10px]">
            <div className="w-[580px] h-[290px] relative">
              <img
                src="/static/cd-ticket-1.png"
                alt="Ticket Qoute"
                className="w-[260px] object-contain absolute left-0 top-[3%] z-20"
              />
              <img
                src="/static/cd-ticket-2.png"
                alt="Ticket Qoute"
                className="w-[220px] object-contain absolute right-[20%] top-0 z-10"
              />
              <img
                src="/static/cd-ticket-3.png"
                alt="Ticket Qoute"
                className="w-[240px] object-contain absolute left-0 bottom-[24%] z-10"
              />
              <img
                src="/static/cd-ticket-4.png"
                alt="Ticket Qoute"
                className="w-[190px] object-contain absolute right-0 bottom-[27%] z-20"
              />
              <img
                src="/static/cd-ticket-5.png"
                alt="Ticket Qoute"
                className="w-[200px] object-contain absolute left-[23%] bottom-[8%] z-20"
              />
              <img
                src="/static/cd-ticket-6.png"
                alt="Ticket Qoute"
                className="w-[200px] object-contain absolute right-[15%] bottom-0 z-10"
              />
            </div>
            <div className="w-[325px] h-[300px] relative">
              <img
                src="/static/cd-partner-1.png"
                alt="Partners"
                className="w-[120px] object-contain absolute left-0 top-0"
              />
              <img
                src="/static/cd-partner-2.png"
                alt="Partners"
                className="w-[200px] object-contain absolute right-0 top-[60px]"
              />
              <img
                src="/static/cd-partner-3.png"
                alt="Partners"
                className="w-[150px] object-contain absolute left-0 top-[170px]"
              />
              <img
                src="/static/cd-partner-4.png"
                alt="Partners"
                className="w-[170px] object-contain absolute right-[20px] bottom-0"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[10px] items-center justify-center mt-[50px]">
            <p className="text-[64px] font-face-bebas w-[1053px]">
              <a className="cursor-text text-nafl-sponge-500">
                Naffles brings the license.
              </a>{" "}
              You Bring the games.
            </p>
            <p className="text-[38px] font-face-bebas w-[1053px] text-center">
              the first-ever gamble-fi platform for{" "}
              <a className="cursor-text text-[#02B1B1]">p2P and pvP</a> crypto
              gaming, empowering third-party developers with a unique gambling
              license.
            </p>
          </div>
        </div>
      </div>

      <div className="flex lg:flex-row flex-col md:items-start items-center justify-center pt-[60px] xl:pb-[125px] pb-[250px] w-full xl:gap-[90px] gap-[40px] relative bg-[#181818]">
        <img
          src="/static/naffles-text-logo.png"
          alt="Naffles Text Logo"
          className="lg:w-[350px] w-[80%] object-contain"
        />
        <div className="flex flex-row items-start justify-center gap-[7px]">
          <img
            src="/static/footer-shield.png"
            alt="Naffles Text Logo"
            className="w-[75px] object-contain"
          />
          <div className="flex flex-col lg:w-[960px] w-[90%] gap-[12px]">
            <p className="text-[16px]">
              https://naffles.com/ is owned and operated by Degentralised
              Interactive Limited (Registration Number: 2134682) with the
              Registered Address: Intershore Chambers, Road Town, Tortola,
              British Virgin Islands.
            </p>
            <p className="text-[16px]">Contact us nft@naffles.com.</p>
            <p className="text-[16px]">
              naffles.com is licensed and regulated by the Government of the
              Autonomous Island of Anjouan, Union of Comoros and operates under
              License No. ALSI-062403009-F16.
            </p>
            <p className="text-[16px]">
              naffles.com has passed all regulatory compliance and is legally
              authorized to conduct gaming operations for any and all games of
              chance and wagering.
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between w-full h-[120px] absolute bottom-0 bg-[#181818] px-[270px] text-[23px]">
          <p className="text-[#626262] font-face-bebas">
            © Copyright 2022 naffles All Rights Reserved.
          </p>

          <div className="flex flex-row items-center justify-center gap-[6px]">
            <p className="text-[#626262] font-face-bebas">PRIVACY POLICY</p>
            <p className="text-[#626262] font-face-bebas">|</p>
            <p className="text-[#626262] font-face-bebas">TERMS OF USE</p>
          </div>
        </div>
      </div>
    </main>
  );
}
