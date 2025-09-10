"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { checkToken } from "@/store/slices/userInfo";
import { useAppDispatch } from "@/store/hooks";

export default function IntervalTokenChecker() {
  const path = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkToken());
  }, [path]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(checkToken());
    }, 1000 * 60 * 5);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return null;
}
