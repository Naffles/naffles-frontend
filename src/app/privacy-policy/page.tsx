import AscensiveAssets from "@components/icons/ascensiveAssets";
import EighteenPlus from "@components/icons/eighteenPlus";
import NafflesIcon from "@components/icons/nafflesIcon";
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <>
     <div className="flex flex-col items-center w-full h-screen pt-28 px-8 overflow-hidden mt-[80px]">
     <div className="flex-row flex justify-between w-[900px] lg:flex sm:hidden xs:hidden">
        <div className="flex flex-row">
          <span className="mt-4 mr-5">
            <NafflesIcon colour="white"/>
          </span>
          <span>
            <EighteenPlus size={75}/>
          </span>
        </div>
        <div className="flex flex-row">
          <span className="mx-2">
            <AscensiveAssets colour="white" />
          </span>
          
          <span className="mx-2">
            <AscensiveAssets colour="white" />
          </span>
          <span className="mx-2">
            <AscensiveAssets colour="white" />
          </span>
        </div>
      </div>
      <div className="text-left my-5 lg:min-w-[900px] xs:min-w-[330px]">
        <span className="text-nafl-purple font-face-bebas text-title-4xl text-left block">
          NAFFLES KYC POLICY
        </span>
      </div>
      <div className="w-full max-w-[900px] max-h-[1200px] h-5/6 mt-4 text-nafl-sponge-100 overflow-auto font-face-roboto text-body-base font-bold">
        Last updated: 28December 2023
        <br />
        <br />
        <span className="text-body-2xl font-bold">BACKGROUND</span>
        <br />
        When a user makes an aggregatelifetime total of depositsexceeding
        USD10,000orrequestsawithdrawal of any amountinside{" "}
        <Link href="/" className="font-face-roboto">
          https://naffles.com
        </Link>{" "}
        the NafflesPlatform, then it is compulsory for them to perform a full
        KYC process. During this process, the user will have to input some basic
        details about themselves and then uploadit as instructed on the Site.
        The following basic information will be asked from the user to provide:
        <br />
        <li>1)A copyofGovernment Issued PhotoID;</li>
        <li>2)A selfie of themselves holding the ID document; and</li>
        <li>3)A bank statement/Utility Bill.</li>
        Once uploaded, the user will get a notification that their documents are
        being processed. Our teamwillthen process the documents andwill email
        the user the outcome. The outcome will be one of the following:
        <ul>Approval;</ul>
        <ul>Rejection; or</ul>
        <ul>Request Further Information–No change in Status.</ul>
        <br />
        When the user’s information is still being processed,they can: Use the
        platformnormally; They cannot deposit more than USD2,000in aggregate
        total; and They cannot complete any withdrawal.
        <br />
        <br />
        <span className="text-body-2xl font-bold">
          I.GUIDELINE FOR THE KYC PROCESS
        </span>
        <br />
        1)Proof of Identification
        <br />
        a.Signature is displayedclearly;
        <br />
        b.Country is not a Restricted Country: United States of America and its
        territories, France and its territories, Netherlands and its territories
        and countries that form the Kingdom of Netherlands including Bonaire,
        Sint Eustatius, Saba, Aruba, Anjouanand Sint Maarten, Australia and its
        territories, United Kingdom of Great Britain, Northern Ireland, Spainand
        Cyprus;
        <br />
        c.Full Name on ID matches client’s nameas when they signed up to use the
        Site;
        <br />
        d.Identification Document does not expire in the next 3 months; and
        <br />
        e.Owner is over 18 years of age.
        <br />
        2)Proof of Residence
        <br />
        a.Bank Statement or Utility Bill;
        <br />
        b.Country is not a Restricted Country: United States of America and its
        territories, France and its territories, Netherlands and its territories
        and countries that form the Kingdom of Netherlands including Bonaire,
        Sint Eustatius, Saba, Aruba, Anjouan,njouanand St Maarten, Australia and
        its territories, United Kingdom of Great Britain, Northern Ireland,
        Spain,and Cyprus;
        <br />
        c.Full Name matches client’s nameas when they signed up to use the
        Siteand is same as in proof of ID; andd.Date of Issue: In the last 3
        months.
        <br />
        3)Selfie with ID
        <br />
        a.Holder is the same as in the ID document above; and
        <br />
        b.ID document is the same as in “1”. Ensure that thephoto/ID number is
        the same.
        <br />
        <br />
        <span className="text-body-2xl font-bold">
          II.NOTES ON THE KYC PROCESS
        </span>
        <br />
        1)When the KYC process is unsuccessful, the reason is documented,and
        anexplanation is communicated back to the user.
        <br />
        2)The user will then be given a chance to provide further information or
        documentation as required.
        <br />
        3)Onceall proper documents are in our possession, the documents will be
        further evaluated before being approved. <br />
        <br />
        <span className="text-body-2xl font-bold">III.OTHERAML MEASURES</span>
        <br />
        1)If a user has failed to pass theKYC requirements, then they cannot
        make additional deposits or withdrawals of any amount.
        <br />
        2)If a user has passed the KYC process successfully then:
        <br />
        a.There is a deposit limit per transaction (max USD10,000)
        <br />
        b.Prior to any withdrawal there is a detailed algorithmic and manual
        check on the activity and balance of the user to see if the amount
        withdrawn is a result of proper activity in the platform.
        <br />
        3)Under no circumstances may a user transfer funds directly to another
        user.
      </div>
    </div>
    <div className="flex lg:flex-row flex-col lg:items-start items-center justify-center pt-[60px] lg:pb-[125px] 
    pb-[250px] w-full xl:gap-[90px] gap-[40px] relative bg-[#181818] mt-[90px]">
        <img
          src="/static/naffles-text-logo.png"
          alt="Naffles Text Logo"
          className="xl:w-[350px] lg:w-[250px] md:w-[50%] w-[80%] object-contain"
        />
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
    </>
  );
};
export default PrivacyPolicy;
