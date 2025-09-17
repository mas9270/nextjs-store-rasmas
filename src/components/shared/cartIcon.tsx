"use client";
import { useAppSelector } from "@/store/hooks";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Badge from "@mui/material/Badge";

export default function CartIcon() {
  const { data } = useAppSelector((state) => state.userInfo);
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!data?.id) return;

    const ws = new WebSocket(`ws://localhost:3000/api/ws?userId=${data.id}`);

    ws.onopen = () => console.log("WebSocket connected");

    ws.onmessage = (event) => {
      debugger
      const msg = JSON.parse(event.data);
      if (msg.type === "cart_update") {
        console.log("سبد خرید آپدیت شد:", msg.data);
        // تعداد کل آیتم‌ها در سبد خرید
        const totalQuantity = msg.data.items.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );
        setCartCount(totalQuantity);
      }
    };

    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
  }, [data?.id]);

  if (!data) return null;

  return (
    <Badge
      badgeContent={cartCount}
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
