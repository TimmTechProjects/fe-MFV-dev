import React from "react";
import { TextEffect } from "@/components/ui/text-effect";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="relative w-full h-[70vh] md:h-[80vh]  max-w-full mx-auto overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/herbs-in-jars.jpg"
        alt="FloralVault Background"
        fill
        className="object-cover object-center z-0 w-full h-full"
        priority
      />

      {/* Overlay to enhance readability */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* Text Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center text-white">
        <section className="mb-4">
          <TextEffect
            per="line"
            as="h1"
            speedReveal={0.5}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
          >
            Welcome to FloralVault
          </TextEffect>
        </section>
        <TextEffect
          delay={0.5}
          speedReveal={0.5}
          speedSegment={0.15}
          className="text-base sm:text-lg md:text-xl lg:text-2xl"
        >
          Your collection of Eden
        </TextEffect>
      </div>
    </div>
  );
};

export default Hero;
