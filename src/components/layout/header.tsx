"use client";
import { Box } from "@mui/material";
import React from "react";
import Image from "next/image";
import ToggleTheme from "../shared/toggleTheme";
import NavLink from "../shared/navLink";
import CartIcon from "../shared/cartIcon";
import RegisterLoginUserMneu from "../shared/registerLoginUserMneu";

export default function Header() {
  return (
    <Box
      component={"header"}
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        component={"nav"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
        maxWidth={"1200px"}
        py={1}
        px={2}
      >
        <Box component={"div"} display={"flex"} alignItems={"center"} gap={3}>
          <Image
            src={"/images/logo2.png"}
            alt="logo"
            width={50}
            height={50}
            className="rounded-[100%] bg-white"
          />
          <NavLink />
        </Box>
        <Box component={"div"} display={"flex"} alignItems={"center"} gap={3}>
          <CartIcon />
          <ToggleTheme />
          <RegisterLoginUserMneu/>
        </Box>
      </Box>
      <Box
        width={"100%"}
        sx={(theme) => ({
          borderBottom: `2px solid ${theme.palette.divider}`,
        })}
      />
    </Box>
  );
}
