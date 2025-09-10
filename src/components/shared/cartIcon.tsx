"use client";
import Badge from "@mui/material/Badge";
import { ShoppingCart } from "lucide-react";

export default function CartIcon() {
  return (
    <Badge badgeContent={4} color="primary">
      <ShoppingCart />
    </Badge>
  );
}
