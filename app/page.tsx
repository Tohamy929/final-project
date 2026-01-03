import Image from "next/image";
import FeaturedProducts from "./_components/FeaturedProducts";
import { Suspense } from "react";
import Loading from "@/Loading";

export default function Home() {
  return (
   <div className="flex flex-wrap">
    <Suspense fallback={<Loading></Loading>}>
    <FeaturedProducts></FeaturedProducts>
    </Suspense>
   </div>
  );
}
