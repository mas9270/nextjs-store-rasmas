"use client";
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { Message, Delete } from "@mui/icons-material";
import { reactToastify } from "@/lib/toastify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading } from "@/store/slices/appLoading";
import { toJalali } from "@/lib/convetDate";
import { RefreshCcw } from "lucide-react";
import AddEditContactMessages from "./_components/addEditContactMessages";
import DeleteContactMessages from "./_components/deleteContactMessages";
import SendMessageToContact from "./_components/sendMessageToContact";

export default function ContactMessagesPage() {
  const [rows, setRows] = useState<any>([]);
  const { loading } = useAppSelector((state) => state.appLoading);
  const dispatch = useAppDispatch();

  const [isAddEditModal, setIsAddEditModal] = useState<{
    active: boolean;
    info: any;
  }>({
    active: false,
    info: null,
  });
  const [isSendMessage, setIsSendMessage] = useState<{
    active: boolean;
    info: any;
  }>({
    active: false,
    info: null,
  });
  const [isDelete, setIsDelete] = useState<{ active: boolean; info: any }>({
    active: false,
    info: null,
  });

  const columns = [
    { field: "id", headerName: "شناسه", width: 100 },
    { field: "name", headerName: "نام", width: 200 },
    { field: "email", headerName: "ایمیل", width: 200 },
    { field: "subject", headerName: "موضوع", width: 100 },
    { field: "message", headerName: "پیام", width: 200 },
    { field: "seen", headerName: "دیده شده", width: 100 },
    {
      field: "createdAt",
      headerName: "زمان ایجاد",
      width: 200,
      renderCell: (params: any) => {
        return <Box>{toJalali(params.row.createdAt)}</Box>;
      },
    },
    {
      field: "actionBtn",
      headerName: "عملیات",
      width: 80,
      renderCell: (params: any) => {
        return (
          <Box display={"flex"} alignItems={"center"} height={"100%"} gap={1}>
            <Delete
              color="error"
              sx={{ cursor: "pointer" }}
              onClick={() => {
                setIsDelete({ active: true, info: params.row });
              }}
            />
            <Message
              color="info"
              sx={{ cursor: "pointer" }}
              onClick={() => {
                setIsSendMessage({ active: true, info: params.row });
              }}
            />
          </Box>
        );
      },
    },
  ];

  async function getData() {
    dispatch(setLoading({ loading: true }));
    fetch("/api/contact-messages")
      .then((res) => res.json())
      .then((res) => {
        setRows(res.data);
      })
      .catch((err) => {
        reactToastify({
          type: "error",
          message: err.message,
        });
      }).finally(() => {
        dispatch(setLoading({ loading: false }));
      })
  }

  function actionBtn() {
    return (
      <Box
        component={"div"}
        width={"100%"}
        paddingBottom={"20px"}
        display={"flex"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
        gap={2}
      >
        <Box>مدیریت ارتباط با مشتریان</Box>
        <Box sx={{ display: "flex" }} gap={1}>
          <Button
            title="بازنشانی"
            sx={{ minWidth: "10px" }}
            size="small"
            variant="contained"
            color="success"
            onClick={() => {
              getData();
            }}
          >
            <RefreshCcw size={18} />
          </Button>
          {/* <Button
            sx={{ minWidth: "10px" }}
            size="small"
            variant="contained"
            onClick={() => {
              setIsAddEditModal({ active: true, info: null });
            }}
          >
            ایجاد
          </Button> */}
        </Box>
      </Box>
    );
  }

  function dataGrid() {
    return (
      <DataGrid
        sx={{ width: "100%", minHeight: 0, flex: 1 }}
        loading={loading}
        rows={rows}
        columns={columns}
        rowSelection={false}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
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
    );
  }

  function addEditModal() {
    return (
      <AddEditContactMessages
        data={{
          active: isAddEditModal.active,
          info: isAddEditModal.info,
        }}
        onClose={(done) => {
          setIsAddEditModal({
            active: false,
            info: null,
          });
          if (done) {
            getData();
          }
        }}
      />
    );
  }

  function sendMessage() {
    return (
      <SendMessageToContact
        data={{
          active: isSendMessage.active,
          info: isSendMessage.info,
        }}
        onClose={(done) => {
          setIsSendMessage({
            active: false,
            info: null,
          });
          if (done) {
            getData();
          }
        }}
      />
    );
  }

  function deleteModal() {
    return (
      <DeleteContactMessages
        data={{
          active: isDelete.active,
          info: isDelete.info,
        }}
        onClose={(done) => {
          setIsDelete({
            active: false,
            info: null,
          });
          if (done) {
            getData();
          }
        }}
      />
    );
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {actionBtn()}
      {addEditModal()}
      {deleteModal()}
      {sendMessage()}
      {dataGrid()}
    </Box>
  );
}
