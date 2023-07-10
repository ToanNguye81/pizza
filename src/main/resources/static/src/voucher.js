"use strict";
let gId = 0;
let gVoucher = {
  voucher: "",
  onGetVoucherClick() {
    $.ajax({
      url: "/vouchers",
      method: "GET",
      dataType: "json",
      success: getAllVoucher,
      error: (err) => alert(err.responseText),
    });
  },
  onEditVoucherClick() {
    let vSelectedRow = $(this).parents("tr");
    let vSelectedData = gVoucherTable.row(vSelectedRow).data();
    gId = vSelectedData.id;
    $.ajax({
      url: `/vouchers/${gId}`,
      method: "GET",
      dataType: "json",
      success: showVoucherDetail,
      error: (err) => alert(err.responseText),
    });
  },
  onCreateVoucherClick() {
    this.voucher = {
      maVoucher: $("#input-voucher-code").val().trim(),
      phanTramGiamGia: $("#input-discount").val().trim(),
      ghiChu: $("#input-note").val().trim(),
    };
    if (validateVoucher(this.voucher)) {
      $.ajax({
        url: "/vouchers",
        method: "POST",
        data: JSON.stringify(this.voucher),
        contentType: "application/json;charset=utf-8",
        success: () => {
          alert("Đã tạo voucher thành công");
          gVoucher.onGetVoucherClick();
          resetInput();
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
  onSaveVoucherClick() {
    this.voucher = {
      maVoucher: $("#input-voucher-code").val().trim(),
      phanTramGiamGia: $("#input-discount").val().trim(),
      ghiChu: $("#input-note").val().trim(),
    };
    if (validateVoucher(this.voucher)) {
      $.ajax({
        url: `/vouchers/${gId}`,
        method: "PUT",
        data: JSON.stringify(this.voucher),
        contentType: "application/json;charset=utf-8",
        success: () => {
          alert("Đã cập nhật voucher thành công");
          gVoucher.onGetVoucherClick();
          resetInput();
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
  onDeleteVoucherClick() {
    $("#modal-delete-voucher").modal("show");
    let vSelectedRow = $(this).parents("tr");
    let vSelectedData = gVoucherTable.row(vSelectedRow).data();
    $("#text-delete-voucher").text("Bạn có chắc muốn xóa voucher");
    gId = vSelectedData.id;
  },
  onDeleteAllVouchersClick() {
    $("#modal-delete-voucher").modal("show");
    gId = 0;
    $("#text-delete-voucher").text("Bạn có chắc muốn xóa tất cả voucher");
  },
  onConfirmDeleteVoucherClick() {
    if (gId === 0) {
      $.ajax({
        url: `/vouchers`,
        type: "DELETE",
        success: () => {
          alert("Đã xóa tất cả voucher");
          $("#modal-delete-voucher").modal("hide");
          gVoucher.onGetVoucherClick();
        },
        error: (err) => alert(err.responseText),
      });
    } else {
      $.ajax({
        url: `/vouchers/${gId}`,
        type: "DELETE",
        success: () => {
          alert("Đã xóa voucher thành công");
          $("#modal-delete-voucher").modal("hide");
          gVoucher.onGetVoucherClick();
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
};
gVoucher.onGetVoucherClick();
// add event listener cho các dòng
$("#user-table").on("click", "tr", gVoucher.onGetVoucherClick);
// add event listener cho icon edit
$("#user-table").on("click", ".fa-edit", gVoucher.onEditVoucherClick);
// add event listener cho button tạo mới data
$("#create-data").click(gVoucher.onCreateVoucherClick);
// add event listener cho button tạo mới data
$("#save_data").click(gVoucher.onSaveVoucherClick);
// add event listener cho icon delete
$("#user-table").on("click", ".fa-trash", gVoucher.onDeleteVoucherClick);
// add event listener cho icon delete voucher
$("#delete-voucher").click(gVoucher.onConfirmDeleteVoucherClick);
// add event listener cho button delete All vouchers
$("#delete-all-voucher").click(gVoucher.onDeleteAllVouchersClick);

// tạo bảng voucher bằng data Table
let gVoucherTable = $("#user-table").DataTable({
  order: [],
  columns: [
    { data: "id" },
    { data: "maVoucher" },
    { data: "phanTramGiamGia" },
    { data: "ghiChu" },
    { data: "dayCreated" },
    { data: "dayUpdated" },
    { data: "action" },
  ],
  columnDefs: [
    {
      targets: -1,
      defaultContent: `<i class="fas fa-edit text-primary"></i>
      | <i class="fas fa-trash text-danger"></i>`,
    },
  ],
});

// load voucher vào table
function loadVoucherToTable(paramVoucher) {
  "use strict";
  gVoucherTable.clear().rows.add(paramVoucher).draw();
}

// hàm hiển thị lên website
function getAllVoucher(paramVouchers) {
  "use strict";
  loadVoucherToTable(paramVouchers);
}

function showVoucherDetail(paramVoucher) {
  $("#input-voucher-code").val(paramVoucher.maVoucher);
  $("#input-discount").val(paramVoucher.phanTramGiamGia);
  $("#input-note").val(paramVoucher.ghiChu);
  $("#input-createDate").val(formatDate(paramVoucher.dayCreated));
  $("#input-updateDate").val(formatDate(paramVoucher.dayUpdated));
}

// hàm dùng để format ngày tháng
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

// hàm dùng để validate dữ liệu
function validateVoucher(paramVoucher) {
  "use strict";
  let vValidated = true;
  try {
    if (paramVoucher.maVoucher == "") {
      vValidated = false;
      throw "100, Chưa nhập mã Voucher";
    }
    if (paramVoucher.phanTramGiamGia == "") {
      vValidated = false;
      throw "200, Chưa nhập phần trăm được giảm giá";
    }
  } catch (err) {
    alert("Error: " + err);
  }
  return vValidated;
}

// hàm dùng để reset input
function resetInput() {
  $("#input-voucher-code").val("");
  $("#input-discount").val("");
  $("#input-note").val("");
  $("#input-createDate").val("");
  $("#input-updateDate").val("");
}
