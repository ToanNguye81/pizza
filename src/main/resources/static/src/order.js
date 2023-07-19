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
  debugger;
  gCustomerId = event.target.value;
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
    debugger;
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

$("#btn-create-order").click(order.onCreateNewOrderClick);
$("#btn-update-order").click(order.onUpdateOrderClick);
$("#btn-save-order").click(order.onSaveOrderClick);
$("#btn-delete-order").click(order.onDeleteOrderClick);
$("#btn-delete-all-order").click(order.onDeleteAllOrderClick);
$("#btn-confirm-delete-order").click(order.onConfirmDeleteOrderClick);

function loadOrderToInput(pOrder) {
  $("#select-customer").val(pOrder.customer);
  $("#inp-order-date").val(pOrder.orderDate);
  $("#inp-required-date").val(pOrder.requiredDate);
  $("#inp-shipped-date").val(pOrder.shippedDate);
  $("#inp-status").val(pOrder.status);
  $("#inp-comments").val(pOrder.comments);
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
  console.log(pOrder);
  orderTable.clear();
  orderTable.rows.add(pOrder);
  orderTable.draw();
}

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

function addToCart() {
  if (gProductId !== 0) {
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
