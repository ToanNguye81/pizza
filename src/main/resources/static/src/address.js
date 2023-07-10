"use strict";
onPageLoading();
let gPage = 1;
let gSize = 5;
let gField = "";
let gDataField = [];
// Sự kiện click nút "All province"
$("#btn-all-province").click(function () {
  gField = "province";
  gDataField = ["id", "name", "code"];
  loadDataToTable();
});
// Sự kiện click nút "All district"
$("#btn-all-district").click(function () {
  gField = "district";
  gDataField = ["id", "name", "prefix"];
  loadDataToTable();
});
// Sự kiện click nút "All ward"
$("#btn-all-ward").click(function () {
  gField = "ward";
  gDataField = ["id", "name", "prefix"];
  loadDataToTable();
});
$("#btn-add-province").click(function () {
  createNewProvince();
});
$("#btn-add-district").click(function () {
  createNewDistrict();
});
$("#btn-add-ward").click(function () {
  createNewWard();
});
$("tbody").on("click", ".far.fa-edit.mr-2.province", function () {
  loadDataToProvinceModal(this);
});
$("tbody").on("click", ".far.fa-edit.mr-2.district", function () {
  loadDataToDistrictModal(this);
});
$("tbody").on("click", ".far.fa-edit.mr-2.ward", function () {
  loadDataToWardModal(this);
});
$("tbody").on("click", ".far.fa-trash-alt.ml-2.province", function () {
  checkDeletedProvince(this);
});
$("tbody").on("click", ".far.fa-trash-alt.ml-2.district", function () {
  checkDeletedDistrict(this);
});
$("tbody").on("click", ".far.fa-trash-alt.ml-2.ward", function () {
  checkDeletedWard(this);
});
$("#btn-confirm-update-province").click(function () {
  updateProvince();
});
$("#btn-confirm-update-district").click(function () {
  updateDistrict();
});
$("#btn-confirm-update-ward").click(function () {
  updateWard();
});
$("#btn-confirm-delete-province").click(function () {
  deleteProvince(this);
});
$("#btn-confirm-delete-district").click(function () {
  deleteDistrict(this);
});
$("#btn-confirm-delete-ward").click(function () {
  deleteWard(this);
});
$("#table-page").change(function () {
  gPage = $(this).val(); // Lấy giá trị đã chọn
  loadDataToTable();
});
$("#table-size").change(function () {
  gSize = $(this).val(); // Lấy giá trị đã chọn
  loadDataToTable();
});

//delete province to database
function deleteProvince(element) {
  var id = $(element).data("id");
  $.ajax({
    url: `/province/delete/${id}`,
    method: "DELETE",
    success: function (response) {
      handleWarning("Xóa Province thành công");
    },
    error: function (error) {
      console.log(error);
    },
  });
}

//Load all province to Table
function loadDataToTable() {
  $.ajax({
    url: `/${gField}/all?size=${gSize}&page=${gPage - 1}`,
    method: "GET",
    success: function (response) {
      displayDataToTable(response, gDataField, gField);
    },
    error: function (error) {
      console.log(error);
    },
  });
}

// refresh - on page loading
function onPageLoading() {
  "use strict";
  loadAllProvinceToSelect();
  loadAllDistrictToSelect();
}

// Load district by province code
function loadDistrictByProvinceCode() {
  var selectedProvince = document.getElementById("province").value;
  var districtSelect = document.getElementById("district");
  districtSelect.innerHTML = '<option value="">Chọn Quận/huyện</option>';
  fetch("/district?provinceCode=" + selectedProvince)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((district) => {
        var option = document.createElement("option");
        option.value = district.id;
        option.innerHTML = district.prefix + " " + district.name;
        districtSelect.appendChild(option);
      });
    });
}

// Load ward by district id
function loadWardByDistrictId() {
  var selectedDistrict = document.getElementById("district").value;
  var wardSelect = document.getElementById("ward");
  wardSelect.innerHTML = '<option value="">Chọn xã/phường</option>';
  fetch("/ward?districtId=" + selectedDistrict)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((ward) => {
        var option = document.createElement("option");
        option.value = ward.id;
        option.innerHTML = ward.prefix + " " + ward.name;
        wardSelect.appendChild(option);
      });
    });
}

