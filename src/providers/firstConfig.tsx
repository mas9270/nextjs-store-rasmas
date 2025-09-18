"use client";

import ToastProvider from "@/providers/toastProvider";
import IntervalTokenChecker from "@/components/shared/intervalTokenChecker";

export default function FirstConfig() {
  return (
    <>
      <ToastProvider />
      <IntervalTokenChecker />
    </>
  );
}
