import { Box } from "@mui/material";
import React from "react";

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <Box
      component={"main"}
      width={"100%"}
      display={"flex"}
      flex={1}
      justifyContent={"center"}
    >
      <Box width={"100%"} maxWidth={"1200px"} px={2} py={3}>
        {children}
      </Box>
    </Box>
  );
}
