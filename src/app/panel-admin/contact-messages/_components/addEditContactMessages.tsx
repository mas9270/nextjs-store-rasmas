"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Stack, Box } from "@mui/material";
import * as z from "zod";
import { reactToastify } from "@/lib/toastify";
import CustomModal from "@/components/shared/customModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading } from "@/store/slices/appLoading";

type FormValues = {
  name: string;
  email: string;
  password?: string;
};

export default function AddEditContactMessages(props: {
  data: { active: boolean; info: any };
  onClose: (done?: boolean) => void;
}) {
  const { data, onClose } = props;

  return (
    <CustomModal
      active={data.active}
      title={`${data?.info ? "ویرایش" : "افزودن"} کاربر`}
      onClose={() => onClose(false)}
    >
      <Form info={data.info} done={() => onClose(true)} />
    </CustomModal>
  );
}

function Form(props: { info: any; done: () => void }) {
  const { info, done } = props;
  const { loading } = useAppSelector((state) => state.appLoading);
  const dispatch = useAppDispatch();

  const schema = z.object({
    name: z.string().min(1, "نام حداقل باید 1 کاراکتر باشد"),
    email: z.string().email("ایمیل معتبر نیست"),
    password: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!info) {
            // افزودن: پسوورد باید حداقل 6 کاراکتر باشد
            return !!val && val.length >= 6;
          }
          // ویرایش: پسوورد اختیاری، فقط اگر پر شده بررسی شود
          return !val || val.length >= 6;
        },
        {
          message: !info
            ? "رمز عبور حداقل باید 6 کاراکتر باشد"
            : "رمز عبور حداقل باید 6 کاراکتر باشد اگر وارد شود",
        }
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: info?.name || "",
      email: info?.email || "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    dispatch(setLoading({ loading: true }));
    try {
      if (info) {
        // ویرایش کاربر
        await fetch(`/api/users`, {
          method: "PUT",
          body: JSON.stringify({
            id: info.id,
            name: data.name.trim(),
            email: data.email.trim(),
            password: data.password.trim(),
          }),
        });
      } else {
        // افزودن کاربر جدید
        await fetch("/api/users", {
          method: "POST",
          body: JSON.stringify({
            name: data.name.trim(),
            email: data.email.trim(),
            password: data.password.trim(),
          }),
        });
      }
      reactToastify({
        type: "success",
        message: "عملیات با موفقیت انجام شد",
      });
      done();
      dispatch(setLoading({ loading: false }));
    } catch (err: any) {
      reactToastify({
        type: "error",
        message: err?.message || "خطایی رخ داده است",
      });
    }
  };

  return (
    <Box sx={{ width: { xs: "300px", sm: "400px" } }}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2} mt={1}>
          <TextField
            label="نام"
            type="text"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
          />
          <TextField
            label="ایمیل"
            type="text"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />
          <TextField
            label="رمز عبور"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={loading}>
            ذخیره
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
