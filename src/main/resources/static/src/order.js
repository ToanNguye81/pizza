let gCustomerId = 0;
let gOrderId = 0;
// customer
$.get(`/customers`, loadCustomerToSelect);
$.get(`/orders`, loadOrderToTable);
let customerSelectElement = $("#select-customer");
function loadCustomerToSelect(paramCustomer) {
  paramCustomer.forEach((customer) => {
    $("<option>", {
      text: customer.fullName,
      value: customer.id,
    }).appendTo(customerSelectElement);
  });
}
customerSelectElement.change(onGetCustomerChange);
function onGetCustomerChange(event) {
  gCustomerId = event.target.value;
  if (gCustomerId == 0) {
    $.get(`/orders`, loadOrderToTable);
  } else {
    $.get(`/customers/${gCustomerId}/orders`, loadOrderToTable);
  }
}

let customer = {
  newCustomer: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
  },
  onCreateNewCustomerClick() {
    gCustomerId = 0;
    $("#modal-create-customer").modal("show");
  },
  onUpdateCustomerClick() {
    if (gCustomerId != 0) {
      $("#modal-create-customer").modal("show");
      $.get(`/customers/${gCustomerId}`, loadCustomerToInput);
    } else {
      alert("Please select a customer to update");
    }
  },
  onSaveCustomerClick() {
    this.newCustomer = {
      fullName: $("#input-fullName").val().trim(),
      email: $("#input-email").val().trim(),
      phone: $("#input-phone").val().trim(),
      address: $("#input-address").val().trim(),
    };
    if (gCustomerId == 0) {
      if (validateCustomer(this.newCustomer)) {
        $.ajax({
          url: `/customers`,
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify(this.newCustomer),
          success: () => {
            alert("successfully create new customer");
            location.reload();
          },
          error: (err) => alert(err.responseText),
        });
      }
    } else {
      if (validateCustomer(this.newCustomer)) {
        $.ajax({
          url: `/customers/${gCustomerId}`,
          method: "PUT",
          contentType: "application/json",
          data: JSON.stringify(this.newCustomer),
          success: () => {
            alert("successfully update customer with id: " + gCustomerId);
            location.reload();
          },
          error: (err) => alert(err.responseText),
        });
      }
    }
  },
  onDeleteCustomerClick() {
    if (gCustomerId != 0) {
      $("#modal-delete-customer").modal("show");
    } else {
      alert("Please select a customer to delete");
    }
  },
  onDeleteAllCustomerClick() {
    gCustomerId = 0;
    $("#modal-delete-customer").modal("show");
  },
  onConfirmDeleteCustomerClick() {
    if (gCustomerId != 0) {
      $.ajax({
        url: `/customers/${gCustomerId}`,
        method: "delete",
        success: () => {
          alert("successfully delete customer with id:" + gCustomerId);
          location.reload();
        },
        error: (err) => alert(err.responseText),
      });
    } else {
      $.ajax({
        url: `/customers`,
        method: "delete",
        success: () => {
          alert("successfully delete all customers");
          location.reload();
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
};

$("#btn-create-customer").click(customer.onCreateNewCustomerClick);
$("#btn-update-customer").click(customer.onUpdateCustomerClick);
$("#btn-save-customer").click(customer.onSaveCustomerClick);
$("#btn-delete-customer").click(customer.onDeleteCustomerClick);
$("#btn-delete-all-customer").click(customer.onDeleteAllCustomerClick);
$("#btn-confirm-delete-customer").click(customer.onConfirmDeleteCustomerClick);

function loadCustomerToInput(paramCustomer) {
  $("#input-fullName").val(paramCustomer.fullName);
  $("#input-email").val(paramCustomer.email);
  $("#input-phone").val(paramCustomer.phone);
  $("#input-address").val(paramCustomer.address);
}

function validateCustomer(paramCustomer) {
  let vResult = true;
  try {
    if (paramCustomer.fullName == "") {
      vResult = false;
      throw `full name can't be empty`;
    }

    if (paramCustomer.email == "") {
      vResult = false;
      throw ` email can't be empty`;
    }
    if (!validateEmail(paramCustomer.email)) {
      vResult = false;
      throw `must need right email`;
    }
    if (paramCustomer.phone == "") {
      vResult = false;
      throw `phone can't be empty`;
    }
    if (paramCustomer.phone.length < 10 || isNaN(paramCustomer.phone)) {
      vResult = false;
      throw `Cần nhập đúng kiểu số điện thoại phải không có chữ cái và đúng 10 số`;
    }
    if (paramCustomer.address == "") {
      vResult = false;
      throw `Address can't be empty`;
    }
  } catch (e) {
    alert(e);
  }
  return vResult;
}

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
// order
let orderTable = $("#order-table").DataTable({
  columns: [
    { data: "orderCode" },
    { data: "pizzaSize" },
    { data: "pizzaType" },
    { data: "voucherCode" },
    { data: "price" },
    { data: "paid" },
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
  orderTable.clear();
  orderTable.rows.add(paramOrder);
  orderTable.draw();
}

let order = {
  newOrder: {
    orderCode: "",
    pizzaSize: "",
    pizzaType: "",
    voucherCode: "",
    price: "",
    paid: "",
  },
  onNewOrderClick() {
    gOrderId = 0;
    this.newOrder = {
      orderCode: $("#input-order-Code").val().trim(),
      pizzaSize: $("#input-pizza-size").val().trim(),
      pizzaType: $("#input-pizza-type").val().trim(),
      voucherCode: $("#input-voucher").val().trim(),
      price: $("#input-Price").val().trim(),
      paid: $("#input-Paid").val().trim(),
    };
    if (validateOrder(this.newOrder)) {
      if (gCustomerId == 0) {
        alert(`Please select customer to create a new order`);
      } else {
        $.ajax({
          url: `/customers/${gCustomerId}/orders`,
          method: "POST",
          data: JSON.stringify(this.newOrder),
          contentType: "application/json",
          success: () => {
            alert(`Order created successfully`);
            $.get(`/customers/${gCustomerId}/orders`, loadOrderToTable);
            resetOrderInput();
          },
        });
      }
    }
  },
  onEditOrderClick() {
    vSelectedRow = $(this).parents("tr");
    vSelectedData = orderTable.row(vSelectedRow).data();
    gOrderId = vSelectedData.id;
    $.get(`/orders/${gOrderId}`, loadOrderToInput);
  },
  onUpdateOrderClick() {
    this.newOrder = {
      orderCode: $("#input-order-Code").val().trim(),
      pizzaSize: $("#input-pizza-size").val().trim(),
      pizzaType: $("#input-pizza-type").val().trim(),
      voucherCode: $("#input-voucher").val().trim(),
      price: $("#input-Price").val().trim(),
      paid: $("#input-Paid").val().trim(),
    };
    if (validateOrder(this.newOrder)) {
      if (gCustomerId == 0) {
        alert(`Please select customer to update a new order`);
      } else {
        $.ajax({
          url: `/orders/${gOrderId}`,
          method: "PUT",
          data: JSON.stringify(this.newOrder),
          contentType: "application/json",
          success: () => {
            alert(`Order updated successfully`);
            $.get(`/customers/${gCustomerId}/orders`, loadOrderToTable);
            resetOrderInput();
          },
        });
      }
    }
  },
  onDeleteCustomerByIdClick() {
    $("#modal-delete-order").modal("show");
    vSelectedRow = $(this).parents("tr");
    vSelectedData = orderTable.row(vSelectedRow).data();
    gOrderId = vSelectedData.id;
  },
  onDeleteAllOrderClick() {
    $("#modal-delete-order").modal("show");
    gOrderId = 0;
  },
  onOrderConfirmDeleteClick() {
    if (gOrderId == 0) {
      $.ajax({
        url: `/orders`,
        method: "delete",
        success: () => {
          alert("All Order was successfully deleted");
          // $.get(`/orders`, loadOrderToTable);
          gCustomerId == 0
            ? $.get(`/orders`, loadOrderToTable)
            : $.get(`customers/${gCustomerId}/orders`, loadOrderToTable);
          $("#modal-delete-order").modal("hide");
        },
        error: (err) => alert(err.responseText),
      });
    } else {
      $.ajax({
        url: `/orders/${gOrderId}`,
        method: "delete",
        success: () => {
          alert(`Order with id ${gOrderId} was successfully deleted`);
          gCustomerId == 0
            ? $.get(`/orders`, loadOrderToTable)
            : $.get(`customers/${gCustomerId}/orders`, loadOrderToTable);

          $("#modal-delete-order").modal("hide");
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
};

$("#create-order").click(order.onNewOrderClick);
$("#update-order").click(order.onUpdateOrderClick);
$("#delete-all-order").click(order.onDeleteAllOrderClick);
$("#btn-confirm-delete-order").click(order.onOrderConfirmDeleteClick);
$("#order-table").on("click", ".fa-edit", order.onEditOrderClick);
$("#order-table").on("click", ".fa-trash", order.onDeleteCustomerByIdClick);

function validateOrder(paramOrder) {
  let vResult = true;
  try {
    if (paramOrder.orderCode == "") {
      vResult = false;
      throw `Order code can't empty`;
    }
    if (paramOrder.pizzaSize == "") {
      vResult = false;
      throw `Pizza Size can't empty`;
    }
    if (paramOrder.pizzaType == "") {
      vResult = false;
      throw `Pizza Type can't empty`;
    }
    if (paramOrder.price == "" || isNaN(paramOrder.price)) {
      vResult = false;
      throw `Price cant' be empty or must is number`;
    }
    if (paramOrder.paid == "" || isNaN(paramOrder.paid)) {
      vResult = false;
      throw `Paid cant' be empty or must is number`;
    }
  } catch (e) {
    alert(e);
  }
  return vResult;
}

function loadOrderToInput(paramOrder) {
  $("#input-order-Code").val(paramOrder.orderCode);
  $("#input-pizza-size").val(paramOrder.pizzaSize);
  $("#input-pizza-type").val(paramOrder.pizzaType);
  $("#input-voucher").val(paramOrder.voucherCode);
  $("#input-Price").val(paramOrder.price);
  $("#input-Paid").val(paramOrder.paid);
}

function resetOrderInput() {
  $("#input-order-Code").val("");
  $("#input-pizza-size").val("");
  $("#input-pizza-type").val("");
  $("#input-voucher").val("");
  $("#input-Price").val("");
  $("#input-Paid").val("");
}
