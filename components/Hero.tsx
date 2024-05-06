"use client";

import Image from "next/image";

import { CustomButton } from "@components";

const Hero = () => {
  const handleScroll = () => {
    const nextSection = document.getElementById("discover");

    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="pt-36 w-screen">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/Promo.png"
            alt="hero"
            width={1440}
            height={800}
            className="object-contain w-full"
          />
        </div>
      </div>

    </div>
  );
};

export default Hero;
