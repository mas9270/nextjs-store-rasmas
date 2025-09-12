"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Stack, Box } from "@mui/material";
import * as z from "zod";
import { reactToastify } from "@/lib/toastify";
import CustomModal from "@/components/shared/customModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading } from "@/store/slices/appLoading";

type FormValues = {
  subject: string;
  replyMessage: string;
};

export default function SendMessageToContact(props: {
  data: { active: boolean; info: { email: string; subject?: string } };
  onClose: (done?: boolean) => void;
}) {
  const { data, onClose } = props;

  return (
    <CustomModal
      active={data.active}
      title={`پاسخ به پیام ${data?.info?.email}`}
      onClose={() => onClose(false)}
    >
      <Form info={data.info} done={() => onClose(true)} />
    </CustomModal>
  );
}

function Form(props: {
  info: { email: string; subject?: string };
  done: () => void;
}) {
  const { info, done } = props;
  const { loading } = useAppSelector((state) => state.appLoading);
  const dispatch = useAppDispatch();

  const schema = z.object({
    subject: z.string().min(1, "موضوع الزامی است"),
    replyMessage: z.string().min(1, "متن پاسخ الزامی است"),
  });

  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      subject: info.subject ? `${info.subject}` : "",
      replyMessage: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    dispatch(setLoading({ loading: true }));
    try {
      await fetch("/api/contact-messages", {
        method: "PATCH",
        body: JSON.stringify({
          email: info.email,
          subject: data.subject.trim(),
          replyMessage: data.replyMessage.trim(),
        }),
      });
      reactToastify({
        type: "success",
        message: "پاسخ با موفقیت ارسال شد",
      });
      done();
    } catch (err: any) {
      reactToastify({
        type: "error",
        message: err?.message || "خطایی رخ داده است",
      });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  };

  return (
    <Box sx={{ width: { xs: "300px", sm: "400px" } }}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2} mt={1}>
          <TextField
            label="موضوع"
            type="text"
            {...register("subject")}
            error={!!formState.errors.subject}
            helperText={formState.errors.subject?.message}
            fullWidth
            size="small"
          />
          <TextField
            label="متن پاسخ"
            multiline
            rows={4}
            {...register("replyMessage")}
            error={!!formState.errors.replyMessage}
            helperText={formState.errors.replyMessage?.message}
            fullWidth
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            size="small"
          >
            ارسال پاسخ
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
