import Button from "@components/shared/Button/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button
        label="Click me"
      />
    </main>
  );
}
