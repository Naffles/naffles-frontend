"use client";
import Link from "next/link";
import BrandIcon from "@components/icons/brandIcon";
import { FaDiscord } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
export default function Home() {
  //  20 April 2024, 09:44 UTC
  const [countdownDays, setCountdownDays] = useState<string>("00");
  const [countdownHours, setCountdownHours] = useState<string>("00");
  const [countdownMinutes, setCountdownMinutes] = useState<string>("00");
  const [countdownSeconds, setCountdownSeconds] = useState<string>("00");

  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://163a3d88-a381-4928-873c-19ebd4bd977d.snippet.anjouangaming.org/anj-seal.js";
    // script.async = true;
    // script.onload;
    document.body.appendChild(script);

    var countDownDate = new Date("May 27, 2024 22:00:00 UTC").getTime();
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
      document.body.removeChild(script);
    };
  }, []);

  // Update the count down every 1 second

  return (
    <main className="flex min-h-screen flex-col items-center justify-start w-full">
      <div className="w-full lg:py-[23px] py-[13px] lg:px-[31px] px-[18px] bg-nafl-charcoal-600">
        <div className="flex flex-col w-full bg-nafl-sponge-500 rounded-[16px] relative items-center justify-center py-[100px] overflow-hidden">
          {/* uncomment when nafflings are to be released to public */}
          {/* <motion.div
            whileHover={{ y: 30 }}
            className="absolute top-[-73px] left-[100px] w-[114.45px]"
          >
            <img src="/nafflings/hidden.png" alt="" />
          </motion.div> */}
          <div className="absolute bg-nafl-charcoal-600 rounded-full h-8 w-8 top-[-1rem]" />

          <div className="absolute left-[18px] top-[20px]">
            <span className="relative h-6">
              <Link href="/">
                <BrandIcon size="lg" colour="black" />
              </Link>
            </span>
          </div>

          <p className="mt-[48px] lg:text-[119px] text-[65px] font-face-bebas leading-[100%] lg:w-[900px] w-[90%] text-center text-[#000]">
            the leading CHOICE FOR{" "}
            <a href="" className="text-[#00E0DF] cursor-text">
              DEGEN
            </a>{" "}
            crypto Gamers
          </p>

          <p className="mt-[55px] lg:text-[23px] text-[16px] text-[#000] lg:w-[890px] w-[90%] text-center">
            Naffles provides the Gamble-Fi Infrastructure for Games Developers
            without a Gambling License, to integrate PvP and P2P crypto
            wagering, raffles and lotteries
          </p>

          <div className="flex flex-col items-center justify-center gap-[16px] mt-[65px] w-full">
            <a
              href="https://discord.gg/naffles"
              target="_blank"
              className="flex items-center justify-center h-[54px] lg:w-[364px] w-[90%] bg-[#464646] rounded-[8px] gap-[10px] group"
            >
              <FaDiscord className="text-nafl-sponge-500 text-[24px] group-hover:text-[#5865f2] duration-500" />
              <p className="font-bold text-nafl-sponge-500 text-[18px] truncate group-hover:text-[#fff] duration-500">
                JOIN THE NAFFLES COMMUNITY
              </p>
            </a>
            <a
              href="mailto:support@naffles.com"
              className="flex items-center justify-center h-[54px] lg:w-[364px] w-[90%] bg-[#464646] rounded-[8px] gap-[10px] group"
            >
              <MdEmail className="text-nafl-sponge-500 text-[24px] group-hover:text-[#fff] duration-500" />
              <p className="font-bold text-nafl-sponge-500 text-[18px] truncate group-hover:text-[#fff] duration-500">
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
          className="absolute top-0 w-full h-full object-cover z-10"
        />

        <div className="flex flex-col w-full items-center z-20 py-[70px] lg:gap-[50px] gap-[20px]">
          <div className="flex flex-col items-center justify-center lg:gap-[30px] gap-[10px] z-30">
            <p className="lg:text-[110px] text-[70px] font-face-bebas text-[#fff]">
              It&apos;s Coming
            </p>
            <div className="flex flex-row items-center justify-center gap-[15px] lg:scale-100 md:scale-75 scale-50">
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
                <p className="absolute top-[130px] text-[23px] font-face-bebas text-[#fff]">
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
                <p className="absolute top-[130px] text-[23px] font-face-bebas text-[#fff]">
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
                <p className="absolute top-[130px] text-[23px] font-face-bebas text-[#fff]">
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
                <p className="absolute top-[130px] text-[23px] font-face-bebas text-[#fff]">
                  {" "}
                  SECONDS
                </p>
              </div>
            </div>
          </div>

          <div className="flex xl:w-[1200px] w-[80%] h-[2px] bg-[#fff] lg:mt-[60px] mt-[30px] lg:mb-[30px] mb-[15px]"></div>
          <div className="flex flex-col w-full items-center justify-center lg:gap-[10px] gap-0 lg:mt-0 mt-[-100px]">
            <div className="w-[860px] h-[410px] relative lg:scale-100 md:scale-75 scale-[40%]">
              <img
                src="/static/cd-ticket-1.png"
                alt="Ticket Qoute"
                className="w-[330px] object-contain absolute left-[5%] top-[3%] z-20"
              />
              <img
                src="/static/cd-ticket-2.png"
                alt="Ticket Qoute"
                className="w-[300px] object-contain absolute right-[25%] top-0 z-10"
              />
              <img
                src="/static/cd-ticket-3.png"
                alt="Ticket Qoute"
                className="w-[300px] object-contain absolute left-0 top-[27%] z-10"
              />
              <img
                src="/static/cd-ticket-4.png"
                alt="Ticket Qoute"
                className="w-[260px] object-contain absolute right-0 top-[20%] z-20"
              />
              <img
                src="/static/cd-ticket-5.png"
                alt="Ticket Qoute"
                className="w-[260px] object-contain absolute left-[25%] bottom-[8%] z-20"
              />
              <img
                src="/static/cd-ticket-6.png"
                alt="Ticket Qoute"
                className="w-[300px] object-contain absolute right-[12%] bottom-0 z-10"
              />
            </div>
            <div className="flex flex-row flex-wrap items-center justify-center w-full relative lg:scale-100 scale-75 lg:gap-[80px] gap-[30px] lg:mt-0 mt-[-70px]">
              {/* <img
                src="/static/cd-partner-3.png"
                alt="Partners"
                className="h-[64px] object-contain"
              /> */}
              <img
                src="/static/cd-partner-1.png"
                alt="Partners"
                className="h-[80px] object-contain"
              />
              <img
                src="/static/cd-partner-4.png"
                alt="Partners"
                className="h-[80px] object-contain"
              />
              <img
                src="/static/cd-partner-2.png"
                alt="Partners"
                className="h-[90px] object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[10px] items-center justify-center lg:mt-[50px] mt-[20px]">
            <p className="lg:text-[64px] text-[34px] font-face-bebas xl:w-[1053px] w-[95%] text-center text-[#fff]">
              <a className="cursor-text text-nafl-sponge-500">
                Naffles brings the license.
              </a>{" "}
              You Bring the games.
            </p>
            <p className="lg:text-[38px] text-[18px] font-face-bebas xl:w-[1053px] w-[95%] text-center text-[#fff]">
              the first-ever gamble-fi platform for{" "}
              <a className="cursor-text text-[#02B1B1]">p2P and pvP</a> crypto
              gaming, empowering third-party developers with a unique gambling
              license.
            </p>
          </div>
        </div>
      </div>

      <div className="flex lg:flex-row flex-col lg:items-start items-center justify-center pt-[60px] lg:pb-[125px] pb-[250px] w-full xl:gap-[90px] gap-[40px] relative bg-[#181818]">
        <img
          src="/static/naffles-text-logo.png"
          alt="Naffles Text Logo"
          className="xl:w-[350px] lg:w-[250px] md:w-[50%] w-[80%] object-contain"
        />
        {/* uncomment when nafflings are to be released to public */}
        {/* <div className="relative">
          <img
            src="/static/naffles-text-logo.png"
            alt="Naffles Text Logo"
            className="md:w-[350px] max-w-[350px] w-[90%] object-contain xl:mt-[54px] my-[34px]"
          />
          <div className="w-[58px] absolute top-[20px] lg:top-[20px] xl:top-[40px] right-10 md:right-2">
            <img src="/nafflings/surprise4.png" alt="" />
          </div>
        </div> */}
        <div className="flex md:flex-row flex-col items-center justify-center gap-[7px]">
          {/* <img
            src="/static/footer-secure-check.png"
            alt="Naffles Text Logo"
            className="w-[75px] object-contain"
          /> */}
          <div
            id="anj-163a3d88-a381-4928-873c-19ebd4bd977d"
            data-anj-seal-id="163a3d88-a381-4928-873c-19ebd4bd977d"
            data-anj-image-size="75"
            data-anj-image-type="basic-small"
          ></div>
          <div className="flex flex-col xl:w-[960px] lg:w-[600px] md:w-[80%] w-[90%] gap-[12px]">
            <p className="text-[16px] text-[#fff]">
              https://naffles.com/ is owned and operated by Degentralised
              Interactive Limited (Registration Number: 2134682) with the
              Registered Address: Intershore Chambers, Road Town, Tortola,
              British Virgin Islands.
            </p>
            <p className="text-[16px] text-[#fff]">
              Contact us nft@naffles.com.
            </p>
            <p className="text-[16px] text-[#fff]">
              naffles.com is licensed and regulated by the Government of the
              Autonomous Island of Anjouan, Union of Comoros and operates under
              License No. ALSI-062403009-F16.
            </p>
            <p className="text-[16px] text-[#fff]">
              naffles.com has passed all regulatory compliance and is legally
              authorized to conduct gaming operations for any and all games of
              chance and wagering.
            </p>
          </div>
        </div>
        <div className="flex lg:flex-row flex-col items-center lg:justify-between center w-full py-[40px] absolute bottom-0 bg-[#181818] xl:px-[270px] lg:px-[50px] px-0 text-[23px]">
          <p className="text-[#626262] font-face-bebas text-center">
            © Copyright 2022 naffles All Rights Reserved.
          </p>

          <div className="flex flex-row items-center justify-center gap-[6px]">
            <a
              href="https://www.dropbox.com/scl/fi/28jmch0e45pwfwnjvea1j/Responsible-Gambling-Policy.pdf?rlkey=5oqm08umlcvizj56rkmlup19n&dl=0"
              target="_blank"
              className="text-[#626262] font-face-bebas hover:text-[#fff] duration-500"
            >
              RESPONSIBLE GAMBLING POLICY
            </a>
            <p className="text-[#626262] font-face-bebas">|</p>
            <a
              href="https://www.dropbox.com/scl/fi/og0mx4uquayhldpzm3hdi/Terms-and-Conditions.pdf?rlkey=zgg66vph42826xl8wqjy5tum0&dl=0"
              target="_blank"
              className="text-[#626262] font-face-bebas hover:text-[#fff] duration-500"
            >
              TERMS OF USE
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
