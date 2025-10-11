"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Badge from "@mui/material/Badge";
import { CircularProgress } from "@mui/material";

export default function CartIcon() {
  const userInfo = useAppSelector((state) => state.userInfo.data);

  // useEffect(() => {
  //   if (!data?.id) return;

  //   const ws = new WebSocket(`ws://localhost:3000/api/ws?userId=${data.id}`);

  //   ws.onopen = () => console.log("WebSocket connected");

  //   ws.onmessage = (event) => {
  //     debugger
  //     const msg = JSON.parse(event.data);
  //     if (msg.type === "cart_update") {
  //       console.log("سبد خرید آپدیت شد:", msg.data);
  //       // تعداد کل آیتم‌ها در سبد خرید
  //       const totalQuantity = msg.data.items.reduce(
  //         (sum: number, item: any) => sum + item.quantity,
  //         0
  //       );
  //       setCartCount(totalQuantity);
  //     }
  //   };

  //   ws.onclose = () => console.log("WebSocket disconnected");

  //   return () => ws.close();
  // }, [data?.id]);

  if (!userInfo) return null;

  return <CartCount />;
}

function CartCount() {
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cart"],
    queryFn: async (e) => {
      const res = await fetch("/api/cart");
      return res.json();
    },
  });

  if (isLoading) {
    return <CircularProgress size={18} />;
  }

  return (
    <Badge
      badgeContent={data?.data?.items?.length ? data.data.items.length : 0}
      color="primary"
      sx={{ marginRight: "15px", cursor: "pointer" }}
    >
      <ShoppingCart
        onClick={() => {
          router.push("/cart");
        }}
      />
    </Badge>
  );
}
