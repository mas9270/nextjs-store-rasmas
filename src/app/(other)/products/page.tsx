"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Pagination,
  Stack,
  Button,
  CardActions,
  CircularProgress,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { reactToastify } from "@/lib/toastify";
import { setLoading } from "@/store/slices/appLoading";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState(""); // متن سرچ
  const [debouncedSearch, setDebouncedSearch] = useState(""); // متن با تاخیر
  const [sort, setSort] = useState("");
  const itemsPerPage = 6;
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [page, setPage] = useState(currentPage);
  const { data } = useAppSelector((state) => state.userInfo);
  const { loading } = useAppSelector((state) => state.appLoading);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  // sync page state with query
  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  // debounce search (۱ ثانیه تاخیر)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    return () => {
      clearTimeout(handler); // اگر کاربر تایپ ادامه داد، تایمر قبلی لغو میشه
    };
  }, [search]);

  // دریافت داده‌ها از API
  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading({ loading: true }));
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
      setFiltered(data);
      dispatch(setLoading({ loading: false }));
    };
    fetchData();
  }, []);

  // جستجو و مرتب‌سازی
  useEffect(() => {
    let data = [...products];
    if (debouncedSearch.trim()) {
      data = data.filter((p) =>
        p.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    if (sort === "priceAsc") data.sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") data.sort((a, b) => b.price - a.price);
    if (sort === "stock") data.sort((a, b) => b.stock - a.stock);

    setFiltered(data);
    setPage(1);
    router.push("?page=1");
  }, [debouncedSearch, sort, products, router]);

  // محاسبه صفحه‌بندی
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  // تغییر صفحه
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    router.push(`?page=${value}`);
  };

  function addToCart(item: { id: number | null }) {
    setBtnLoading(true);
    if (item.id) {
      fetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId: item.id, quantity: 0 }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            reactToastify({
              type: "success",
              message: "کالا با موفقیت به سبد خرید افزوده شد",
            });
          } else {
            reactToastify({
              type: "success",
              message: res.message,
            });
          }
          setBtnLoading(false);
        })
        .catch((err) => {
          reactToastify({
            type: "error",
            message: "خطایی رخ داده است دوباره تلاش کنید",
          });
          setBtnLoading(false);
        });
    }
  }

  return (
    <Box width={"100%"}>
      {!loading && (
        <>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            mb={3}
            alignItems="center"
          >
            {/* فیلد جستجو با دکمه Clear */}
            <TextField
              size="small"
              label="جستجو محصول"
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              slotProps={{
                input: {
                  endAdornment: search && (
                    <Button
                      onClick={() => setSearch("")}
                      size="small"
                      color="error"
                    >
                      ✖
                    </Button>
                  ),
                },
              }}
            />

            {/* فیلد مرتب سازی */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="sort-label" size="small">
                مرتب‌ سازی
              </InputLabel>
              <Select
                size="small"
                label="مرتب سازی"
                labelId="sort-label"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <MenuItem value="">بدون مرتب‌سازی</MenuItem>
                <MenuItem value="priceAsc">قیمت (کم به زیاد)</MenuItem>
                <MenuItem value="priceDesc">قیمت (زیاد به کم)</MenuItem>
                <MenuItem value="stock">موجودی</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {/* لیست محصولات */}

          <Grid container spacing={{ xs: 2, md: 3 }}>
            {paginatedData.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 4, md: 3 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 4,
                    transition: "0.3s",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: 8 },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images[0]}
                    alt={product.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      noWrap
                    >
                      {product.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mb={1}
                      noWrap
                    >
                      {product.description}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      💵 {product.price.toLocaleString()} تومان
                    </Typography>
                    <Typography
                      variant="body2"
                      color={product.stock > 0 ? "green" : "red"}
                    >
                      {product.stock > 0
                        ? `موجودی: ${product.stock}`
                        : "ناموجود"}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      px: 2,
                      pb: 2,
                    }}
                  >
                    <Button
                      loading={btnLoading}
                      fullWidth
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      نمایش
                    </Button>
                    <Button
                      loading={btnLoading}
                      fullWidth
                      size="small"
                      variant="contained"
                      color="secondary"
                      disabled={product.stock === 0}
                      onClick={() => {
                        console.log(data);
                        if (data) {
                          addToCart({ id: product?.id ? product?.id : null });
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
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* صفحه‌بندی */}

          <Stack alignItems="center" mt={4}>
            <Pagination
              count={Math.ceil(filtered.length / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Stack>
        </>
      )}

      {loading && (
        <Box
          sx={{
            width: "100%",
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