//load all province
function loadAllProvinceToSelect() {
  var provinceSelect = document.getElementById("province");
  var provinceForDistrictSelect = document.getElementById(
    "sel-province-for-district"
  );
  fetch("/province/all?size=100")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((province) => {
        var option1 = document.createElement("option");
        option1.value = province.code;
        option1.dataset.provinceId = province.id;
        option1.innerHTML = province.name;
        provinceSelect.appendChild(option1);

        var option2 = document.createElement("option");
        option2.value = province.code;
        option2.dataset.provinceId = province.id;
        option2.innerHTML = province.name;
        provinceForDistrictSelect.appendChild(option2);
      });
    });
}

//load all district
function loadAllDistrictToSelect() {
  var districtSelect = document.getElementById("sel-district-for-ward");
  fetch("/district/all?size=730")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((province) => {
        var option1 = document.createElement("option");
        option1.value = province.code;
        option1.dataset.districtId = province.id;
        option1.innerHTML = province.name;
        districtSelect.appendChild(option1);
      });
    });
}

// Hàm hiển thị dữ liệu lên bảng
function displayDataToTable(data, columns, field) {
  var $tableBody = $("#data-table tbody");
  $tableBody.empty();
  var $tableHead = $("#data-table thead");
  $tableHead.empty();

  var $headerRow = $("<tr>");

  // Tạo các cột tiêu đề
  $.each(columns, function (index, column) {
    $("<td>").text(column).appendTo($headerRow);
  });
  $("<td>").text("Action").appendTo($headerRow);

  $headerRow.appendTo($tableHead);

  // Hiển thị dữ liệu từ mảng vào bảng
  $.each(data, function (index, item) {
    var $row = $("<tr>");

    // Hiển thị các trường dữ liệu vào từng ô
    $.each(columns, function (_, column) {
      $("<td>").text(item[column]).appendTo($row);
    });

    var $actionCell = $("<td>");

    // Tạo nút chỉnh sửa
    $("<i>", {
      class: `far fa-edit mr-2 ${field}`,
      style: "color: #04b418",
      "data-toggle": "#modal",
      "data-target": `#modal-update-${field}`,
      "data-id": item.id,
      "data-prefix": item.prefix,
      "data-name": item.name,
      "data-code": item.code,
    }).appendTo($actionCell);

    // Tạo nút xóa
    $("<i>", {
      class: `far fa-trash-alt ml-2 ${field}`,
      style: "color: #a40404",
      "data-toggle": "#modal",
      "data-target": `#modal-delete-${field}`,
      "data-id": item.id,
    }).appendTo($actionCell);

    $actionCell.appendTo($row);
    $row.appendTo($tableBody);
  });
}

//sent data to create new province
function createNewProvince() {
  let province = getProvince();
  console.log(province);
  // validate province
  $.ajax({
    url: "/province/create",
    data: JSON.stringify(province),
    method: "POST",
    contentType: "application/json",
    success: function (response) {
      handleWarning("Tạo Province thành công");
    },
    error: function (error) {
      console.log(error);
    },
  });
}

//sent data to create new district
function createNewDistrict() {
  let district = getDistrict();
  // valid district
  $.ajax({
    contentType: "application/json",
    url: `/district/create/${district.provinceId}`,
    data: JSON.stringify(district),
    method: "POST",
    success: function (response) {
      handleWarning("Tạo District thành công");
    },
    error: function (error) {
      console.log(error);
    },
  });
}

//sent data to create new ward
function createNewWard() {
  let ward = getWard();
  //valid ward
  $.ajax({
    contentType: "application/json",
    url: `/ward/create/${ward.districtId}`,
    method: "POST",
    data: JSON.stringify(ward),
    success: function (response) {
      handleWarning("Tạo Ward thành công");
    },
    error: function (error) {
      console.log(error);
    },
  });
}

//Get data to create province
function getProvince() {
  return {
    name: $("#inp-province-name").val(),
    code: $("#inp-province-code").val(),
  };
}

//Get data to create district
function getDistrict() {
  return {
    name: $("#inp-district-name").val(),
    prefix: $("#inp-district-prefix").val(),
    provinceId: $("#sel-province-for-district option:selected").data(
      "provinceId"
    ),
  };
}

//Get data to create ward
function getWard() {
  return {
    name: $("#inp-ward-name").val(),
    prefix: $("#inp-ward-prefix").val(),
    districtId: $("#sel-district-for-ward option:selected").data("districtId"),
  };
}

