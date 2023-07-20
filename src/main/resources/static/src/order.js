let gCustomerId = "";
let gProductId = 0;
let gOrderId = "";
let gCart = [];
let gOrderDetailId = "";
let customerSelectEle = $("#select-customer");
let productSelectEle = $("#select-product");
let orderSelectEle = $("#select-order");

$.get(`/customers/${gCustomerId}`, loadCustomerToSelect);
$.get(`/products/`, loadProductToSelect);

//load customer to select
function loadCustomerToSelect(pCustomer) {
  pCustomer.forEach((customer) => {
    $("<option>", {
      text: customer.firstName + " " + customer.lastName,
      value: customer.id,
    }).appendTo(customerSelectEle);
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
    }).appendTo(productSelectEle);
  });
}
// event onChange customer select
customerSelectEle.change(onGetCustomerChange);

// event onChange customer select
productSelectEle.change(onGetProductChange);

// event onChange order select
orderSelectEle.change(onGetOrderChange);

// on get customer change
function onGetCustomerChange(event) {
  gCustomerId = event.target.value;
  $("#customer-of-order").val($("#select-customer option:selected").text());
  $.get(`/customers/${gCustomerId}/orders`, loadOrderToTable);
}
// on get product change
function onGetProductChange(event) {
  gProductId = event.target.value;
  $("#inp-price-each").val($("#select-product option:selected").data("price"));
}
// on get order change
function onGetOrderChange(event) {
  gOrderId = event.target.value;
  if (gOrderId !== "") {
    // $.get(`/orders/${gOrderId}/order-details`, loadOrderDetailToTable);
  }
}
//load order to select
function loadOrderToSelect(pOrder) {
  orderSelectEle
    .empty()
    .append('<option selected="selected" value="">Choose order</option>');
  pOrder.forEach((order) => {
    $("<option>", {
      text: order.comments,
      value: order.id,
    }).appendTo(orderSelectEle);
  });
}

// order
let order = {
  newOrder: {
    customerId: "",
    comments: "",
    status: "",
    cart: [],
  },
  onCreateNewOrderClick() {
    this.newOrder = {
      customerId: parseInt(gCustomerId, 10),
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
          $.get(`/customers/${gCustomerId}/orders`, loadOrderToTable);
        },
      });
    }
  },
};

$("#btn-save-order").click(onSaveOrderClick);
$("#btn-confirm-delete-order").click(onConfirmDeleteOrderClick);

function loadOrderToInput(pOrder) {
  $("#inp-order-date").val(pOrder.orderDate);
  $("#inp-required-date").val(pOrder.requiredDate);
  $("#inp-shipped-date").val(pOrder.shippedDate);
  $("#inp-status").val(pOrder.status);
  $("#inp-update-comments").val(pOrder.comments);
}

function validateOrder(pOrder) {
  let vResult = true;
  console.pOrder;
  try {
    if (isNaN(pOrder.customerId)) {
      vResult = false;
      throw `Customer can't be empty`;
    }
    if (pOrder.cart.length == 0) {
      vResult = false;
      throw `Cart can't be empty`;
    }
  } catch (e) {
    alert(e);
  }
  return vResult;
}
let orderTable = $("#order-table").DataTable({
  columns: [
    { data: "id" },
    { data: "orderDate" },
    { data: "shippedDate" },
    { data: "requiredDate" },
    { data: "status" },
    { data: "comments" },
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

function loadOrderToTable(pOrder) {
  orderTable.clear();
  orderTable.rows.add(pOrder);
  orderTable.draw();
}

//Add to cart
$("#order-table").on("click", ".fa-edit", onUpdateOrderClick);
$("#order-table").on("click", ".fa-trash", onDeleteOrderClick);

//Add to cart
$("#cart-table").on("click", ".fa-plus", onPlusClick);
$("#cart-table").on("click", ".fa-minus", onSubtractClick);
$("#cart-table").on("click", ".fa-trash", onDeleteClick);
$("#btn-add-to-cart").on("click", addToCart);

function onPlusClick() {
  let vSelectedRow = $(this).parents("tr");
  let vSelectedData = cartTable.row(vSelectedRow).data();
  let productId = vSelectedData.product.id;

  let index = gCart.findIndex((item) => item.product.id === productId);
  if (index !== -1) {
    gCart[index].quantity++;
  }
  loadCartToTable(gCart);
}

function onSubtractClick() {
  let vSelectedRow = $(this).parents("tr");
  let vSelectedData = cartTable.row(vSelectedRow).data();
  let productId = vSelectedData.product.id;

  let index = gCart.findIndex((item) => item.product.id === productId);
  if (index !== -1) {
    if (gCart[index].quantity > 1) {
      gCart[index].quantity--;
    } else {
      gCart.splice(index, 1);
    }
  }
  loadCartToTable(gCart);
}

function onDeleteClick() {
  let vSelectedRow = $(this).parents("tr");
  let vSelectedData = cartTable.row(vSelectedRow).data();
  let productId = vSelectedData.product.id;
  let index = gCart.findIndex((item) => item.product.id === productId);
  if (index !== -1) {
    gCart.splice(index, 1);
  }
  loadCartToTable(gCart);
}
// Add product
function addToCart() {
  if (gProductId !== 0) {
    let existingItemIndex = gCart.findIndex(
      (item) => item.product.id === gProductId
    );

    if (existingItemIndex !== -1) {
      gCart[existingItemIndex].quantity += 1;
    } else {
      let cartItem = {
        productId: parseInt(gProductId, 10),
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

//update order
function onSaveOrderClick() {
  newOrder = {
    status: $("#inp-status").val().trim(),
    orderDate: $("#inp-order-date").val().trim(),
    comments: $("#inp-update-comments").val().trim(),
    requiredDate: $("#inp-required-date").val().trim(),
    shippedDate: $("#inp-shipped-date").val().trim(),
  };

  $.ajax({
    url: `/customers/${gCustomerId}/orders/${gOrderId}`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(newOrder),
    success: () => {
      alert("successfully update order with id: " + gOrderId);
      $.get(`/customers/${gCustomerId}/orders`, loadOrderToTable);
      $("#modal-update-order").modal("hide");
    },
    error: (err) => alert(err.responseText),
  });
}

//Delete order
function onDeleteOrderClick() {
  let vSelectedRow = $(this).parents("tr");
  let vSelectedData = orderTable.row(vSelectedRow).data();
  gOrderId = vSelectedData.id;
  $.get(`/orders/${gOrderId}`, loadOrderToInput);
  $("#modal-delete-order").modal("show");
}

function onUpdateOrderClick() {
  let vSelectedRow = $(this).parents("tr");
  let vSelectedData = orderTable.row(vSelectedRow).data();
  gOrderId = vSelectedData.id;
  $.get(`/orders/${gOrderId}`, loadOrderToInput);
  $("#modal-update-order").modal("show");
}

function onConfirmDeleteOrderClick() {
  $.ajax({
    url: `/orders/${gOrderId}`,
    method: "DELETE",
    success: () => {
      alert("successfully delete order with id:" + gOrderId);
      $.get(`/customers/${gCustomerId}/orders`, loadOrderToTable);
      $("#modal-delete-order").modal("hide");
    },
    error: (err) => alert(err.responseText),
  });
}
