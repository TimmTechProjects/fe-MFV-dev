"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./button";

const GoBackButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.back();

    // If there isn't enough history, redirect to the home page
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <Button onClick={handleClick} className="hover:bg-accent rounded-2xl">
      Go Back
    </Button>
  );
};

export default GoBackButton;
