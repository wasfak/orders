"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const Links = [
    { name: "Home", href: "/" },

    { name: "Orders", href: "/orders" },
    { name: "Month Search", href: "/search" },
  ];

  return (
    <nav className="flex gap-6">
      {Links.map((link, index) => {
        return (
          <Link
            href={link.href}
            key={index}
            className={`${
              link.href === pathname && "text-white border-b-2 border-white"
            } capitalize font-medium hover:text-white transition-all ease-in-out`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
