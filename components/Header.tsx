import Link from "next/link";
import Nav from "./Nav";

import MobileNav from "./MobileNav";
import { UserButton, auth } from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function Header() {
  const { userId } = auth();
  return (
    <header className="text-white py-4 xl:py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-4xl font-semibold font-mono">
            WaSfY<span className="text-white">.</span>
          </h1>
        </Link>

        {/*DeskTop Nav */}

        <div className="hidden xl:flex items-center gap-8">
          <Nav />
        </div>

        {/*Mobile Nav */}

        <div className="xl:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
