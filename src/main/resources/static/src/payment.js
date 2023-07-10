let gCustomerId = 0;
let gOrderId = 0;
// customer
$.get(`/customers`, loadCustomerToSelect);
$.get(`/payments`, loadOrderToTable);
let customerSelectElement = $("#select-customer");
function loadCustomerToSelect(paramCustomer) {
  paramCustomer.forEach((customer) => {
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
    $.get(`/payments`, loadOrderToTable);
  } else {
    $.get(`/customers/${gCustomerId}/payments`, loadOrderToTable);
  }
}

// let customer = {
//   newCustomer: {
//     fullName: "",
//     email: "",
//     phone: "",
//     address: "",
//   },
//   onCreateNewCustomerClick() {
//     gCustomerId = 0;
//     $("#modal-create-customer").modal("show");
//   },
//   onUpdateCustomerClick() {
//     if (gCustomerId != 0) {
//       $("#modal-create-customer").modal("show");
//       $.get(`/customers/${gCustomerId}`, loadCustomerToInput);
//     } else {
//       alert("Please select a customer to update");
//     }
//   },
//   onSaveCustomerClick() {
//     this.newCustomer = {
//       fullName: $("#inp-fullName").val().trim(),
//       email: $("#inp-email").val().trim(),
//       phone: $("#inp-phone").val().trim(),
//       address: $("#inp-address").val().trim(),
//     };
//     if (gCustomerId == 0) {
//       if (validateCustomer(this.newCustomer)) {
//         $.ajax({
//           url: `/customers`,
//           method: "POST",
//           contentType: "application/json",
//           data: JSON.stringify(this.newCustomer),
//           success: () => {
//             alert("successfully create new customer");
//             location.reload();
//           },
//           error: (err) => alert(err.responseText),
//         });
//       }
//     } else {
//       if (validateCustomer(this.newCustomer)) {
//         $.ajax({
//           url: `/customers/${gCustomerId}`,
//           method: "PUT",
//           contentType: "application/json",
//           data: JSON.stringify(this.newCustomer),
//           success: () => {
//             alert("successfully update customer with id: " + gCustomerId);
//             location.reload();
//           },
//           error: (err) => alert(err.responseText),
//         });
//       }
//     }
//   },
//   onDeleteCustomerClick() {
//     if (gCustomerId != 0) {
//       $("#modal-delete-customer").modal("show");
//     } else {
//       alert("Please select a customer to delete");
//     }
//   },
//   onDeleteAllCustomerClick() {
//     gCustomerId = 0;
//     $("#modal-delete-customer").modal("show");
//   },
//   onConfirmDeleteCustomerClick() {
//     if (gCustomerId != 0) {
//       $.ajax({
//         url: `/customers/${gCustomerId}`,
//         method: "delete",
//         success: () => {
//           alert("successfully delete customer with id:" + gCustomerId);
//           location.reload();
//         },
//         error: (err) => alert(err.responseText),
//       });
//     } else {
//       $.ajax({
//         url: `/customers`,
//         method: "delete",
//         success: () => {
//           alert("successfully delete all customers");
//           location.reload();
//         },
//         error: (err) => alert(err.responseText),
//       });
//     }
//   },
// };

// $("#btn-create-customer").click(customer.onCreateNewCustomerClick);
// $("#btn-update-customer").click(customer.onUpdateCustomerClick);
// $("#btn-save-customer").click(customer.onSaveCustomerClick);
// $("#btn-delete-customer").click(customer.onDeleteCustomerClick);
// $("#btn-delete-all-customer").click(customer.onDeleteAllCustomerClick);
// $("#btn-confirm-delete-customer").click(customer.onConfirmDeleteCustomerClick);

// function loadCustomerToInput(paramCustomer) {
//   $("#inp-fullName").val(paramCustomer.fullName);
//   $("#inp-email").val(paramCustomer.email);
//   $("#inp-phone").val(paramCustomer.phone);
//   $("#inp-address").val(paramCustomer.address);
// }

// function validateCustomer(paramCustomer) {
//   let vResult = true;
//   try {
//     if (paramCustomer.fullName == "") {
//       vResult = false;
//       throw `full name can't be empty`;
//     }

//     if (paramCustomer.email == "") {
//       vResult = false;
//       throw ` email can't be empty`;
//     }
//     if (!validateEmail(paramCustomer.email)) {
//       vResult = false;
//       throw `must need right email`;
//     }
//     if (paramCustomer.phone == "") {
//       vResult = false;
//       throw `phone can't be empty`;
//     }
//     if (paramCustomer.phone.length < 10 || isNaN(paramCustomer.phone)) {
//       vResult = false;
//       throw `Cần nhập đúng kiểu số điện thoại phải không có chữ cái và đúng 10 số`;
//     }
//     if (paramCustomer.address == "") {
//       vResult = false;
//       throw `Address can't be empty`;
//     }
//   } catch (e) {
//     alert(e);
//   }
//   return vResult;
// }

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
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

function loadOrderToTable(paramOrder) {
  paymentTable.clear();
  paymentTable.rows.add(paramOrder);
  paymentTable.draw();
}

let payment = {
  newOrder: {
    checkNumber: "",
    paymentDate: "",
    amount: "",
  },
  onNewOrderClick() {
    gOrderId = 0;
    this.newOrder = {
      checkNumber: $("#inp-check-number").val().trim(),
      paymentDate: $("#inp-payment-date").val().trim(),
      amount: $("#inp-amount").val().trim(),
    };
    if (validateOrder(this.newOrder)) {
      if (gCustomerId == 0) {
        alert(`Please select customer to create a new payment`);
      } else {
        $.ajax({
          url: `/customers/${gCustomerId}/payments`,
          method: "POST",
          data: JSON.stringify(this.newOrder),
          contentType: "application/json",
          success: () => {
            alert(`Order created successfully`);
            $.get(`/customers/${gCustomerId}/payments`, loadOrderToTable);
            resetOrderInput();
          },
        });
      }
    }
  },
  onEditOrderClick() {
    vSelectedRow = $(this).parents("tr");
    vSelectedData = paymentTable.row(vSelectedRow).data();
    gOrderId = vSelectedData.id;
    $.get(`/payments/${gOrderId}`, loadOrderToInput);
  },
  onUpdateOrderClick() {
    this.newOrder = {
      checkNumber: $("#inp-check-number").val().trim(),
      paymentDate: $("#inp-payment-date").val().trim(),
      amount: $("#inp-amount").val().trim(),
    };
    if (validateOrder(this.newOrder)) {
      if (gCustomerId == 0) {
        alert(`Please select customer to update a new payment`);
      } else {
        $.ajax({
          url: `/payments/${gOrderId}`,
          method: "PUT",
          data: JSON.stringify(this.newOrder),
          contentType: "application/json",
          success: () => {
            alert(`Order updated successfully`);
            $.get(`/customers/${gCustomerId}/payments`, loadOrderToTable);
            resetOrderInput();
          },
        });
      }
    }
  },
  onDeleteCustomerByIdClick() {
    $("#modal-delete-payment").modal("show");
    vSelectedRow = $(this).parents("tr");
    vSelectedData = paymentTable.row(vSelectedRow).data();
    gOrderId = vSelectedData.id;
  },
  onDeleteAllOrderClick() {
    $("#modal-delete-payment").modal("show");
    gOrderId = 0;
  },
  onOrderConfirmDeleteClick() {
    if (gOrderId == 0) {
      $.ajax({
        url: `/payments`,
        method: "delete",
        success: () => {
          alert("All Order was successfully deleted");
          // $.get(`/payments`, loadOrderToTable);
          gCustomerId == 0
            ? $.get(`/payments`, loadOrderToTable)
            : $.get(`customers/${gCustomerId}/payments`, loadOrderToTable);
          $("#modal-delete-payment").modal("hide");
        },
        error: (err) => alert(err.responseText),
      });
    } else {
      $.ajax({
        url: `/payments/${gOrderId}`,
        method: "delete",
        success: () => {
          alert(`Order with id ${gOrderId} was successfully deleted`);
          gCustomerId == 0
            ? $.get(`/payments`, loadOrderToTable)
            : $.get(`customers/${gCustomerId}/payments`, loadOrderToTable);

          $("#modal-delete-payment").modal("hide");
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
};

$("#create-payment").click(payment.onNewOrderClick);
$("#update-payment").click(payment.onUpdateOrderClick);
$("#delete-all-payment").click(payment.onDeleteAllOrderClick);
$("#btn-confirm-delete-payment").click(payment.onOrderConfirmDeleteClick);
$("#payment-table").on("click", ".fa-edit", payment.onEditOrderClick);
$("#payment-table").on("click", ".fa-trash", payment.onDeleteCustomerByIdClick);

function validateOrder(paramOrder) {
  let vResult = true;
  try {
    if (paramOrder.checkNumber == "") {
      vResult = false;
      throw `100. Check number can't empty`;
    }
    if (paramOrder.paymentDate == "") {
      vResult = false;
      throw `200. Payment date can't empty`;
    }
    if (paramOrder.amount == "") {
      vResult = false;
      throw `300. Amount can't empty`;
    }
  } catch (e) {
    alert(e);
  }
  return vResult;
}

function loadOrderToInput(paramOrder) {
  $("#inp-check-number").val(paramOrder.checkNumber);
  $("#inp-payment-date").val(paramOrder.paymentDate);
  $("#inp-amount").val(paramOrder.amount);
}

function resetOrderInput() {
  $("#inp-check-number").val("");
  $("#inp-payment-date").val("");
  $("#inp-amount").val("");
}
