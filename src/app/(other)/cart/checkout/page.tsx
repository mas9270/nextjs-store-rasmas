"use client";
import { Box, Typography, Button, Stack } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="70vh"
      p={4}
      borderRadius={2}
    >
      <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
      <Typography variant="h4" fontWeight="bold" mb={2}>
        پرداخت با موفقیت انجام شد!
      </Typography>
      <Typography variant="body1" mb={4} textAlign="center">
        سفارش شما با موفقیت ثبت شد. شما می‌توانید سفارشات خود را در پروفایل مشاهده کنید.
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button variant="contained" color="primary" onClick={() => router.push("/orders")}>
          مشاهده سفارشات
        </Button>
        <Button variant="outlined" color="primary" onClick={() => router.push("/")}>
          بازگشت به صفحه اصلی
        </Button>
      </Stack>
    </Box>
  );
}
