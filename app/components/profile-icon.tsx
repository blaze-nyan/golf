import { Avatar } from "@heroui/react";
import Link from "next/link";

export default function ProfileIcon() {
  return (
    <Link href="/profile">
      <Avatar
        isBordered
        color="success"
        src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
      />
    </Link>
  );
}
