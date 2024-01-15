"use client";

import { links } from "@constants";
import { Logout } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BottomBar = () => {
  const pathname = usePathname();

  const { data: session } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex justify-between items-center p-2 bg-white">
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
  );
};

export default BottomBar;
