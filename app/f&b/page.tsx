import FoodAndBevaragePage from "@/app/components/foodbeverage";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "f&b",
  description:
    "f&bPage",
};
export default function foodBeverage(){
  return(
    <FoodAndBevaragePage></FoodAndBevaragePage>
  )
}