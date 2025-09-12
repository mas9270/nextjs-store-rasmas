"use client";
import React from "react";
import { Box, Button, CssBaseline } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import {
  LogOut,
  CircleUserRound,
  ShieldUser,
  FolderKanban,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { checkToken } from "@/store/slices/userInfo";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function RegisterLoginUserMneu() {
  const { data } = useAppSelector((state) => state.userInfo);

  return <Box>{data ? <User /> : <LoginRegister />}</Box>;
}

function User() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data } = useAppSelector((state) => state.userInfo);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    setAnchorEl(null);
    exit();
  };

  const goToPanelAdmin = () => {
    setAnchorEl(null);
    router.push("/panel-admin");
  };

  const goToProfile = () => {
    setAnchorEl(null);
    router.push("/profile");
  };

  const goToOrders = () => {
    setAnchorEl(null);
    router.push("/profile/orders");
  };

  function exit() {
    fetch("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({}),
    }).then(() => {
      dispatch(checkToken());
    });
  }

  return (
    <>
      <Tooltip title="تنظیمات کاربر">
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <CircleUserRound />
          </ListItemIcon>
          مسعود احمدیان
        </MenuItem>
        {data && data?.role === "ADMIN" && (
          <MenuItem onClick={goToPanelAdmin}>
            <ListItemIcon>
              <ShieldUser />
            </ListItemIcon>
            پنل ادمین
          </MenuItem>
        )}
        {data && (data?.role === "ADMIN" || data?.role === "USER") && (
          <MenuItem onClick={goToProfile}>
            <ListItemIcon>
              <FolderKanban />
            </ListItemIcon>
            پروفایل
          </MenuItem>
        )}

        {data && (data?.role === "ADMIN" || data?.role === "USER") && (
          <MenuItem onClick={goToOrders}>
            <ListItemIcon>
              <FolderKanban />
            </ListItemIcon>
            سفارشات
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <LogOut />
            {/* <Logout fontSize="small" /> */}
          </ListItemIcon>
          خروج
        </MenuItem>
      </Menu>
    </>
  );
}

function LoginRegister() {
  const router = useRouter();
  const matches = useMediaQuery("(min-width:900px)");
  return (
    <Box display={"flex"} gap={1}>
      <Button
        title="ورود"
        sx={{ minWidth: "10px" }}
        size="small"
        variant="contained"
        onClick={() => {
          router.push("/login");
        }}
      >
        <Box display={"flex"} alignItems={"center"} gap={1}>
          <LogIn size={18} />
          {matches && "ورود"}
        </Box>
      </Button>
      <Button
        title="ثبت نام"
        sx={{ minWidth: "10px" }}
        size="small"
        variant="contained"
        onClick={() => {
          router.push("/register");
        }}
      >
        <Box display={"flex"} alignItems={"center"} gap={1}>
          <UserPlus size={18} />
          {matches && "ثبت نام"}
        </Box>
      </Button>
    </Box>
  );
}
