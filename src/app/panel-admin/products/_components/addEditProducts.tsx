"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TextField, Button, Stack, Box, MenuItem } from "@mui/material";
import CustomModal from "@/components/shared/customModal";
import { reactToastify } from "@/lib/toastify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading } from "@/store/slices/appLoading";

type FormValues = {
  title: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
};

export default function AddEditProduct(props: {
  data: { active: boolean; info?: any };
  onClose: (done?: boolean) => void;
}) {
  const { data, onClose } = props;
  return (
    <CustomModal
      active={data.active}
      title={`${data?.info ? "ویرایش" : "افزودن"} محصول`}
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
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  const schema = z.object({
    title: z.string().min(1, "عنوان محصول حداقل باید 1 کاراکتر باشد"),
    description: z.string().min(1, "توضیحات محصول الزامی است"),
    price: z.number().positive("قیمت باید مثبت باشد"),
    stock: z.number().int().nonnegative("موجودی باید عدد صحیح غیرمنفی باشد"),
    categoryId: z.number().min(1, "انتخاب دسته‌بندی الزامی است"),
  });

  const { register, handleSubmit, formState, setValue, watch } =
    useForm<FormValues>({
      defaultValues: {
        title: info?.title || "",
        description: info?.description || "",
        price: info?.price || 0,
        stock: info?.stock || 0,
        categoryId: +info?.categoryId || 0,
      },
      resolver: zodResolver(schema),
    });

  // دریافت دسته‌بندی‌ها از API
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((res) => {
        setCategories(res.data)
        // setValue("categoryId", +info?.categoryId || 0)
      })
      .catch(() =>
        reactToastify({ type: "error", message: "خطا در دریافت دسته‌بندی‌ها" })
      );
  }, []);



  const onSubmit = async (data: FormValues) => {
    dispatch(setLoading({ loading: true }));
    try {
      if (info) {
        fetch("/api/products", {
          method: "PUT",
          body: JSON.stringify({ id: info.id, ...data })
        })
          .then(() => {
            reactToastify({ type: "success", message: "عملیات با موفقیت انجام شد" });
            done();
          })
      } else {
        await fetch("/api/products", {
          method: "POST",
          body: JSON.stringify(data),
        })
          .then(() => {
            reactToastify({ type: "success", message: "عملیات با موفقیت انجام شد" });
            done();
          })
      }
      dispatch(setLoading({ loading: false }));

    } catch (err: any) {
      reactToastify({
        type: "error",
        message: err?.message || "خطایی رخ داده است",
      });
      dispatch(setLoading({ loading: false }));
    }
  };

  return (
    <Box sx={{ width: { xs: "300px", sm: "400px" } }}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2} mt={1}>
          <TextField
            size="small"
            label="عنوان"
            {...register("title")}
            error={!!formState.errors.title}
            helperText={formState.errors.title?.message}
            fullWidth
          />

          <TextField
            size="small"
            label="قیمت"
            type="number"
            {...register("price", { valueAsNumber: true })}
            error={!!formState.errors.price}
            helperText={formState.errors.price?.message}
            fullWidth
          />
          <TextField
            size="small"
            label="موجودی"
            type="number"
            {...register("stock", { valueAsNumber: true })}
            error={!!formState.errors.stock}
            helperText={formState.errors.stock?.message}
            fullWidth
          />
          <TextField
            size="small"
            select
            label="دسته‌بندی"
            type="number"
            value={watch("categoryId")}
            {...register("categoryId", { valueAsNumber: true })}
            error={!!formState.errors.categoryId}
            helperText={formState.errors.categoryId?.message}
            fullWidth
          >
            <MenuItem value={0} disabled>
              انتخاب دسته‌بندی
            </MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label="توضیحات"
            {...register("description")}
            error={!!formState.errors.description}
            helperText={formState.errors.description?.message}
            fullWidth
            multiline
            rows={8}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            loading={loading}
            size="small"
          >
            ذخیره
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