//delete district to database
function deleteDistrict(element) {
  var id = $(element).data("id");
  $.ajax({
    url: `/district/delete/${id}`,
    method: "DELETE",
    success: function (response) {
      handleWarning("Xóa district thành công");
    },
    error: function (error) {
      console.log(error);
    },
  });
}

//delete ward to database
function deleteWard(element) {
  var id = $(element).data("id");
  $.ajax({
    url: `/ward/delete/${id}`,
    method: "DELETE",
    success: function (response) {
      handleWarning("Xóa ward thành công");
    },
    error: function (error) {
      console.log(error);
    },
  });
}

//update province to database
function updateProvince() {
  let province = {
    id: $("#inp-province-id.update").val(),
    name: $("#inp-province-name.update").val(),
    code: $("#inp-province-code.update").val(),
  };
  $.ajax({
    contentType: "application/json",
    url: `/province/update/${province.id}`,
    data: JSON.stringify(province),
    method: "PUT",
    success: function (response) {
      handleWarning("Cập nhật tỉnh thành công");
    },
    error: function (error) {
      console.log(error);
    },
  });
}

//update district to database
function updateDistrict() {
  let district = {
    id: $("#inp-district-id.update").val(),
    name: $("#inp-district-name.update").val(),
    prefix: $("#inp-district-prefix.update").val(),
  };
  $.ajax({
    contentType: "application/json",
    url: `/district/update/${district.id}`,
    data: JSON.stringify(district),
    method: "PUT",
    success: function (response) {
      handleWarning("Cập nhật district thành công");
    },
    error: function (error) {
      console.log(error);
    },
  });
}
//update ward to database
function updateWard() {
  let ward = {
    id: $("#inp-ward-id.update").val(),
    name: $("#inp-ward-name.update").val(),
    prefix: $("#inp-ward-prefix.update").val(),
  };
  $.ajax({
    contentType: "application/json",
    url: `/ward/update/${ward.id}`,
    data: JSON.stringify(ward),
    method: "PUT",
    success: function (response) {
      handleWarning("Cập nhật ward thành công");
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function handleWarning(warningText) {
  $(".modal").modal("hide");
  $("#modal-warning").find(".text-warning").text(warningText);
  $("#modal-warning").modal("show"); // Hiển thị modal
}

function reload() {
  location.reload();
}

// Load province tp update modal
function loadDataToProvinceModal(element) {
  $("#inp-province-id.update").val(element.dataset.id);
  $("#inp-province-name.update").val(element.dataset.name);
  $("#inp-province-code.update").val(element.dataset.code);
  // Hiển thị modal
  $("#modal-update-province").modal("show");
}

// Load district tp update modal
function loadDataToDistrictModal(element) {
  $("#inp-district-id.update").val(element.dataset.id);
  $("#inp-district-name.update").val(element.dataset.name);
  $("#inp-district-prefix.update").val(element.dataset.prefix);
  // Hiển thị modal
  $("#modal-update-district").modal("show");
}

// Load ward tp update modal
function loadDataToWardModal(element) {
  $("#inp-ward-id.update").val(element.dataset.id);
  $("#inp-ward-name.update").val(element.dataset.name);
  $("#inp-ward-prefix.update").val(element.dataset.prefix);
  // Hiển thị modal
  $("#modal-update-ward").modal("show");
}
//Hiển thị modal chứa id của province muốn xóa
function checkDeletedProvince(element) {
  var iconId = $(element).data("id");
  var h6Element = $("#modal-delete-province").find("h6");
  h6Element.text("Bạn có chắc muốn xóa province id= " + iconId);
  $("#btn-confirm-delete-province").data("id", iconId);
  $("#modal-delete-province").modal("show"); // Hiển thị modal
}

//Hiển thị modal chứa id của district muốn xóa
function checkDeletedDistrict(element) {
  var iconId = $(element).data("id");
  var h6Element = $("#modal-delete-district").find("h6");
  h6Element.text("Bạn có chắc muốn xóa district id= " + iconId);
  $("#btn-confirm-delete-district").data("id", iconId);
  $("#modal-delete-district").modal("show"); // Hiển thị modal
}
//Hiển thị modal chứa id của ward muốn xóa
function checkDeletedWard(element) {
  var iconId = $(element).data("id");
  var h6Element = $("#modal-delete-ward").find("h6");
  h6Element.text("Bạn có chắc muốn xóa ward id= " + iconId);
  $("#btn-confirm-delete-ward").data("id", iconId);
  $("#modal-delete-ward").modal("show"); // Hiển thị modal
}
