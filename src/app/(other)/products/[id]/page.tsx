"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { reactToastify } from "@/lib/toastify";
import { useAppSelector } from "@/store/hooks";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
};

export default function ProductDetailPage() {
  const { id } = useParams(); // گرفتن id از URL
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { data } = useAppSelector((state) => state.userInfo);

  
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6">محصول پیدا نشد</Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => router.push("/products")}
        >
          بازگشت به محصولات
        </Button>
      </Box>
    );
  }

  return (
    <Box width={{ xs: "90%", sm: "70%", md: "50%" }} mx="auto" mt={5}>
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardMedia
          component="img"
          height="300"
          image={product.images[0]}
          alt={product.title}
        />
        <CardContent>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {product.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            {product.description}
          </Typography>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            💵 {product.price.toLocaleString()} تومان
          </Typography>
          <Typography
            variant="body2"
            color={product.stock > 0 ? "green" : "red"}
            mb={2}
          >
            {product.stock > 0 ? `موجودی: ${product.stock}` : "ناموجود"}
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="secondary"
              disabled={product.stock === 0}
              onClick={() => {
                if (data) {
                } else {
                  reactToastify({
                    type: "warning",
                    message: "ابتدا وارد سایت شوید",
                  });
                }
              }}
            >
              افزودن به سبد
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => router.back()}
            >
              بازگشت
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
