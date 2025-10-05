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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const { loading } = useAppSelector((state) => state.appLoading);
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cart"],
    queryFn: async (e) => {
      const res = await fetch("/api/cart");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async ({
      id,
      newQuantity,
      productId,
      type,
    }: {
      id: number;
      newQuantity: number;
      productId: number;
      type: "add" | "delete";
    }) => {
      if (type === "add") {
        const res = await fetch("/api/cart", {
          method: "POST",
          body: JSON.stringify({ productId, quantity: newQuantity }),
        });
        const finalData: any = await res.json();
        if (finalData?.success) {
          reactToastify({
            type: "success",
            message: "کالا با موفقیت به سبد خرید افزوده شد",
          });
          return finalData.data;
        } else {
          reactToastify({
            type: "warning",
            message: finalData?.message,
          });
          return finalData;
        }
      } else {
        const res = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        const data = await res.json();
        if (data.success) {
          reactToastify({
            type: "success",
            message: data?.message,
          });
          return data.data;
        } else {
          reactToastify({
            type: "warning",
            message: data?.message,
          });
          return data.data;
        }
      }
    },
    onError: (err) => {
      reactToastify({
        type: "error",
        message: "خطایی رخ داده است دوباره تلاش کنید",
      });
    },
    onMutate: (e) => {},
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // افزایش/کاهش تعداد
  const updateQuantity = async (
    itemId: number,
    delta: number,
    productId: number
  ) => {
    if (!data?.data) return;
    const item = data?.data?.items.find((i: any) => i.id === +itemId);
    if (!item) return;
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;
    mutation.mutate({ id: itemId, newQuantity, productId, type: "add" });
  };

  // حذف محصول
  const removeItem = async (itemId: number, productId: number) => {
    const cart = data?.data;
    if (!cart) return;
    const item = cart.items.find((i: any) => i.id === itemId);
    if (!item) return;
    mutation.mutate({ id: itemId, newQuantity: 0, productId, type: "delete" });
  };

  const handleCheckout = async () => {
    setBtnLoading(true);
    fetch("/api/orders", { method: "POST" })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          reactToastify({ type: "success", message: res.message });
          queryClient.invalidateQueries({ queryKey: ["cart"] });
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
  // if (loading) {
  //   return (
  //     <Box
  //       display="flex"
  //       width="100%"
  //       flex={1}
  //       justifyContent="center"
  //       alignItems="center"
  //     >
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  // سبد خرید خالی
  if (!data?.data?.items || data?.data?.items?.length === 0) {
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
        {data?.data?.items.map((item: any) => (
          <Card
            key={item.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <Box display="flex" alignItems="flex-start" p={2}>
              <Box
                component="img"
                src={item.product.images[0]}
                alt={item.product.title}
                sx={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 2,
                  mr: 2,
                }}
              />
              <CardContent sx={{ flex: 1, p: 0 }}>
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
            </Box>
            <Divider />
            <CardActions sx={{ justifyContent: "space-between" }}>
              <Box>
                <IconButton
                  loading={btnLoading || mutation.isPending}
                  onClick={() => updateQuantity(item.id, -1, item.product.id)}
                  size="small"
                >
                  <RemoveIcon />
                </IconButton>
                <IconButton
                  loading={btnLoading || mutation.isPending}
                  onClick={() => updateQuantity(item.id, 1, item.product.id)}
                  size="small"
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <IconButton
                loading={btnLoading || mutation.isPending}
                onClick={() => removeItem(item.id, item.product.id)}
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
          loading={btnLoading || mutation.isPending}
        >
          ثبت سفارش
        </Button>
      </Box>
    </Box>
  );
}
