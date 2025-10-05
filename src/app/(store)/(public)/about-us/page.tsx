"use client";

import React from "react";
import Image from "next/image";
import { Box, Grid, Typography, Paper } from "@mui/material";

export default function AboutUsPage() {
  const values = [
    {
      title: "کیفیت بی‌نظیر",
      description:
        "تمام محصولات پیش از ارسال با دقت بررسی می‌شوند تا بالاترین کیفیت را ارائه دهیم.",
    },
    {
      title: "ارسال سریع و مطمئن",
      description:
        "سفارشات در کمترین زمان پردازش و به دست شما می‌رسند، بدون هیچ تأخیر اضافی.",
    },
    {
      title: "پشتیبانی 24/7",
      description:
        "تیم پشتیبانی ما همیشه آماده پاسخگویی به سوالات و مشکلات شماست، در هر ساعت از شبانه‌روز.",
    },
  ];

  const team = [
    { name: "مسعود", role: "مدیر بخش توسعه", src: "/images/logo2.png" },
    { name: "رسا", role: "مدیر سازمان", src: "/images/logo2.png" },
  ];

  return (
    <Box component="main" sx={{ py: 8, px: { xs: 2, sm: 4, lg: 8 } }}>
      {/* معرفی فروشگاه */}
      <Box textAlign="center" maxWidth="800px" mx="auto" mb={8}>
        <Typography variant="h3" fontWeight="bold" mb={2}>
          درباره فروشگاه ما
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ما یک فروشگاه آنلاین پیشرو هستیم که با تمرکز بر کیفیت و تجربه خرید،
          بهترین محصولات را به مشتریان ارائه می‌دهیم. ماموریت ما ساده است: رضایت
          کامل مشتری و تجربه‌ای آسان و لذت‌بخش از خرید آنلاین.
        </Typography>
      </Box>

      {/* ارزش‌ها */}
      <Grid container spacing={4} maxWidth="1200px" mx="auto" mb={12}>
        {values.map((item, idx) => (
          <Grid sx={{ xs: 12, md: 4 }} key={idx}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                transition: "all 0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={2}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* داستان و مأموریت */}
      <Grid
        container
        spacing={4}
        maxWidth="1200px"
        mx="auto"
        mb={12}
        alignItems="center"
      >
        <Grid sx={{ xs: 12, md: 4 }}>
          <Typography variant="h4" fontWeight="bold" mb={2}>
            داستان ما
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ما با الهام از نیاز مشتریان و بازار آنلاین شروع کردیم و هدفمان ایجاد
            تجربه‌ای است که خرید آنلاین را ساده، مطمئن و لذت‌بخش کند. تیم ما با
            شور و اشتیاق در تلاش است تا هر روز بهتر شود.
          </Typography>
        </Grid>
        <Grid sx={{ xs: 12, md: 4 }}>
          <Typography variant="h4" fontWeight="bold" mb={2}>
            مأموریت ما
          </Typography>
          <Typography variant="body1" color="text.secondary">
            هدف ما ارائه محصولاتی با کیفیت عالی، پشتیبانی بی‌نظیر و تجربه خریدی
            امن و سریع است. ما باور داریم که مشتریان راضی، بهترین سفیر برند ما
            هستند.
          </Typography>
        </Grid>
      </Grid>

      {/* تیم */}
      <Box maxWidth="1200px" mx="auto">
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={6}>
          تیم ما
        </Typography>
        <Grid container spacing={4}>
          {team.map((member, idx) => (
            <Grid sx={{ xs: 12, md: 4 }} key={idx}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  transition: "all 0.3s",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    mx: "auto",
                    mb: 2,
                    borderRadius: "50%",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={member.src}
                    alt={member.name}
                    width={150}
                    height={150}
                    className="object-cover"
                  />
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  {member.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.role}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
