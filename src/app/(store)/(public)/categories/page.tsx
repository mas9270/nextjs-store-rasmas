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
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Category = {
    id: number;
    name: string;
};

export default function CategoriesPage() {
    const queryClient = useQueryClient();
    const [category, setCategory] = useState<Category[]>([]);
    const [filtered, setFiltered] = useState<Category[]>([]);
    const [search, setSearch] = useState(""); // متن سرچ
    const [debouncedSearch, setDebouncedSearch] = useState(""); // متن با تاخیر
    const [sort, setSort] = useState("");
    const itemsPerPage = 12;
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const [page, setPage] = useState(currentPage);
    const { data } = useAppSelector((state) => state.userInfo);
    const { loading } = useAppSelector((state) => state.appLoading);
    // const [btnLoading, setBtnLoading] = useState<boolean>(false);
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
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategory(data.data);
            setFiltered(data.data);
            dispatch(setLoading({ loading: false }));
        };
        fetchData();
    }, []);

    // جستجو و مرتب‌سازی
    useEffect(() => {
        let data = [...category];
        if (debouncedSearch.trim()) {
            data = data.filter((p) =>
                p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
        }
        // if (sort === "name") data.sort((a, b) => a.name - b.name);

        setFiltered(data);
        setPage(1);
        router.push("?page=1");
    }, [debouncedSearch, sort, category, router]);

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
                            label="جستجو دسته بندی"
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
                        {/* <FormControl sx={{ minWidth: 200 }}>
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
            </FormControl> */}
                    </Stack>

                    {/* لیست محصولات */}

                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        {paginatedData.map((item) => (
                            <Grid key={item.id} size={{ xs: 12, sm: 4, md: 3 }}>
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
                                        image={`https://picsum.photos/200/150?random=${item.id}`}
                                        alt={item.name}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            gutterBottom
                                            noWrap
                                        >
                                            {item.name}
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
                                            // loading={mutation.isPending}
                                            fullWidth
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => router.push(`/products?page=1&category=${item.id}`)}
                                        >
                                            نمایش محصولات این دسته بندی
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
