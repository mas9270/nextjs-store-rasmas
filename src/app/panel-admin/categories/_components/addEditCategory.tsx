"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TextField, Button, Stack, Box } from "@mui/material";
import CustomModal from "@/components/shared/customModal";
import { reactToastify } from "@/lib/toastify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading } from "@/store/slices/appLoading";

type FormValues = {
  name: string;
};

export default function AddEditCategory(props: {
  data: { active: boolean; info?: any };
  onClose: (done?: boolean) => void;
}) {
  const { data, onClose } = props;

  return (
    <CustomModal
      active={data.active}
      title={`${data?.info ? "ویرایش" : "افزودن"} دسته‌بندی`}
      onClose={() => onClose(false)}
    >
      <Form info={data.info} done={() => onClose(true)} />
    </CustomModal>
  );
}

function Form(props: { info?: any; done: () => void }) {
  const { info, done } = props;
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.appLoading);

  const schema = z.object({
    name: z.string().min(1, "نام دسته‌بندی الزامی است"),
  });

  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      name: info?.name || "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    dispatch(setLoading({ loading: true }));
    try {
      if (info) {
        // ویرایش
        await fetch("/api/categories", {
          method: "PUT",
          body: JSON.stringify({ id: info.id, name: data.name.trim() }),
        });
      } else {
        // افزودن
        await fetch("/api/categories", {
          method: "POST",
          body: JSON.stringify({ name: data.name.trim() }),
        });
      }
      reactToastify({ type: "success", message: "عملیات با موفقیت انجام شد" });
      done();
    } catch (err: any) {
      reactToastify({ type: "error", message: err?.message || "خطایی رخ داده است" });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  };

  return (
    <Box sx={{ width: { xs: "250px", sm: "350px" } }}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2} mt={1}>
          <TextField
            size="small"
            label="نام دسته‌بندی"
            {...register("name")}
            error={!!formState.errors.name}
            helperText={formState.errors.name?.message}
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={loading} size="small">
            ذخیره
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
