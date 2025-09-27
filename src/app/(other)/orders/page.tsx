"use client";
import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { RefreshCcw, Paperclip } from "lucide-react";
import { reactToastify } from "@/lib/toastify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading } from "@/store/slices/appLoading";
import { toJalali } from "@/lib/convetDate";
import { Info } from "@mui/icons-material";

interface OrderItem {
  id: number;
  product: {
    title: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  userId: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [rows, setRows] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { loading } = useAppSelector((state) => state.appLoading);
  const dispatch = useAppDispatch();

  const columns: GridColDef[] = [
    { field: "id", headerName: "شناسه سفارش", width: 150 },
    { field: "total", headerName: "جمع کل", width: 150 },
    { field: "status", headerName: "وضعیت", width: 150 },
    {
      field: "createdAt",
      headerName: "تاریخ ایجاد",
      width: 200,
      renderCell: (params) => <Box>{toJalali(params.row.createdAt)}</Box>,
    },
    {
      field: "action",
      headerName: "عملیات",
      width: 150,
      renderCell: (params) => (
        <Box display={"flex"} alignItems={"center"} height={"100%"} gap={1}>
          <Info
            color="info"
            cursor={"pointer"}
            onClick={() => {
              setSelectedOrder(params.row);
            }}
          />
        </Box>
      ),
    },
  ];

  async function getData() {
    dispatch(setLoading({ loading: true }));
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setRows(data.data);
    } catch (err: any) {
      reactToastify({ type: "error", message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">مدیریت سفارش‌ها</Typography>
        <Button
          variant="contained"
          color="success"
          onClick={getData}
          startIcon={<RefreshCcw size={18} />}
        >
          بازنشانی
        </Button>
      </Box>

      <DataGrid
        sx={{ width: "100%", flex: 1 }}
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 20, page: 0 } },
        }}
        loading={loading}
        localeText={{
          // filterOperatorDoesNotContain: "wwww",
          // filterOperatorDoesNotEqual: "wwww",
          // filterPanelLogicOperator: "Ww",
          filterPanelOperator: "شامل",
          filterOperatorDoesNotContain: "شامل نیست",
          filterOperatorDoesNotEqual: "برابر نیست",
          // pivotMenuColumns: "ُستون ها",
          columnMenuSortAsc: "مرتب سازی کم به زیاد",
          columnMenuSortDesc: "مرتب سازی زیاد به کم",
          columnMenuFilter: "فیلتر",
          columnMenuHideColumn: "مخفی کردن ستون",
          columnMenuManageColumns: "مدیرت ستون",
          // columnMenuManagePivot :"ww",
          // filterPanelRemoveAll:"eee",
          // filterValueAny :"wwww",
          // filterValueFalse:"شامل",
          // filterValueTrue:"ewww",
          // headerFilterClear :"Eeee",
          // headerFilterOperatorDoesNotContain:"!!11",

          noRowsLabel: "هیچ داده‌ای وجود ندارد",
          // errorOverlayDefaultLabel: "خطایی رخ داده است.",
          toolbarDensity: "چگالی",
          toolbarDensityLabel: "تنظیم چگالی",
          toolbarDensityCompact: "فشرده",
          toolbarDensityStandard: "استاندارد",
          toolbarDensityComfortable: "راحت",
          toolbarColumns: "ستون‌ها",
          toolbarColumnsLabel: "انتخاب ستون‌ها",
          toolbarFilters: "فیلترها",
          toolbarFiltersLabel: "نمایش فیلترها",
          toolbarFiltersTooltipHide: "پنهان کردن فیلترها",
          toolbarFiltersTooltipShow: "نمایش فیلترها",
          toolbarExport: "خروجی",
          toolbarExportLabel: "خروجی گرفتن",
          // columnsPanelTextFieldLabel: "جستجوی ستون",
          // columnsPanelTextFieldPlaceholder: "عنوان ستون",
          // columnsPanelDragIconLabel: "جابجایی ستون",
          // columnsPanelShowAllButton: "نمایش همه",
          // columnsPanelHideAllButton: "مخفی کردن همه",
          filterPanelAddFilter: "افزودن فیلتر",
          filterPanelDeleteIconLabel: "حذف",
          // filterPanelOperators: "اپراتورها",
          filterPanelOperatorAnd: "و",
          filterPanelOperatorOr: "یا",
          filterPanelColumns: "ستون‌ها",
          filterPanelInputLabel: "مقدار",
          filterPanelInputPlaceholder: "مقدار فیلتر",
          filterOperatorContains: "شامل",
          filterOperatorEquals: "برابر با",
          filterOperatorStartsWith: "شروع با",
          filterOperatorEndsWith: "پایان با",
          filterOperatorIs: "است",
          filterOperatorNot: "نیست",
          filterOperatorAfter: "بعد از",
          filterOperatorOnOrAfter: "در یا بعد از",
          filterOperatorBefore: "قبل از",
          filterOperatorOnOrBefore: "در یا قبل از",
          filterOperatorIsEmpty: "خالی است",
          filterOperatorIsNotEmpty: "خالی نیست",
          filterOperatorIsAnyOf: "هر کدام از",
          // paginationNext: "صفحه بعد",
          // paginationPrevious: "صفحه قبل",
          paginationRowsPerPage: "ردیف در هر صفحه:",
          // paginationOf: "از",
          footerRowSelected: (count) =>
            count !== 1
              ? `${count.toLocaleString()} ردیف انتخاب شده`
              : `${count.toLocaleString()} ردیف انتخاب شده`,
          footerTotalRows: "مجموع ردیف‌ها:",
          footerTotalVisibleRows: (visibleCount, totalCount) =>
            `${visibleCount.toLocaleString()} از ${totalCount.toLocaleString()}`,
          checkboxSelectionHeaderName: "انتخاب",
          booleanCellTrueLabel: "بله",
          booleanCellFalseLabel: "خیر",
          columnHeaderSortIconLabel: "مرتب‌سازی",
        }}
      />

      {/* نمایش جزئیات سفارش */}
      <Dialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>جزئیات سفارش #{selectedOrder?.id}</DialogTitle>
        <DialogContent>
          <List>
            {selectedOrder?.items.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem>
                  <ListItemText
                    primary={item.product.title}
                    secondary={`تعداد: ${item.quantity} × قیمت: ${item.price} تومان`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          <Typography variant="h6" mt={2}>
            جمع کل: {selectedOrder?.total} تومان
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            وضعیت: {selectedOrder?.status}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
