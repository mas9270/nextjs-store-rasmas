"use client";

import { useAppSelector } from "@/store/hooks";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Box,
  CircularProgress,
  Stack,
} from "@mui/material";
import { toJalali } from "@/lib/convetDate";

export default function UserProfile() {
  const { data, loading, error } = useAppSelector((state) => state.userInfo);

  if (loading) {
    return (
      <Box
        width="100%"
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        width="100%"
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!data) return null;

  const userInfo: any = data;

  return (
    <Card
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 5,
        p: 3,
        borderRadius: 3,
        boxShadow: 4,
        transition: "all 0.3s ease",
        "&:hover": { boxShadow: 8 },
      }}
    >
      <CardContent>
        <Stack alignItems="center" spacing={2}>
          <Avatar
            sx={{
              width: 90,
              height: 90,
              bgcolor: "primary.main",
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            {userInfo?.name?.charAt(0).toUpperCase()}
          </Avatar>

          <Typography variant="h5" fontWeight="bold">
            {userInfo?.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {userInfo?.email}
          </Typography>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={1.5}>
          <Typography variant="body1">
            <strong>نقش:</strong> {userInfo?.role}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>تاریخ ساخت:</strong>{" "}
            {toJalali(new Date(userInfo?.createdAt))}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>آخرین بروزرسانی:</strong>{" "}
            {toJalali(new Date(userInfo?.updatedAt))}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
