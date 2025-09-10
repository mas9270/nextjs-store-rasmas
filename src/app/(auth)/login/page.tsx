"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@mui/material";
import { Mail, Lock } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { setLoading } from "@/store/slices/appLoading";
import { reactToastify } from "@/lib/toastify";
import { checkToken } from "@/store/slices/userInfo";

const schema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });
  const loading = useAppSelector((state) => state.appLoading.loading);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = (values: LoginForm) => {
    dispatch(setLoading({ loading: true }));
    fetch("/api/auth/login", {
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
          dispatch(setLoading({ loading: false }));
          dispatch(checkToken());
          router.push("/");
        }
        dispatch(setLoading({ loading: false }));
      })
      .catch((error) => {
        console.log("error", error);
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
      <Card
        sx={{ maxWidth: 400, width: "100%", borderRadius: 3, boxShadow: 6 }}
      >
        <CardContent>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            fontWeight="bold"
            sx={{ color: "#1976d2" }}
          >
            ورود به حساب
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              size="small"
              label="ایمیل"
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
              size="small"
              type="submit"
              fullWidth
              variant="contained"
              loading={loading}
              disabled={loading}
            >
              ورود
            </Button>
          </form>

          {/* بخش رفتن به ثبت‌نام */}
          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 2, color: "text.secondary" }}
          >
            حساب کاربری ندارید؟{" "}
            <Link
              onClick={(e) => loading && e.preventDefault()}
              href="/register"
              style={{ color: "#1976d2", fontWeight: 500 }}
            >
              ثبت‌ نام کنید
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
