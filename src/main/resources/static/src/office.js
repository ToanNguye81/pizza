"use strict";
let gOfficeId = 0;
let office = {
  newOffice: {
    id: "",
    phone: "",
    city: "",
    territory: "",
    addressLine: "",
    country: "",
    state: "",
  },
  onCreateNewOfficeClick() {
    this.newOffice = {
      phone: $("#inp-phone").val().trim(),
      city: $("#inp-city").val().trim(),
      territory: $("#inp-territory").val().trim(),
      addressLine: $("#inp-address-line").val().trim(),
      country: $("#inp-country").val().trim(),
      state: $("#inp-state").val().trim(),
    };
    if (validateOffice(this.newOffice)) {
      $.ajax({
        url: "/offices",
        method: "POST",
        data: JSON.stringify(this.newOffice),
        contentType: "application/json",
        success: (data) => {
          alert("Office created successfully");
          getOfficeFromDb();
          resetOfficeInput();
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
  onUpdateOfficeClick() {
    let vSelectedRow = $(this).parents("tr");
    let vSelectedData = officeTable.row(vSelectedRow).data();
    gOfficeId = vSelectedData.id;
    $.get(`/offices/${gOfficeId}`, loadOfficeToInput);
  },
  onSaveOfficeClick() {
    this.newOffice = {
      phone: $("#inp-phone").val().trim(),
      city: $("#inp-city").val().trim(),
      territory: $("#inp-territory").val().trim(),
      addressLine: $("#inp-address-line").val().trim(),
      country: $("#inp-country").val().trim(),
      state: $("#inp-state").val().trim(),
    };
    if (validateOffice(this.newOffice)) {
      $.ajax({
        url: `/offices/${gOfficeId}`,
        method: "PUT",
        data: JSON.stringify(this.newOffice),
        contentType: "application/json",
        success: (data) => {
          alert("Office updated successfully");
          getOfficeFromDb();
          gOfficeId = 0;
          resetOfficeInput();
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
  onDeleteOfficeByIdClick() {
    $("#modal-delete-office").modal("show");
    let vSelectedRow = $(this).parents("tr");
    let vSelectedData = officeTable.row(vSelectedRow).data();
    gOfficeId = vSelectedData.id;
  },
  onDeleteAllOfficeClick() {
    $("#modal-delete-office").modal("show");
    gOfficeId = 0;
  },
  onDeleteConfirmClick() {
    if (gOfficeId == 0) {
      $.ajax({
        url: "/offices",
        method: "DELETE",
        success: () => {
          alert("All office were successfully deleted");
          getOfficeFromDb();
          $("#modal-delete-office").modal("hide");
        },
        error: (err) => alert(err.responseText),
      });
    } else {
      $.ajax({
        url: `/offices/${gOfficeId}`,
        method: "DELETE",
        success: () => {
          alert(`Office with id: ${gOfficeId} was successfully deleted`);
          getOfficeFromDb();
          $("#modal-delete-office").modal("hide");
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
};

let officeTable = $("#office-table").DataTable({
  columns: [
    { data: "id" },
    { data: "phone" },
    { data: "city" },
    { data: "territory" },
    { data: "addressLine" },
    { data: "country" },
    { data: "state" },
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

function loadOfficeOnTable(pOffices) {
  "use strict";
  officeTable.clear();
  officeTable.rows.add(pOffices);
  officeTable.draw();
}

function getOfficeFromDb() {
  "use strict";
  $.get("/offices", (office) => loadOfficeOnTable(office));
}
getOfficeFromDb();

$("#create-office").click(office.onCreateNewOfficeClick);
$("#office-table").on("click", ".fa-edit", office.onUpdateOfficeClick);
$("#office-table").on("click", ".fa-trash", office.onDeleteOfficeByIdClick);
$("#update-office").click(office.onSaveOfficeClick);
$("#delete-all-office").click(office.onDeleteAllOfficeClick);
$("#delete-office").click(office.onDeleteConfirmClick);

function loadOfficeToInput(pOffices) {
  $("#inp-phone").val(pOffices.phone);
  $("#inp-city").val(pOffices.city);
  $("#inp-territory").val(pOffices.territory);
  $("#inp-address-line").val(pOffices.addressLine);
  $("#inp-country").val(pOffices.country);
  $("#inp-state").val(pOffices.state);
}

function resetOfficeInput() {
  $("#inp-phone").val("");
  $("#inp-city").val("");
  $("#inp-territory").val("");
  $("#inp-address-line").val("");
  $("#inp-country").val("");
  $("#inp-state").val("");
}

function validateOffice(pOffices) {
  "use strict";
  let vResult = true;
  try {
    if (pOffices.city == "") {
      vResult = false;
      throw "100.input city";
    }
    if (!/^\d{10}$/.test(pOffices.phone)) {
      vResult = false;
      throw "200.input phone number is 10 digitals";
    }
    if (pOffices.addressLine == "") {
      vResult = false;
      throw "300.input address line";
    }
    if (pOffices.state == "") {
      vResult = false;
      throw "400.input state";
    }
    if (pOffices.country == "") {
      vResult = false;
      throw "500.input country";
    }
    if (pOffices.territory == "") {
      vResult = false;
      throw "600.input territory";
    }
  } catch (e) {
    alert(e);
  }
  return vResult;
}
