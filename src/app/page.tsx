import Button from "@components/shared/Button/button";
import PageHeader from "@components/shared/PageHeaders/PageHeader";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <PageHeader
        // onLogout={() => console.log("Logged out")}
        // onLogin={() => console.log("Logged in")}
      />
    </main>
  );
}
