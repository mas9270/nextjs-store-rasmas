"use client";

import { Button, Modal, Divider, Box } from "@mui/material";
import { reactToastify } from "@/lib/toastify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading } from "@/store/slices/appLoading";

export default function DeleteUser(props: {
  data: { active: boolean; info: any };
  onClose: (done?: boolean) => void;
}) {
  const { data, onClose } = props;
  const handleClose = () => onClose(false);
  const { loading } = useAppSelector((state) => state.appLoading);
  const dispatch = useAppDispatch();

  function deleteAction() {
    dispatch(setLoading({ loading: true }));
    fetch(`/api/products`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: data.info.id }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.error) {
          reactToastify({
            type: "error",
            message: res.error,
          });
        } else {
          reactToastify({
            type: "success",
            message: res.message,
          });
          onClose(true);
        }
        dispatch(setLoading({ loading: false }));
      })
      .catch(() => {
        reactToastify({
          type: "error",
          message: "خطایی رخ داده است دوباره تلاش کنید",
        });
        dispatch(setLoading({ loading: false }));
      });
  }

  return (
    <Modal
      open={data.active}
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
          // width: "400px",
          maxHeight: "calc(100vw - 50px)",
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
            حذف محصول {data.info && `(${data.info.title})`}
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
          <Box
            width={"100"}
            height={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            آیا از انجام این عملیات اطمینان دارید؟
          </Box>
        </Box>

        <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
          <Divider />
          <Box p={"10px"} display={"flex"} justifyContent={"end"} gap={2}>
            <Button
              loading={loading}
              sx={{ width: "100%" }}
              variant="contained"
              onClick={() => {
                deleteAction();
              }}
              color="success"
            >
              ذخیره
            </Button>
            <Button
              loading={loading}
              sx={{ width: "100%" }}
              variant="contained"
              onClick={handleClose}
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
