let gCustomerId = "";
let gProductId = "";
let gOrderId = "";
let gCart = [];
let gOrderDetailId = "";
let customerSelectElement = $("#select-customer");
let productSelectElement = $("#select-product");
let orderSelectElement = $("#select-order");
// order
$.get(`/customers/${gCustomerId}`, loadCustomerToSelect);
$.get(`/products/`, loadProductToSelect);

//load customer to select
function loadCustomerToSelect(pCustomer) {
  pCustomer.forEach((customer) => {
    $("<option>", {
      text: customer.firstName + " " + customer.lastName,
      value: customer.id,
    }).appendTo(customerSelectElement);
  });
}

//load product to select
function loadProductToSelect(pProduct) {
  pProduct.forEach((product) => {
    $("<option>", {
      text: product.productName,
      value: product.id,
      "data-price": product.buyPrice,
      "data-name": product.productName,
      "data-code": product.productCode,
    }).appendTo(productSelectElement);
  });
}
// event onChange customer select
customerSelectElement.change(onGetCustomerChange);
// event onChange customer select
productSelectElement.change(onGetProductChange);
// on get customer change
function onGetCustomerChange(event) {
  gCustomerId = event.target.value;
  $.get(`/customers/${gCustomerId}/orders`, loadOrderToSelect);
  $("#customer-of-order").val($("#select-customer option:selected").text());
}
function onGetProductChange(event) {
  gProductId = event.target.value;
  $("#inp-price-each").val($("#select-product option:selected").data("price"));
}

$.get(`orders/${gOrderId}/order-details`, loadOrderDetailToTable);

//load order to select
function loadOrderToSelect(pOrder) {
  orderSelectElement
    .empty()
    .append('<option selected="selected" value="">Choose order</option>');
  pOrder.forEach((order) => {
    $("<option>", {
      text: order.comments,
      value: order.id,
    }).appendTo(orderSelectElement);
  });
}

orderSelectElement.change(onGetOrderChange);
function onGetOrderChange(event) {
  gOrderId = event.target.value;
  if (gOrderId !== "") {
    $.get(`/orders/${gOrderId}/order-details`, loadOrderDetailToTable);
  }
}

