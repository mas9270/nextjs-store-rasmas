import { Box } from "@mui/material";
import React from "react";

export default function PanelAdminPage() {
  return (
    <Box display={"flex"} width={"100%"} flexWrap={"wrap"} gap={5}>
      {Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i % 2 === 0 ? "user" : "editor",
        createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString(),
      })).map((item, index) => {
        return <Box key={index}>{item.email}</Box>;
      })}
    </Box>
  );
}
