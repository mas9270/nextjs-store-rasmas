"use client";
import React from "react";
import { Box, Button } from "@mui/material";
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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { checkToken } from "@/store/slices/userInfo";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

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

  function exit() {
    fetch("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({}),
    }).then(() => {
      dispatch(checkToken());
    });
  }

  return (
    <Box>
      <Tooltip title="تنظیمات کاربر">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
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
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <LogOut />
            {/* <Logout fontSize="small" /> */}
          </ListItemIcon>
          خروج
        </MenuItem>
      </Menu>
    </Box>
  );
}

function LoginRegister() {
  const router = useRouter();
  return (
    <Box>
      <Button
        size="small"
        variant="contained"
        onClick={() => {
          router.push("/login");
        }}
      >
        ورود / ثبت نام
      </Button>
    </Box>
  );
}
