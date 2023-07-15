let gProductLineId = 0;
let gProductId = 0;
// productLine
$.get(`/product-lines`, loadProductLineToSelect);
$.get(`/products`, loadProductToTable);
let productLineSelectElement = $("#select-product-line");
function loadProductLineToSelect(pProductLine) {
  pProductLine.forEach((productLine) => {
    $("<option>", {
      text: productLine.productLine,
      value: productLine.id,
    }).appendTo(productLineSelectElement);
  });
}
productLineSelectElement.change(onGetProductLineChange);
function onGetProductLineChange(event) {
  gProductLineId = event.target.value;
  if (gProductLineId == 0) {
    $.get(`/products`, loadProductToTable);
  } else {
    $.get(`/product-lines/${gProductLineId}/products`, loadProductToTable);
  }
}
// product
let productTable = $("#product-table").DataTable({
  columns: [
    { data: "id" },
    { data: "productCode" },
    { data: "productName" },
    { data: "productDescription" },
    { data: "buyPrice" },
    { data: "productScale" },
    { data: "productVendor" },
    { data: "quantityInStock" },
    { data: "action" },
  ],
  columnDefs: [
    {
      targets: -1,
      defaultContent: `<i class="fas fa-edit text-primary"></i>
      |<i class="fas fa-trash text-danger"></i>`,
    },
  ],
});

function loadProductToTable(pProduct) {
  productTable.clear();
  productTable.rows.add(pProduct);
  productTable.draw();
}

let product = {
  newProduct: {
    productCode: "",
    productName: "",
    productDescription: "",
  },
  onNewProductClick() {
    gProductId = 0;
    this.newProduct = {
      productCode: $("#inp-check-number").val().trim(),
      productName: $("#inp-product-date").val().trim(),
      productDescription: $("#inp-productDescription").val().trim(),
    };
    console.log(this.newProduct.productName);
    if (validateProduct(this.newProduct)) {
      if (gProductLineId == 0) {
        alert(`Please select productLine to create a new product`);
      } else {
        $.ajax({
          url: `/product-lines/${gProductLineId}/products`,
          method: "POST",
          data: JSON.stringify(this.newProduct),
          contentType: "application/json",
          success: () => {
            alert(`Product created successfully`);
            $.get(
              `/product-lines/${gProductLineId}/products`,
              loadProductToTable
            );
            resetProductInput();
          },
        });
      }
    }
  },
  onEditProductClick() {
    vSelectedRow = $(this).parents("tr");
    vSelectedData = productTable.row(vSelectedRow).data();
    gProductId = vSelectedData.id;
    $.get(`/products/${gProductId}`, loadProductToInput);
  },
  onUpdateProductClick() {
    this.newProduct = {
      productCode: $("#inp-check-number").val().trim(),
      productName: $("#inp-product-date").val().trim(),
      productDescription: $("#inp-productDescription").val().trim(),
    };
    if (validateProduct(this.newProduct)) {
      if (gProductLineId == 0) {
        alert(`Please select productLine to update a new product`);
      } else {
        $.ajax({
          url: `/products/${gProductId}`,
          method: "PUT",
          data: JSON.stringify(this.newProduct),
          contentType: "application/json",
          success: () => {
            alert(`Product updated successfully`);
            $.get(
              `/product-lines/${gProductLineId}/products`,
              loadProductToTable
            );
            resetProductInput();
          },
        });
      }
    }
  },
  onDeleteProductLineByIdClick() {
    $("#modal-delete-product").modal("show");
    vSelectedRow = $(this).parents("tr");
    vSelectedData = productTable.row(vSelectedRow).data();
    gProductId = vSelectedData.id;
  },
  onDeleteAllProductClick() {
    $("#modal-delete-product").modal("show");
    gProductId = 0;
  },
  onProductConfirmDeleteClick() {
    if (gProductId == 0) {
      $.ajax({
        url: `/products`,
        method: "DELETE",
        success: () => {
          alert("All Product was successfully deleted");
          // $.get(`/products`, loadProductToTable);
          gProductLineId == 0
            ? $.get(`/products`, loadProductToTable)
            : $.get(
                `productLines/${gProductLineId}/products`,
                loadProductToTable
              );
          $("#modal-delete-product").modal("hide");
        },
        error: (err) => alert(err.responseText),
      });
    } else {
      $.ajax({
        url: `/products/${gProductId}`,
        method: "DELETE",
        success: () => {
          alert(`Product with id ${gProductId} was successfully deleted`);
          gProductLineId == 0
            ? $.get(`/products`, loadProductToTable)
            : $.get(
                `productLines/${gProductLineId}/products`,
                loadProductToTable
              );

          $("#modal-delete-product").modal("hide");
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
};

$("#create-product").click(product.onNewProductClick);
$("#update-product").click(product.onUpdateProductClick);
$("#delete-all-product").click(product.onDeleteAllProductClick);
$("#btn-confirm-delete-product").click(product.onProductConfirmDeleteClick);
$("#product-table").on("click", ".fa-edit", product.onEditProductClick);
$("#product-table").on(
  "click",
  ".fa-trash",
  product.onDeleteProductLineByIdClick
);

function validateProduct(pProduct) {
  let vResult = true;
  try {
    if (pProduct.productCode == "") {
      vResult = false;
      throw `100. Check number can't empty`;
    }
    if (pProduct.productName == "") {
      vResult = false;
      throw `200. Product date can't empty`;
    }
    if (pProduct.productDescription == "") {
      vResult = false;
      throw `300. Amount can't empty`;
    }
  } catch (e) {
    alert(e);
  }
  return vResult;
}

function loadProductToInput(pProduct) {
  $("#inp-check-number").val(pProduct.productCode);
  $("#inp-product-date").val(pProduct.productName);
  $("#inp-productDescription").val(pProduct.productDescription);
}

function resetProductInput() {
  $("#inp-check-number").val("");
  $("#inp-product-date").val("");
  $("#inp-productDescription").val("");
}
