import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col items-center w-full h-screen pt-28 px-8 overflow-hidden">
      <span className="text-nafl-purple font-face-bebas text-title-4xl">
        NAFFLES KYC POLICY
      </span>

      <div className="w-full max-w-[900px] max-h-[1200px] h-5/6 mt-4 overflow-auto font-face-roboto text-body-base font-bold">
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
  );
};
export default PrivacyPolicy;
