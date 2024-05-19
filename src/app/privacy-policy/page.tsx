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
            <img
              src="/static/HGLS_white.png"
              alt="HGLS_white"
              className="w-[130px] h-[120px] object-contain top-[-15px] relative mx-5"
            />
          </span>
          <span className="mx-2">
            <img
              src="/static/Apexblocklogo.png"
              alt="HGLS_white"
              className="w-[130px] h-[120px] object-contain top-[-15px] relative ml-2"
            />
          </span>
        </div>
      </div>
      <div className="text-left my-5 lg:min-w-[900px] xs:min-w-[330px]">
        <span className="text-nafl-purple font-face-bebas text-title-4xl text-left block">
          NAFFLES KYC POLICY
        </span>
      </div>
      <div className="w-full max-w-[900px] max-h-[1200px] h-5/6 mt-4 text-nafl-white overflow-auto font-face-roboto text-body-base font-bold">
        <p className="italic">
          Last updated: 28December 2023
        </p>
        <br />
        <br />
        <span className="text-body-2xl font-bold italic">BACKGROUND</span>
        <br />
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
        <br />
        <div className="flex flex-row">
          <p>
            1)
          </p>
          <p className="ml-4">
            A copyofGovernment Issued PhotoID;
          </p>
        </div>
        <div className="flex flex-row">
          <p>
            2)
          </p>
          <p className="ml-4">
            A selfie of themselves holding the ID document; and
          </p>
        </div>
        <div className="flex flex-row">
          <p>
            3)
          </p>
          <p className="ml-4">
            A bank statement/Utility Bill.
          </p>
        </div>
        <br />
        Once uploaded, the user will get a notification that their documents are
        being processed. Our teamwillthen process the documents andwill email
        the user the outcome. The outcome will be one of the following: Approval, Rejection, or Request Further Information–No change in Status. When the user’s information is still being processed,they can: Use the platformnormally; They cannot deposit more than USD2,000in aggregate total; and They cannot complete any withdrawal.
        <br />
        When the user’s information is still being processed,they can: Use the
        platformnormally; They cannot deposit more than USD2,000in aggregate
        total; and They cannot complete any withdrawal.
        <br />
        <br />
        <span className="text-body-2xl font-bold italic">
          I.GUIDELINE FOR THE KYC PROCESS
        </span>
        <br />
        <br />
        <div className="flex flex-row">
          <p>
            1)
          </p>
          <p className="ml-4">
            Proof of Identification
            <br />
            <br />
            <div className="flex flex-row">
              <p>
                a)
              </p>
              <p className="ml-4">
                Signature is displayedclearly;
              </p>
            </div>
            <div className="flex flex-row">
              <p>
                b)
              </p>
              <p className="ml-4">
                Country is not a Restricted Country: United States of America and its territories, France and its territories, Netherlands and its territories and countries that form the Kingdom of Netherlands including Bonaire, Sint Eustatius, Saba, Aruba, Anjouanand Sint Maarten, Australia and its territories, United Kingdom of Great Britain, Northern Ireland, Spainand Cyprus;
              </p>
            </div>
            <div className="flex flex-row">
              <p>
                c)
              </p>
              <p className="ml-4">
                Full Name on ID matches client’s nameas when they signed up to use the Site;
              </p>
            </div>
            <div className="flex flex-row">
              <p>
                d)
              </p>
              <p className="ml-4">
                Identification Document does not expire in the next 3 months; and
              </p>
            </div>
            <div className="flex flex-row">
              <p>
                e)
              </p>
              <p className="ml-4">
                Owner is over 18 years of age.
              </p>
            </div>
          </p>
        </div>
        <br />
        <br />
        <div className="flex flex-row">
          <p>
            2)
          </p>
          <p className="ml-4">
            Proof of Residence
            <br />
            <br />
            <div className="flex flex-row">
              <p>
                a)
              </p>
              <p className="ml-4">
                Bank Statement or Utility Bill;
              </p>
            </div>
            <div className="flex flex-row">
              <p>
                b)
              </p>
              <p className="ml-4">
                Country is not a Restricted Country: United States of America and its territories, France and its territories, Netherlands and its territories and countries that form the Kingdom of Netherlands including Bonaire, Sint Eustatius, Saba, Aruba, Anjouan,njouanand St Maarten, Australia and its territories, United Kingdom of Great Britain, Northern Ireland, Spain,and Cyprus;
              </p>
            </div>
            <div className="flex flex-row">
              <p>
                c)
              </p>
              <p className="ml-4">
                Full Name matches client’s nameas when they signed up to use the Siteand is same as in proof of ID; andd.Date of Issue: In the last 3 months.
              </p>
            </div>
          </p>
        </div>
        <br />
        <br />
        <div className="flex flex-row">
          <p>
            3)
          </p>
          <p className="ml-4">
            Selfie with ID
            <br />
            <div className="flex flex-row">
              <p>
                a)
              </p>
              <p className="ml-4">
                Holder is the same as in the ID document above; and
              </p>
            </div>
            <div className="flex flex-row">
              <p>
                b)
              </p>
              <p className="ml-4">
                ID document is the same as in “1”. Ensure that thephoto/ID number is the same.
              </p>
            </div>
          </p>
        </div>
        <br />
        <br />
        <span className="text-body-2xl font-bold">
          II.NOTES ON THE KYC PROCESS
        </span>
        <br />
        <br />
        <div className="flex flex-row">
          <p>
            1)
          </p>
          <p className="ml-4">
            When the KYC process is unsuccessful, the reason is documented,and
            anexplanation is communicated back to the user.
          </p>
        </div>
        <br />
        <div className="flex flex-row">
          <p>
            2)
          </p>
          <p className="ml-4">
            The user will then be given a chance to provide further information or
            documentation as required.
          </p>
        </div>
        <br />
        <div className="flex flex-row">
          <p>
            3)
          </p>
          <p className="ml-4">
            Onceall proper documents are in our possession, the documents will be
            further evaluated before being approved.
          </p>
        </div>
        <br />
        <span className="text-body-2xl font-bold">III.OTHERAML MEASURES</span>
        <br />
        <br />
        <div className="flex flex-row">
          <p>
            1)
          </p>
          <p className="ml-4">
            If a user has failed to pass theKYC requirements, then they cannot
            make additional deposits or withdrawals of any amount.
          </p>
        </div>
        <br />
        <div className="flex flex-row">
          <p>
            2)
          </p>
          <p className="ml-4">
            If a user has passed the KYC process successfully then:
            <br />
            <div className="flex flex-row">
              <p>
                a)
              </p>
              <p className="ml-4">
                There is a deposit limit per transaction (max USD10,000)
              </p>
            </div>
            <div className="flex flex-row">
              <p>
                b)
              </p>
              <p className="ml-4">
                Prior to any withdrawal there is a detailed algorithmic and manual
                check on the activity and balance of the user to see if the amount
                withdrawn is a result of proper activity in the platform.
              </p>
            </div>
            </p>
          </div>
          <br />
          <div className="flex flex-row">
            <p>
              3)
            </p>
            <p className="ml-4">
              Under no circumstances may a user transfer funds directly to another
              user.
            </p>
          </div>
          <br />
          <div className="flex flex-row">
            <p>
              4)
            </p>
            <p className="ml-4">
              The user must have a verified account to be able to participate in
              any raffles.
            </p>
          </div>
      </div>
    </div>
    <div className="flex flex-col items-center bg-[#181818] pt-[20px] mt-[120px]">
          <div className="flex flex-col gap-[10px] xl:w-[80%] w-[90%]">
            <p className="text-nafl-white text-[16px] w-full">
              https://naffles.com/ is owned and operated by Degentralised
              Interactive Limited (Registration Number: 2134682) with the
              Registered Address: Intershore Chambers, Road Town, Tortola,
              British Virgin Islands.
            </p>
            <p className="text-nafl-white text-[16px] w-full">
              Contact us nft@naffles.com.
            </p>
            <p className="text-nafl-white text-[16px] w-full">
              naffles.com is licensed and regulated by the Government of the
              Autonomous Island of Anjouan, Union of Comoros and operates under
              License No. ALSI-062403009-F16.
            </p>
            <p className="text-nafl-white text-[16px] w-full">
              naffles.com has passed all regulatory compliance and is legally
              authorized to conduct gaming operations for any and all games of
              chance and wagering.
            </p>
          </div>
          <div className="flex xl:flex-row flex-col items-center xl:justify-between justify-center w-full h-[120px] xl:px-[270px] text-[23px]">
            <p className="text-[#626262] font-face-bebas">
              © Copyright 2024 naffles All Rights Reserved.
            </p>

            <div className="flex flex-row items-center justify-center gap-[6px]">
              {/* if privacy policy is clicked, redirect it to a link like dropbox */}
              <p className="text-[#626262] font-face-bebas">
                <a
                  href="/privacy-policy"
                  target="_blank"
                >
                  PRIVACY POLICY
                </a>
              </p>
              <p className="text-[#626262] font-face-bebas">|</p>
              <p className="text-[#626262] font-face-bebas">
                <a
                  href="/terms-and-conditions"
                  target="_blank"
                >
                  TERMS OF USE
                </a>
              </p>
            </div>
          </div>
        </div>
    </>
  );
};
export default PrivacyPolicy;
