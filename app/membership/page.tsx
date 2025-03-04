import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Membership",
  description:
    "MembershipPage",
};
import Membership from "@/app/components/membership";
export default function MembershipPage() {
 return(
  <Membership/>
 )
  
}
