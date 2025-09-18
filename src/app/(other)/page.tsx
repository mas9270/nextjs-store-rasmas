"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  images: string[];
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products"),
        ]);
        const cats = await catRes.json();
        const prods = await prodRes.json();
        setCategories(cats);
        setProducts(prods);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box mb={6}>
        <Swiper spaceBetween={10} slidesPerView={1} loop autoplay>
          {products?.slice(0, 5).map((item, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  backgroundImage: `url(${
                    item.images[0] || "https://picsum.photos/1600/600"
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: { xs: 250, md: 400 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  bgcolor="rgba(0,0,0,0.5)"
                  p={1}
                  borderRadius={1}
                >
                  {item.title}
                </Typography>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* دسته‌بندی‌ها */}
      <Container sx={{ my: 6 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" fontWeight="bold">
            دسته‌بندی‌ها
          </Typography>
          <Link href="/categories" passHref>
            <Button variant="text">مشاهده همه</Button>
          </Link>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            py: 1,
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: 3,
            },
          }}
        >
          {categories.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.id}`} passHref>
              <Card
                sx={{
                  width: 200,
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 3,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                  flexShrink: 0,
                }}
              >
                <CardMedia
                  component="img"
                  height="120"
                  image={`https://picsum.photos/200/150?random=${cat.id}`}
                  alt={cat.name}
                />
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    textAlign="center"
                  >
                    {cat.name}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Box>
      </Container>

      {/* محصولات برتر افقی */}
      <Container sx={{ my: 6 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" fontWeight="bold">
            محصولات برتر
          </Typography>
          <Link href="/products" passHref>
            <Button variant="text">مشاهده همه</Button>
          </Link>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            py: 1,
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: 3,
            },
          }}
        >
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} passHref>
              <Card
                sx={{
                  width: 200,
                  borderRadius: 2,
                  boxShadow: 2,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.03)" },
                  flexShrink: 0,
                }}
              >
                <CardMedia
                  component="img"
                  height="120"
                  image={product.images?.[0]}
                  alt={product.title}
                />
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    textAlign="center"
                  >
                    {product.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    {product.price} تومان
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
