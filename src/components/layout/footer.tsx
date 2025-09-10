"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Typography, Stack, Divider, useTheme } from "@mui/material";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";

export default function FooterPage() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        py: 6,
        px: { xs: 2, sm: 3, lg: 8 },
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Box
        maxWidth="1440px"
        mx="auto"
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "repeat(4, 1fr)" }}
        gap={4}
      >
        {/* بخش لوگو و توضیح */}
        <Box>
          <Box
            display="flex"
            justifyContent={{ xs: "center", md: "flex-start" }}
          >
            <Image
              src={"/images/logo2.png"}
              alt="logo"
              width={120}
              height={50}
              className="rounded-[100%] bg-white"
            />
          </Box>
          <Typography
            variant="body2"
            sx={{ mt: 2, color: theme.palette.text.secondary }}
          >
            فروشگاه آنلاین شما برای خرید بهترین محصولات با کیفیت بالا و ارسال
            سریع. هدف ما ارائه بهترین تجربه خرید آنلاین است.
          </Typography>
        </Box>

        {/* لینک‌های سریع */}
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            لینک‌های سریع
          </Typography>
          <Stack spacing={1}>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: theme.palette.text.primary,
              }}
            >
              <Typography
                variant="body2"
                sx={{ "&:hover": { textDecoration: "underline" } }}
              >
                خانه
              </Typography>
            </Link>
            <Link
              href="/product"
              style={{
                textDecoration: "none",
                color: theme.palette.text.primary,
              }}
            >
              <Typography
                variant="body2"
                sx={{ "&:hover": { textDecoration: "underline" } }}
              >
                محصولات
              </Typography>
            </Link>
            <Link
              href="/about-us"
              style={{
                textDecoration: "none",
                color: theme.palette.text.primary,
              }}
            >
              <Typography
                variant="body2"
                sx={{ "&:hover": { textDecoration: "underline" } }}
              >
                درباره ما
              </Typography>
            </Link>
            <Link
              href="/contact-us"
              style={{
                textDecoration: "none",
                color: theme.palette.text.primary,
              }}
            >
              <Typography
                variant="body2"
                sx={{ "&:hover": { textDecoration: "underline" } }}
              >
                ارتباط با ما
              </Typography>
            </Link>
          </Stack>
        </Box>

        {/* اطلاعات تماس */}
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            ارتباط با ما
          </Typography>
          <Stack spacing={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Mail size={18} />{" "}
              <Typography variant="body2">mas.ahm92@gmail.com</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Phone size={18} />{" "}
              <Typography variant="body2">09152238077</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <MapPin size={18} />{" "}
              <Typography variant="body2">ایران، مشهد</Typography>
            </Box>
          </Stack>
        </Box>

        {/* شبکه‌های اجتماعی */}
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            ما را دنبال کنید
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent={{ xs: "center", md: "flex-start" }}
          >
            <Link href="#" aria-label="Facebook">
              <Facebook size={20} style={{ cursor: "pointer" }} />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Instagram size={20} style={{ cursor: "pointer" }} />
            </Link>
            <Link href="#" aria-label="Twitter">
              <Twitter size={20} style={{ cursor: "pointer" }} />
            </Link>
            <Link href="#" aria-label="LinkedIn">
              <Linkedin size={20} style={{ cursor: "pointer" }} />
            </Link>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
