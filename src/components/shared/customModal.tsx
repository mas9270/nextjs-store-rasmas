"use client";
import React from "react";
import { Button, Modal, Divider, Box, CircularProgress } from "@mui/material";
import { useAppSelector } from "@/store/hooks";

export default function CustomModal(props: {
  children?: React.ReactNode;
  active: boolean;
  title?: string;
  onClose: () => void;
}) {
  const { children, active, title, onClose } = props;
  const { loading } = useAppSelector((state) => state.appLoading);

  const handleClose = (e: any, reason: any) => {
    if (reason !== "backdropClick") {
      onClose();
    }
  };

  return (
    <Modal
      open={active}
      onClose={handleClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "auto",
          height: "auto",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
          <Box width={"100%"} padding={"10px"}>
            {title ? title : ""}
          </Box>
          <Divider />
        </Box>

        <Box
          padding={"10px"}
          display={"flex"}
          flexDirection={"column"}
          flexGrow={1}
          sx={{ overflowY: "auto" }}
        >
          {active && children}
        </Box>

        <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
          <Divider />
          <Box p={"10px"} display={"flex"} justifyContent={"end"}>
            <Button
              size="small"
              loading={loading}
              sx={{ width: "100%" }}
              variant="contained"
              onClick={() => {
                onClose();
              }}
              color="error"
            >
              انصراف
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
