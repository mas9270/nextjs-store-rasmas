"use client";

import React, { useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme } from "@/store/slices/muiTheme";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";

export default function MuiProviders(props: { children: React.ReactNode }) {
  const { children } = props;
  return <ThemeConfig>{children}</ThemeConfig>;
}

function ThemeConfig(props: { children: React.ReactNode }) {
  const { mode } = useAppSelector((state) => state.muiTheme);
  const localStorageTheme =
    typeof window !== "undefined" ? localStorage.getItem("theme") : "";
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorageTheme !== "dark" && localStorageTheme !== "light") {
      typeof window !== "undefined"
        ? localStorage.setItem("theme", mode)
        : null;
    } else {
      dispatch(setTheme({ mode: localStorageTheme }));
    }
  }, []);

  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider
        theme={themeConfig(
          localStorageTheme === "dark" || localStorageTheme === "light"
            ? localStorageTheme
            : mode
        )}
      >
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </CacheProvider>
  );
}

function themeConfig(theme: "dark" | "light") {
  switch (theme) {
    case "dark":
      const dark = createTheme({
        direction: "rtl",
        palette: {
          mode: "dark",
          divider: "rgba(255, 255, 255, 0.12)",
          // primary: {
          //     main: '#90caf9', // آبی روشن
          // },
          // secondary: {
          //     main: '#f48fb1', // صورتی کم‌رنگ
          // },
          // background: {
          //     default: '#121212',
          //     paper: '#1e1e1e',
          // },
          // text: {
          //     primary: '#ffffff',
          //     secondary: '#b0bec5',
          // },
        },
        typography: {
          fontFamily: ["IRANSansX"].join(","),
        },
      });
      return dark;
    case "light":
      const light = createTheme({
        direction: "rtl",
        palette: {
          mode: "light",
          divider: "rgba(0, 0, 0, 0.12)",
          // primary: {
          //     main: '#1976d2', // آبی اصلی MUI
          // },
          // secondary: {
          //     main: '#ff4081', // صورتی زنده
          // },
          // background: {
          //     default: '#f5f5f5',
          //     paper: '#ffffff',
          // },
        },
        typography: {
          fontFamily: ["IRANSansX"].join(","),
        },
      });
      return light;
  }
}
