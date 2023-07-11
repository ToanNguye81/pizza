let gOrderId = 0;
let gOrderDetailId = 0;
let gCustomerId = 0;
// order
$.get(`/orders`, loadOrderToSelect);
$.get(`/order-details`, loadOrderDetailToTable);
let customerSelectElement = $("#select-customer");
let orderSelectElement = $("#select-order");

function loadOrderToSelect(pOrder) {
  pOrder.forEach((order) => {
    $("<option>", {
      text: order.comments,
      value: order.id,
    }).appendTo(orderSelectElement);
  });
}

function loadCustomerToSelect(pCustomer) {
  pCustomer.forEach((customer) => {
    $("<option>", {
      text: customer.comments,
      value: customer.id,
    }).appendTo(customerSelectElement);
  });
}

orderSelectElement.change(onGetOrderChange);
function onGetOrderChange(event) {
  gOrderId = event.target.value;
  if (gOrderId == 0) {
    $.get(`/order-details`, loadOrderDetailToTable);
  } else {
    $.get(`/orders/${gOrderId}/order-details`, loadOrderDetailToTable);
  }
}

let order = {
  newOrder: {
    status: "",
    comments: "",
    requiredDate: "",
    orderDate: "",
    shippedDate: "",
  },
  onCreateNewOrderClick() {
    gOrderId = 0;
    $("#modal-create-order").modal("show");
  },
  onUpdateOrderClick() {
    if (gOrderId != 0) {
      $("#modal-create-order").modal("show");
      $.get(`/orders/${gOrderId}`, loadOrderToInput);
    } else {
      alert("Please select a order to update");
    }
  },
  onSaveOrderClick() {
    this.newOrder = {
      fullName: $("#input-fullName").val().trim(),
      email: $("#input-email").val().trim(),
      phone: $("#input-phone").val().trim(),
      address: $("#input-address").val().trim(),
    };
    if (gOrderId == 0) {
      if (validateOrder(this.newOrder)) {
        $.ajax({
          url: `/orders`,
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify(this.newOrder),
          success: () => {
            alert("successfully create new order");
            location.reload();
          },
          error: (err) => alert(err.responseText),
        });
      }
    } else {
      if (validateOrder(this.newOrder)) {
        $.ajax({
          url: `/orders/${gOrderId}`,
          method: "PUT",
          contentType: "application/json",
          data: JSON.stringify(this.newOrder),
          success: () => {
            alert("successfully update order with id: " + gOrderId);
            location.reload();
          },
          error: (err) => alert(err.responseText),
        });
      }
    }
  },
  onDeleteOrderClick() {
    if (gOrderId != 0) {
      $("#modal-delete-order").modal("show");
    } else {
      alert("Please select a order to delete");
    }
  },
  onDeleteAllOrderClick() {
    gOrderId = 0;
    $("#modal-delete-order").modal("show");
  },
  onConfirmDeleteOrderClick() {
    if (gOrderId != 0) {
      $.ajax({
        url: `/orders/${gOrderId}`,
        method: "delete",
        success: () => {
          alert("successfully delete order with id:" + gOrderId);
          location.reload();
        },
        error: (err) => alert(err.responseText),
      });
    } else {
      $.ajax({
        url: `/orders`,
        method: "delete",
        success: () => {
          alert("successfully delete all orders");
          location.reload();
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
};

$("#btn-create-order").click(order.onCreateNewOrderClick);
$("#btn-update-order").click(order.onUpdateOrderClick);
$("#btn-save-order").click(order.onSaveOrderClick);
$("#btn-delete-order").click(order.onDeleteOrderClick);
$("#btn-delete-all-order").click(order.onDeleteAllOrderClick);
$("#btn-confirm-delete-order").click(order.onConfirmDeleteOrderClick);

function loadOrderToInput(pOrder) {
  $("#input-fullName").val(pOrder.fullName);
  $("#input-email").val(pOrder.email);
  $("#input-phone").val(pOrder.phone);
  $("#input-address").val(pOrder.address);
}

function validateOrder(pOrder) {
  let vResult = true;
  try {
    if (pOrder.fullName == "") {
      vResult = false;
      throw `full name can't be empty`;
    }

    if (pOrder.email == "") {
      vResult = false;
      throw ` email can't be empty`;
    }
    if (!validateEmail(pOrder.email)) {
      vResult = false;
      throw `must need right email`;
    }
    if (pOrder.phone == "") {
      vResult = false;
      throw `phone can't be empty`;
    }
    if (pOrder.phone.length < 10 || isNaN(pOrder.phone)) {
      vResult = false;
      throw `Cần nhập đúng kiểu số điện thoại phải không có chữ cái và đúng 10 số`;
    }
    if (pOrder.address == "") {
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

function loadOrderDetailToTable(pOrderDetail) {
  orderTable.clear();
  orderTable.rows.add(pOrderDetail);
  orderTable.draw();
}

let orderDetail = {
  newOrderDetail: {
    orderCode: "",
    pizzaSize: "",
    pizzaType: "",
    voucherCode: "",
    price: "",
    paid: "",
  },
  onNewOrderDetailClick() {
    gOrderDetailId = 0;
    this.newOrderDetail = {
      orderCode: $("#input-order-Code").val().trim(),
      pizzaSize: $("#input-pizza-size").val().trim(),
      pizzaType: $("#input-pizza-type").val().trim(),
      voucherCode: $("#input-voucher").val().trim(),
      price: $("#input-Price").val().trim(),
      paid: $("#input-Paid").val().trim(),
    };
    if (validateOrderDetail(this.newOrderDetail)) {
      if (gOrderId == 0) {
        alert(`Please select order to create a new order`);
      } else {
        $.ajax({
          url: `/orders/${gOrderId}/order-details`,
          method: "POST",
          data: JSON.stringify(this.newOrderDetail),
          contentType: "application/json",
          success: () => {
            alert(`OrderDetail created successfully`);
            $.get(`/orders/${gOrderId}/order-details`, loadOrderDetailToTable);
            resetOrderDetailInput();
          },
        });
      }
    }
  },
  onEditOrderDetailClick() {
    vSelectedRow = $(this).parents("tr");
    vSelectedData = orderTable.row(vSelectedRow).data();
    gOrderDetailId = vSelectedData.id;
    $.get(`/order-details/${gOrderDetailId}`, loadOrderDetailToInput);
  },
  onUpdateOrderDetailClick() {
    this.newOrderDetail = {
      orderCode: $("#input-order-Code").val().trim(),
      pizzaSize: $("#input-pizza-size").val().trim(),
      pizzaType: $("#input-pizza-type").val().trim(),
      voucherCode: $("#input-voucher").val().trim(),
      price: $("#input-Price").val().trim(),
      paid: $("#input-Paid").val().trim(),
    };
    if (validateOrderDetail(this.newOrderDetail)) {
      if (gOrderId == 0) {
        alert(`Please select order to update a new order`);
      } else {
        $.ajax({
          url: `/order-details/${gOrderDetailId}`,
          method: "PUT",
          data: JSON.stringify(this.newOrderDetail),
          contentType: "application/json",
          success: () => {
            alert(`OrderDetail updated successfully`);
            $.get(`/orders/${gOrderId}/order-details`, loadOrderDetailToTable);
            resetOrderDetailInput();
          },
        });
      }
    }
  },
  onDeleteOrderByIdClick() {
    $("#modal-delete-order").modal("show");
    vSelectedRow = $(this).parents("tr");
    vSelectedData = orderTable.row(vSelectedRow).data();
    gOrderDetailId = vSelectedData.id;
  },
  onDeleteAllOrderDetailClick() {
    $("#modal-delete-order").modal("show");
    gOrderDetailId = 0;
  },
  onOrderDetailConfirmDeleteClick() {
    if (gOrderDetailId == 0) {
      $.ajax({
        url: `/order-details`,
        method: "delete",
        success: () => {
          alert("All OrderDetail was successfully deleted");
          // $.get(`/order-details`, loadOrderDetailToTable);
          gOrderId == 0
            ? $.get(`/order-details`, loadOrderDetailToTable)
            : $.get(`orders/${gOrderId}/order-details`, loadOrderDetailToTable);
          $("#modal-delete-order").modal("hide");
        },
        error: (err) => alert(err.responseText),
      });
    } else {
      $.ajax({
        url: `/order-details/${gOrderDetailId}`,
        method: "delete",
        success: () => {
          alert(
            `OrderDetail with id ${gOrderDetailId} was successfully deleted`
          );
          gOrderId == 0
            ? $.get(`/order-details`, loadOrderDetailToTable)
            : $.get(`orders/${gOrderId}/order-details`, loadOrderDetailToTable);

          $("#modal-delete-order").modal("hide");
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
};

$("#create-order").click(order.onNewOrderDetailClick);
$("#update-order").click(order.onUpdateOrderDetailClick);
$("#delete-all-order").click(order.onDeleteAllOrderDetailClick);
$("#btn-confirm-delete-order").click(order.onOrderDetailConfirmDeleteClick);
$("#order-table").on("click", ".fa-edit", order.onEditOrderDetailClick);
$("#order-table").on("click", ".fa-trash", order.onDeleteOrderByIdClick);

function validateOrderDetail(pOrderDetail) {
  let vResult = true;
  try {
    if (pOrderDetail.orderCode == "") {
      vResult = false;
      throw `OrderDetail code can't empty`;
    }
    if (pOrderDetail.pizzaSize == "") {
      vResult = false;
      throw `Pizza Size can't empty`;
    }
    if (pOrderDetail.pizzaType == "") {
      vResult = false;
      throw `Pizza Type can't empty`;
    }
    if (pOrderDetail.price == "" || isNaN(pOrderDetail.price)) {
      vResult = false;
      throw `Price cant' be empty or must is number`;
    }
    if (pOrderDetail.paid == "" || isNaN(pOrderDetail.paid)) {
      vResult = false;
      throw `Paid cant' be empty or must is number`;
    }
  } catch (e) {
    alert(e);
  }
  return vResult;
}

function loadOrderDetailToInput(pOrderDetail) {
  $("#input-order-Code").val(pOrderDetail.orderCode);
  $("#input-pizza-size").val(pOrderDetail.pizzaSize);
  $("#input-pizza-type").val(pOrderDetail.pizzaType);
  $("#input-voucher").val(pOrderDetail.voucherCode);
  $("#input-Price").val(pOrderDetail.price);
  $("#input-Paid").val(pOrderDetail.paid);
}

function resetOrderDetailInput() {
  $("#input-order-Code").val("");
  $("#input-pizza-size").val("");
  $("#input-pizza-type").val("");
  $("#input-voucher").val("");
  $("#input-Price").val("");
  $("#input-Paid").val("");
}
