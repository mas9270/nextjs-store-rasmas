"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Paper,
} from "@mui/material";
import { Mail, Lock, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading } from "@/store/slices/appLoading";
import { reactToastify } from "@/lib/toastify";
import { useRouter } from "next/navigation";

// --- تعریف اسکیمای اعتبارسنجی با Zod ---
const registerSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const loading = useAppSelector((state) => state.appLoading.loading);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = (values: RegisterFormData) => {
    dispatch(setLoading({ loading: true }));

    fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) {
          reactToastify({
            type: "warning",
            message: res?.message,
          });
        } else {
          reactToastify({
            type: "success",
            message: res?.message,
          });
          router.push("/login");
        }
        dispatch(setLoading({ loading: false }));
      })
      .catch((error) => {
        reactToastify({
          type: "warning",
          message: error?.message
            ? error?.message
            : "خطایی رخ داده است دوباره تلاش کنید یا به مدیر سیستم اطلاع دهید",
        });
        dispatch(setLoading({ loading: false }));
      });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={"100%"}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: 400 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          ثبت‌ نام
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* نام */}
          <TextField
            size="small"
            label="نام"
            fullWidth
            margin="normal"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={20} />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* ایمیل */}
          <TextField
            size="small"
            label="ایمیل"
            type="email"
            fullWidth
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={20} />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* رمز عبور */}
          <TextField
            size="small"
            label="رمز عبور"
            type="password"
            fullWidth
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            loading={loading}
            disabled={loading}
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, borderRadius: 2 }}
          >
            ثبت‌نام
          </Button>
        </form>
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2, color: "text.secondary" }}
        >
          قبلاً ثبت‌ نام کرده‌اید؟{" "}
          <Link
            onClick={(e) => loading && e.preventDefault()}
            href="/login"
            style={{
              color: "#1976d2",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            ورود به حساب
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
