"use client";
import { IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setTheme } from "@/store/slices/muiTheme";
import { Sun, Moon } from "lucide-react"; // آیکن‌ها از lucide-react

export default function ToggleTheme() {
  const { mode } = useAppSelector((state) => state.muiTheme);
  const dispatch = useAppDispatch();

  const handleToggle = () => {
    const newMode = mode === "light" ? "dark" : "light";
    localStorage.setItem("theme", newMode);
    dispatch(setTheme({ mode: newMode }));
  };

  return (
    <IconButton
      onClick={handleToggle}
      sx={{
        borderRadius: "50%",
        padding: "8px",
        backgroundColor: mode === "light" ? "#ffecb3" : "#263238",
        color: mode === "light" ? "#f57f17" : "#fff",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: mode === "light" ? "#ffe082" : "#37474f",
        },
      }}
    >
      {mode === "light" ? <Sun size={20} /> : <Moon size={20} />}
    </IconButton>
  );
}
