"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSearchParams, useRouter } from "next/navigation";
import { reactToastify } from "@/lib/toastify";

interface OrderItem {
  id: number;
  product: {
    title: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  total: number;
  items: OrderItem[];
  status: string;
}

export default function SuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const querys = useSearchParams();
  const router = useRouter();
  const orderId = querys?.get("orderId");

  useEffect(() => {
    if (!orderId) {
      router.push("/"); // اگر orderId موجود نبود، بازگشت به صفحه اصلی
      return;
    }

    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setOrder(res.data);
        } else {
          reactToastify({ type: "warning", message: res.message });
          router.push("/");
        }
      })
      .catch((err) => {
        reactToastify({ type: "error", message: err.message });
        router.push("/");
      })
      .finally(() => setLoading(false));
  }, [orderId, router]);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );

  if (!order) return null; // اگر سفارش موجود نبود، دیگر UI نمایش داده نمی‌شود

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flex={1}
      p={2}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 600,
          width: "100%",
          p: 4,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          پرداخت موفق ✅
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          سفارش شما با شماره <strong>{order.id}</strong> با موفقیت ثبت شد!
        </Typography>

        <Typography variant="h6" mt={3} mb={1}>
          جزئیات سفارش:
        </Typography>
        <List sx={{ textAlign: "left" }}>
          {order.items.map((item) => (
            <Box key={item.id}>
              <ListItem>
                <ListItemText
                  primary={item.product.title}
                  secondary={`تعداد: ${
                    item.quantity
                  } × قیمت: ${item.price.toLocaleString()} تومان`}
                />
              </ListItem>
              <Divider />
            </Box>
          ))}
        </List>

        <Typography variant="h6" mt={2}>
          جمع کل: {order.total.toLocaleString()} تومان
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mt={1} mb={3}>
          وضعیت سفارش: {order.status}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/")}
          sx={{ mt: 2, borderRadius: 2 }}
        >
          بازگشت به صفحه اصلی
        </Button>
      </Paper>
    </Box>
  );
}
