"use client";
import { reactToastify } from "@/lib/toastify";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useState, useEffect } from "react";
import { setLoading } from "@/store/slices/appLoading";
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  title: string;
  price: number;
};

type CartItem = {
  id: number;
  product: Product;
  quantity: number;
};

type Cart = {
  id: number;
  userId: number | null;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
};

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const { loading } = useAppSelector((state) => state.appLoading);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  function getList() {
    dispatch(setLoading({ loading: true }));
    fetch(`/api/cart`)
      .then((res) => res.json())
      .then((res) => {
        if (res.data) setCart(res.data);
        dispatch(setLoading({ loading: false }));
      })
      .catch((err) => {
        reactToastify({ type: "error", message: err });
        dispatch(setLoading({ loading: false }));
      });
  }
  // بارگذاری سبد خرید
  useEffect(() => {
    getList();
  }, []);

  // افزایش/کاهش تعداد
  const updateQuantity = async (itemId: number, delta: number) => {
    if (!cart) return;
    const item = cart.items.find((i) => i.id === +itemId);
    if (!item) return;
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;
    setBtnLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.product.id,
          quantity: newQuantity,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.data);
      } else {
        reactToastify({
          type: "warning",
          message: data?.message,
        });
      }

      setBtnLoading(false);
    } catch (error: any) {
      reactToastify({ type: "error", message: error.message });
      setBtnLoading(false);
    }
  };

  // حذف محصول
  const removeItem = async (itemId: number) => {
    if (!cart) return;
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) return;
    setBtnLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.product.id }),
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.data);
        reactToastify({
          type: "success",
          message: data?.message,
        });
      } else {
        reactToastify({
          type: "warning",
          message: data?.message,
        });
      }
      setBtnLoading(false);
    } catch (error: any) {
      reactToastify({ type: "error", message: error.message });
      setBtnLoading(false);
    }
  };

  const handleCheckout = async () => {
    setBtnLoading(true);
    fetch("/api/orders", { method: "POST" })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          reactToastify({ type: "success", message: res.message });
          setCart(null);
          router.push(`/cart/checkout?orderId=${res.data.id}`);
        } else {
          reactToastify({ type: "warning", message: res.message });
          setBtnLoading(false);
        }
      })
      .catch((err) => {
        setBtnLoading(false);
        reactToastify({
          type: "warning",
          message: err.message,
        });
      });
  };

  // نمایش لودر
  if (loading) {
    return (
      <Box
        display="flex"
        width="100%"
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  // سبد خرید خالی
  if (!cart || cart.items.length === 0) {
    return (
      <Box
        display="flex"
        width="100%"
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h6">سبد خرید خالی است</Typography>
      </Box>
    );
  }

  return (
    <Box px={{ xs: 2, sm: 4 }} py={4}>
      <Typography variant="h4" mb={3}>
        سبد خرید
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }}
        gap={3}
      >
        {cart.items.map((item) => (
          <Card
            key={item.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6">{item.product.title}</Typography>
              <Typography color="text.secondary">
                قیمت واحد: {item.product.price.toLocaleString()} تومان
              </Typography>
              <Typography color="text.secondary">
                تعداد: {item.quantity}
              </Typography>
              <Typography color="text.secondary" fontWeight="bold">
                مجموع: {(item.product.price * item.quantity).toLocaleString()}{" "}
                تومان
              </Typography>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: "space-between" }}>
              <Box>
                <IconButton
                  loading={btnLoading}
                  onClick={() => updateQuantity(item.id, -1)}
                  size="small"
                >
                  <RemoveIcon />
                </IconButton>
                <IconButton
                  loading={btnLoading}
                  onClick={() => updateQuantity(item.id, 1)}
                  size="small"
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <IconButton
                loading={btnLoading}
                onClick={() => removeItem(item.id)}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckout}
          loading={btnLoading}
        >
          ثبت سفارش
        </Button>
      </Box>
    </Box>
  );
}
