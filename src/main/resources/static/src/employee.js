"use strict";
let gEmployeeId = 0;
let employee = {
  newEmployee: {
    firstName: "",
    lastName: "",
    extension: "",
    email: "",
    officeCode: "",
    reportTo: "",
    jobTitle: "",
  },
  onCreateNewEmployeeClick() {
    this.newEmployee = {
      firstName: $("#inp-first-name").val().trim(),
      lastName: $("#inp-last-name").val().trim(),
      extension: $("#inp-extension").val().trim(),
      email: $("#inp-email").val().trim(),
      officeCode: $("#inp-office-code").val().trim(),
      reportTo: $("#inp-report-to").val().trim(),
      jobTitle: $("#inp-job-title").val().trim(),
    };
    if (validateEmployee(this.newEmployee)) {
      $.ajax({
        url: "/employees",
        method: "POST",
        data: JSON.stringify(this.newEmployee),
        contentType: "application/json",
        success: (data) => {
          alert("Employee created successfully");
          getEmployeeFromDb();
          resetEmployeeInput();
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
  onUpdateEmployeeClick() {
    let vSelectedRow = $(this).parents("tr");
    let vSelectedData = employeeTable.row(vSelectedRow).data();
    gEmployeeId = vSelectedData.id;
    $.get(`/employees/${gEmployeeId}`, loadEmployeeToInput);
  },
  onSaveEmployeeClick() {
    this.newEmployee = {
      firstName: $("#inp-first-name").val().trim(),
      lastName: $("#inp-last-name").val().trim(),
      extension: $("#inp-extension").val().trim(),
      email: $("#inp-email").val().trim(),
      officeCode: $("#inp-office-code").val().trim(),
      reportTo: $("#inp-report-to").val().trim(),
      jobTitle: $("#inp-job-title").val().trim(),
    };
    if (validateEmployee(this.newEmployee)) {
      $.ajax({
        url: `/employees/${gEmployeeId}`,
        method: "PUT",
        data: JSON.stringify(this.newEmployee),
        contentType: "application/json",
        success: (data) => {
          alert("Employee updated successfully");
          getEmployeeFromDb();
          gEmployeeId = 0;
          resetEmployeeInput();
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
  onDeleteEmployeeByIdClick() {
    $("#modal-delete-employee").modal("show");
    let vSelectedRow = $(this).parents("tr");
    let vSelectedData = employeeTable.row(vSelectedRow).data();
    gEmployeeId = vSelectedData.id;
  },
  onDeleteAllEmployeeClick() {
    $("#modal-delete-employee").modal("show");
    gEmployeeId = 0;
  },
  onDeleteConfirmClick() {
    if (gEmployeeId == 0) {
      $.ajax({
        url: "/employees",
        method: "DELETE",
        success: () => {
          alert("All employee were successfully deleted");
          getEmployeeFromDb();
          $("#modal-delete-employee").modal("hide");
        },
        error: (err) => alert(err.responseText),
      });
    } else {
      $.ajax({
        url: `/employees/${gEmployeeId}`,
        method: "DELETE",
        success: () => {
          alert(`Employee with id: ${gEmployeeId} was successfully deleted`);
          getEmployeeFromDb();
          $("#modal-delete-employee").modal("hide");
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
};

let employeeTable = $("#employee-table").DataTable({
  columns: [
    { data: "id" },
    { data: "firstName" },
    { data: "lastName" },
    { data: "extension" },
    { data: "email" },
    { data: "officeCode" },
    { data: "reportTo" },
    { data: "jobTitle" },
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

function loadEmployeeOnTable(pEmployees) {
  "use strict";
  employeeTable.clear();
  employeeTable.rows.add(pEmployees);
  employeeTable.draw();
}

function getEmployeeFromDb() {
  "use strict";
  $.get("/employees", (employee) => loadEmployeeOnTable(employee));
}
getEmployeeFromDb();

$("#create-employee").click(employee.onCreateNewEmployeeClick);
$("#employee-table").on("click", ".fa-edit", employee.onUpdateEmployeeClick);
$("#employee-table").on(
  "click",
  ".fa-trash",
  employee.onDeleteEmployeeByIdClick
);
$("#update-employee").click(employee.onSaveEmployeeClick);
$("#delete-all-employee").click(employee.onDeleteAllEmployeeClick);
$("#delete-employee").click(employee.onDeleteConfirmClick);

function loadEmployeeToInput(pEmployees) {
  $("#inp-first-name").val(pEmployees.firstName);
  $("#inp-last-name").val(pEmployees.lastName);
  $("#inp-extension").val(pEmployees.extension);
  $("#inp-email").val(pEmployees.email);
  $("#inp-office-code").val(pEmployees.officeCode);
  $("#inp-report-to").val(pEmployees.reportTo);
  $("#inp-job-title").val(pEmployees.jobTitle);
}

function resetEmployeeInput() {
  $("#inp-first-name").val("");
  $("#inp-last-name").val("");
  $("#inp-extension").val("");
  $("#inp-email").val("");
  $("#inp-office-code").val("");
  $("#inp-report-to").val("");
  $("#inp-job-title").val("");
}

function validateEmployee(pEmployees) {
  "use strict";
  let vResult = true;
  try {
    if (pEmployees.firstName == "") {
      vResult = false;
      throw "100.input first name";
    }
    if (pEmployees.lastName == "") {
      vResult = false;
      throw "200.input last name";
    }
    if (pEmployees.extension == "") {
      vResult = false;
      throw "300.input extension";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pEmployees.email)) {
      vResult = false;
      throw "400.Email not valid";
    }
    if (pEmployees.officeCode == "") {
      vResult = false;
      throw "500.input office code";
    }
    if (pEmployees.city == "") {
      vResult = false;
      throw "600.input city";
    }
    if (pEmployees.jobTitle == "") {
      vResult = false;
      throw "700.input job title";
    }
  } catch (e) {
    alert(e);
  }
  return vResult;
}
