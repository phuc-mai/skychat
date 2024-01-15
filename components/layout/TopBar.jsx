"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logout } from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";

import { links } from "@constants";
import Image from "next/image";

const TopBar = () => {
  const pathname = usePathname();

  const { data: session } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="topbar">
      <Link href="/chats">
        <Image src="/assets/logo.png" alt="logo" width={180} height={70} />
      </Link>
      <div className="menu">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.url}
            className={`${
              pathname === link.url ? "text-red-1" : ""
            } text-heading4-bold`}
          >
            {link.label}
          </Link>
        ))}

        <Logout
          sx={{ color: "#737373", cursor: "pointer" }}
          onClick={handleLogout}
        />

        <Link href="/profile">
          <img
            src={user?.profileImage || "/assets/person.jpg"}
            alt="profile"
            className="profilePhoto"
          />
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
