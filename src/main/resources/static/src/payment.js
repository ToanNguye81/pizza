let gCustomerId = 0;
let gPaymentId = 0;
// customer
$.get(`/customers`, loadCustomerToSelect);
$.get(`/payments`, loadPaymentToTable);
let customerSelectElement = $("#select-customer");
function loadCustomerToSelect(pCustomer) {
  pCustomer.forEach((customer) => {
    $("<option>", {
      text: customer.firstName + " " + customer.lastName,
      value: customer.id,
    }).appendTo(customerSelectElement);
  });
}
customerSelectElement.change(onGetCustomerChange);
function onGetCustomerChange(event) {
  gCustomerId = event.target.value;
  if (gCustomerId == 0) {
    $.get(`/payments`, loadPaymentToTable);
  } else {
    $.get(`/customers/${gCustomerId}/payments`, loadPaymentToTable);
  }
}
// payment
let paymentTable = $("#payment-table").DataTable({
  columns: [
    { data: "id" },
    { data: "checkNumber" },
    { data: "paymentDate" },
    { data: "amount" },
    { data: "Action" },
  ],
  columnDefs: [
    {
      targets: -1,
      defaultContent: `<i class="fas fa-edit text-primary"></i>
      | <i class="fas fa-trash text-danger"></i>`,
    },
  ],
});

function loadPaymentToTable(pPayment) {
  paymentTable.clear();
  paymentTable.rows.add(pPayment);
  paymentTable.draw();
}

let payment = {
  newPayment: {
    checkNumber: "",
    paymentDate: "",
    amount: "",
  },
  onNewPaymentClick() {
    gPaymentId = 0;
    this.newPayment = {
      checkNumber: $("#inp-check-number").val().trim(),
      paymentDate: $("#inp-payment-date").val().trim(),
      amount: $("#inp-amount").val().trim(),
    };
    console.log(this.newPayment.paymentDate);
    if (validatePayment(this.newPayment)) {
      if (gCustomerId == 0) {
        alert(`Please select customer to create a new payment`);
      } else {
        $.ajax({
          url: `/customers/${gCustomerId}/payments`,
          method: "POST",
          data: JSON.stringify(this.newPayment),
          contentType: "application/json",
          success: () => {
            alert(`Payment created successfully`);
            $.get(`/customers/${gCustomerId}/payments`, loadPaymentToTable);
            resetPaymentInput();
          },
        });
      }
    }
  },
  onEditPaymentClick() {
    vSelectedRow = $(this).parents("tr");
    vSelectedData = paymentTable.row(vSelectedRow).data();
    gPaymentId = vSelectedData.id;
    $.get(`/payments/${gPaymentId}`, loadPaymentToInput);
  },
  onUpdatePaymentClick() {
    this.newPayment = {
      checkNumber: $("#inp-check-number").val().trim(),
      paymentDate: $("#inp-payment-date").val().trim(),
      amount: $("#inp-amount").val().trim(),
    };
    if (validatePayment(this.newPayment)) {
      if (gCustomerId == 0) {
        alert(`Please select customer to update a new payment`);
      } else {
        $.ajax({
          url: `/payments/${gPaymentId}`,
          method: "PUT",
          data: JSON.stringify(this.newPayment),
          contentType: "application/json",
          success: () => {
            alert(`Payment updated successfully`);
            $.get(`/customers/${gCustomerId}/payments`, loadPaymentToTable);
            resetPaymentInput();
          },
        });
      }
    }
  },
  onDeleteCustomerByIdClick() {
    $("#modal-delete-payment").modal("show");
    vSelectedRow = $(this).parents("tr");
    vSelectedData = paymentTable.row(vSelectedRow).data();
    gPaymentId = vSelectedData.id;
  },
  onDeleteAllPaymentClick() {
    $("#modal-delete-payment").modal("show");
    gPaymentId = 0;
  },
  onPaymentConfirmDeleteClick() {
    if (gPaymentId == 0) {
      $.ajax({
        url: `/payments`,
        method: "DELETE",
        success: () => {
          alert("All Payment was successfully deleted");
          // $.get(`/payments`, loadPaymentToTable);
          gCustomerId == 0
            ? $.get(`/payments`, loadPaymentToTable)
            : $.get(`customers/${gCustomerId}/payments`, loadPaymentToTable);
          $("#modal-delete-payment").modal("hide");
        },
        error: (err) => alert(err.responseText),
      });
    } else {
      $.ajax({
        url: `/payments/${gPaymentId}`,
        method: "DELETE",
        success: () => {
          alert(`Payment with id ${gPaymentId} was successfully deleted`);
          gCustomerId == 0
            ? $.get(`/payments`, loadPaymentToTable)
            : $.get(`customers/${gCustomerId}/payments`, loadPaymentToTable);

          $("#modal-delete-payment").modal("hide");
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
};

$("#create-payment").click(payment.onNewPaymentClick);
$("#update-payment").click(payment.onUpdatePaymentClick);
$("#delete-all-payment").click(payment.onDeleteAllPaymentClick);
$("#btn-confirm-delete-payment").click(payment.onPaymentConfirmDeleteClick);
$("#payment-table").on("click", ".fa-edit", payment.onEditPaymentClick);
$("#payment-table").on("click", ".fa-trash", payment.onDeleteCustomerByIdClick);

function validatePayment(pPayment) {
  let vResult = true;
  try {
    if (pPayment.checkNumber == "") {
      vResult = false;
      throw `100. Check number can't empty`;
    }
    if (pPayment.paymentDate == "") {
      vResult = false;
      throw `200. Payment date can't empty`;
    }
    if (pPayment.amount == "") {
      vResult = false;
      throw `300. Amount can't empty`;
    }
  } catch (e) {
    alert(e);
  }
  return vResult;
}

function loadPaymentToInput(pPayment) {
  $("#inp-check-number").val(pPayment.checkNumber);
  $("#inp-payment-date").val(pPayment.paymentDate);
  $("#inp-amount").val(pPayment.amount);
}

function resetPaymentInput() {
  $("#inp-check-number").val("");
  $("#inp-payment-date").val("");
  $("#inp-amount").val("");
}
