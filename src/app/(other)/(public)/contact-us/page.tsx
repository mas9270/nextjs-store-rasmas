"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Grid,
  Stack,
  Typography,
  TextField,
  Button,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";

// اعتبارسنجی فرم با Zod
const contactSchema = z.object({
  name: z.string().min(2, "نام باید حداقل 2 کاراکتر باشد"),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  subject: z.string().min(5, "موضوع باید حداقل 5 کاراکتر باشد"),
  message: z.string().min(10, "پیام باید حداقل 10 کاراکتر باشد"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactUs() {
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormValues) => {
    alert("پیام شما با موفقیت ارسال شد!");
  };

  return (
    <Box
      component="main"
      sx={{ py: 8, px: { xs: 2, sm: 4, lg: 8 }, minHeight: "100vh" }}
    >
      {/* معرفی صفحه */}
      <Box textAlign="center" maxWidth="800px" mx="auto" mb={8}>
        <Typography variant="h3" component="h1" fontWeight="bold" mb={2}>
          با ما در ارتباط باشید
        </Typography>
        <Typography variant="body1" color="text.secondary">
          هر سوال، پیشنهاد یا نظری دارید، تیم ما آماده پاسخگویی به شماست. لطفاً
          از فرم زیر استفاده کنید یا از اطلاعات تماس ما بهره ببرید.
        </Typography>
      </Box>

      {/* فرم تماس */}
      <Box maxWidth="600px" mx="auto" mb={12}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              label="نام شما"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />
            <TextField
              label="ایمیل شما"
              type="email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />
            <TextField
              label="موضوع"
              {...register("subject")}
              error={!!errors.subject}
              helperText={errors.subject?.message}
              fullWidth
            />
            <TextField
              label="پیام شما"
              {...register("message")}
              error={!!errors.message}
              helperText={errors.message?.message}
              fullWidth
              multiline
              rows={8}
            />
            <Button type="submit" variant="contained" size="large" fullWidth>
              ارسال پیام
            </Button>
          </Stack>
        </form>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* اطلاعات تماس */}
      <Grid container spacing={4} justifyContent="center" textAlign="center">
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={1} alignItems="center">
            <Mail size={24} />
            <Typography variant="h6" fontWeight="bold">
              ایمیل
            </Typography>
            <Typography color="text.secondary">mas.ahm92@gmail.com</Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={1} alignItems="center">
            <Phone size={24} />
            <Typography variant="h6" fontWeight="bold">
              تلفن
            </Typography>
            <Typography color="text.secondary">09152238077</Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={1} alignItems="center">
            <MapPin size={24} />
            <Typography variant="h6" fontWeight="bold">
              آدرس
            </Typography>
            <Typography color="text.secondary">ایران، مشهد</Typography>
          </Stack>
        </Grid>
      </Grid>

      {/* شبکه‌های اجتماعی */}
      <Box textAlign="center" mt={10}>
        <Typography variant="h4" fontWeight="bold" mb={2}>
          ما را در شبکه‌های اجتماعی دنبال کنید
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          برای دریافت اخبار، تخفیف‌ها و اطلاع‌رسانی‌ها ما را دنبال کنید.
        </Typography>
        <Stack direction="row" spacing={4} justifyContent="center">
          <a href="#" aria-label="Facebook">
            <Facebook size={24} style={{ cursor: "pointer" }} />
          </a>
          <a href="#" aria-label="Instagram">
            <Instagram size={24} style={{ cursor: "pointer" }} />
          </a>
          <a href="#" aria-label="Twitter">
            <Twitter size={24} style={{ cursor: "pointer" }} />
          </a>
          <a href="#" aria-label="LinkedIn">
            <Linkedin size={24} style={{ cursor: "pointer" }} />
          </a>
        </Stack>
      </Box>
    </Box>
  );
}