let order = {
  newOrder: {
    customerId: "",
    comments: "",
    status: "",
    cart: [],
  },
  onCreateNewOrderClick() {
    this.newOrder = {
      customerId: gCustomerId,
      comments: $("#inp-comments").val().trim(),
      cart: gCart,
    };
    if (validateOrder(this.newOrder)) {
      $.ajax({
        url: `/orders`,
        method: "POST",
        data: JSON.stringify(this.newOrder),
        contentType: "application/json",
        success: () => {
          alert(`Order created successfully`);
          $.get(`/orders`, loadOrderToTable);
          resetOrderInput();
        },
      });
    }
  },
  onUpdateOrderClick() {
    if (gOrderId !== "") {
      $("#modal-create-order").modal("show");
      $.get(`/orders/${gOrderId}`, loadOrderToInput);
    } else {
      alert("Please select a order to update");
    }
  },
  onSaveOrderClick() {
    this.newOrder = {
      status: $("#inp-status").val().trim(),
      comments: $("#inp-comments").val().trim(),
      requiredDate: $("#inp-required-date").val().trim(),
      orderDate: $("#inp-order-date").val().trim(),
      shippedDate: $("#inp-shipped-date").val().trim(),
    };
    if (gOrderId !== "") {
      if (validateOrder(this.newOrder)) {
        $.ajax({
          url: `/customers/${gCustomerId}/orders`,
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify(this.newOrder),
          success: (data) => {
            alert("successfully create new order");
            location.reload();
          },
          error: (err) => alert(err.responseText),
        });
      }
    } else {
      if (validateOrder(this.newOrder)) {
        $.ajax({
          url: `/customers/${gCustomerId}/orders/${gOrderId}`,
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
$("#btn-add-to-cart").click(addToCart);
$("#btn-create-order").click(order.onCreateNewOrderClick);
$("#btn-update-order").click(order.onUpdateOrderClick);
$("#btn-save-order").click(order.onSaveOrderClick);
$("#btn-delete-order").click(order.onDeleteOrderClick);
$("#btn-delete-all-order").click(order.onDeleteAllOrderClick);
$("#btn-confirm-delete-order").click(order.onConfirmDeleteOrderClick);

function loadOrderToInput(pOrder) {
  console.log(pOrder);
  $("#select-customer").val(pOrder.customer);
  $("#inp-order-date").val(pOrder.orderDate);
  $("#inp-required-date").val(pOrder.requiredDate);
  $("#inp-shipped-date").val(pOrder.shippedDate);
  $("#inp-status").val(pOrder.status);
  $("#inp-comments").val(pOrder.comments);
}

function validateOrder(pOrder) {
  let vResult = true;
  try {
    if (pOrder.orderDate == "") {
      vResult = false;
      throw `order date can't be empty`;
    }
    if (pOrder.requiredDate == "") {
      vResult = false;
      throw ` required Date can't be empty`;
    }
    if (pOrder.shippedDate == "") {
      vResult = false;
      throw `shipped Date can't be empty`;
    }
    if (pOrder.status == "") {
      vResult = false;
      throw `Status can't be empty`;
    }
    if (pOrder.comments == "") {
      vResult = false;
      throw `Comments can't be empty`;
    }
  } catch (e) {
    alert(e);
  }
  return vResult;
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

//Cart
let cartTable = $("#cart-table").DataTable({
  columns: [
    { data: "product.id" },
    { data: "product.productName" },
    { data: "product.productCode" },
    { data: "product.buyPrice" },
    { data: "quantity" },
    { data: "Action" },
  ],
  columnDefs: [
    {
      targets: -1,
      defaultContent: `<i class="fas fa-plus text-primary"></i>
      | <i class="fas fa-minus text-danger"></i>
      | <i class="fas fa-trash text-danger"></i>`,
    },
  ],
});

function loadCartToTable(products) {
  cartTable.clear();
  cartTable.rows.add(products);
  cartTable.draw();
}

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
      orderCode: $("#inp-order-Code").val().trim(),
      pizzaSize: $("#inp-pizza-size").val().trim(),
      pizzaType: $("#inp-pizza-type").val().trim(),
      voucherCode: $("#inp-voucher").val().trim(),
      price: $("#inp-Price").val().trim(),
      paid: $("#inp-Paid").val().trim(),
    };
    if (validateOrderDetail(this.newOrderDetail)) {
      if (gOrderId !== "") {
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
      orderCode: $("#inp-order-Code").val().trim(),
      pizzaSize: $("#inp-pizza-size").val().trim(),
      pizzaType: $("#inp-pizza-type").val().trim(),
      voucherCode: $("#inp-voucher").val().trim(),
      price: $("#inp-Price").val().trim(),
      paid: $("#inp-Paid").val().trim(),
    };
    if (validateOrderDetail(this.newOrderDetail)) {
      if (gOrderId !== "") {
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
    if (gOrderDetailId !== "") {
      $.ajax({
        url: `/order-details`,
        method: "delete",
        success: () => {
          alert("All OrderDetail was successfully deleted");
          // $.get(`/order-details`, loadOrderDetailToTable);
          gOrderId !== ""
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
          gOrderId !== ""
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
// $("#order-table").on("click", ".fa-edit", order.onEditOrderDetailClick);
// $("#order-table").on("click", ".fa-trash", order.onDeleteOrderByIdClick);

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
  $("#inp-order-Code").val(pOrderDetail.orderCode);
  $("#inp-pizza-size").val(pOrderDetail.pizzaSize);
  $("#inp-pizza-type").val(pOrderDetail.pizzaType);
  $("#inp-voucher").val(pOrderDetail.voucherCode);
  $("#inp-Price").val(pOrderDetail.price);
  $("#inp-Paid").val(pOrderDetail.paid);
}

function resetOrderDetailInput() {
  $("#inp-order-Code").val("");
  $("#inp-pizza-size").val("");
  $("#inp-pizza-type").val("");
  $("#inp-voucher").val("");
  $("#inp-Price").val("");
  $("#inp-Paid").val("");
}

$("#order-table").on("click", ".fa-plus", onPlusClick);
$("#order-table").on("click", ".fa-minus", onSubtractClick);
//Add to cart
function addToCart() {
  if (gProductId !== "") {
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng hay chưa
    let existingItemIndex = gCart.findIndex(
      (item) => item.product.id === gProductId
    );

    if (existingItemIndex !== -1) {
      // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
      gCart[existingItemIndex].quantity += 1;
    } else {
      // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm mới vào
      let cartItem = {
        product: {
          id: gProductId,
          productCode: $("#select-product option:selected").data("code"),
          productName: $("#select-product option:selected").data("name"),
          buyPrice: $("#select-product option:selected").data("price"),
        },
        quantity: 1,
      };
      gCart.push(cartItem);
    }
    loadCartToTable(gCart);
  } else {
    alert("Choose 1 product!");
  }
}

function onPlusClick() {
  let vSelectedRow = $(this).parents("tr");
  let vSelectedData = cartTable.row(vSelectedRow).data();
  gProductId = vSelectedData.id;
  console.log(gProductId);
}

function onSubtractClick() {
  console.log(event.target.value);
}
