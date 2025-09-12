"use client";
import { useAppSelector } from "@/store/hooks";
import Badge from "@mui/material/Badge";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartIcon() {
  const { data } = useAppSelector((state) => state.userInfo);
  const router = useRouter();

  if (data) {
    return (
      <Badge
        badgeContent={0}
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

  return null;
}
