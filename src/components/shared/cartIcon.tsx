"use client";
import { useAppSelector } from "@/store/hooks";
import Badge from "@mui/material/Badge";
import { ShoppingCart } from "lucide-react";

export default function CartIcon() {
  const { data } = useAppSelector((state) => state.userInfo);

  if (data) {
    return (
      <Badge badgeContent={4} color="primary" sx={{ marginRight: "15px" }}>
        <ShoppingCart />
      </Badge>
    );
  }

  return null;
}
