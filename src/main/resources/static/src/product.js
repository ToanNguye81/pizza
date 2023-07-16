let gProductLineId = "";
let gProductId = "";
// productLine
$.get(`/product-lines`, loadProductLineToSelect);
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
  if (gProductLineId !== "") {
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
    buyPrice: "",
    productScale: "",
    productVendor: "",
    quantityInStock: "",
  },
  onNewProductClick() {
    gProductId = "";
    this.newProduct = {
      productCode: $("#inp-product-code").val().trim(),
      productName: $("#inp-product-name").val().trim(),
      productDescription: $("#inp-product-description").val().trim(),
      buyPrice: $("#inp-buy-price").val().trim(),
      productScale: $("#inp-product-scale").val().trim(),
      productVendor: $("#inp-product-vendor").val().trim(),
      quantityInStock: $("#inp-quantity-in-stock").val().trim(),
    };
    console.log(this.newProduct.productName);
    if (validateProduct(this.newProduct)) {
      if (gProductLineId == "") {
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
          error: (err) => alert(err.responseText),
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
      productCode: $("#inp-product-code").val().trim(),
      productName: $("#inp-product-name").val().trim(),
      productDescription: $("#inp-product-description").val().trim(),
      buyPrice: $("#inp-buy-price").val().trim(),
      productScale: $("#inp-product-scale").val().trim(),
      productVendor: $("#inp-product-vendor").val().trim(),
      quantityInStock: $("#inp-quantity-in-stock").val().trim(),
    };
    if (validateProduct(this.newProduct)) {
      if (gProductLineId == "") {
        alert(`Please select productLine to update a new product`);
      } else {
        $.ajax({
          url: `product-lines/${gProductLineId}/products/${gProductId}`,
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
          error: (err) => alert(err.responseText),
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
    gProductId = "";
  },
  onProductConfirmDeleteClick() {
    if (gProductId == "") {
      $.ajax({
        url: `/products`,
        method: "DELETE",
        success: () => {
          alert("All Product was successfully deleted");
          // $.get(`/products`, loadProductToTable);
          gProductLineId == ""
            ? $.get(`/products`, loadProductToTable)
            : $.get(
                `product-lines/${gProductLineId}/products`,
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
          gProductLineId == ""
            ? $.get(`/products`, loadProductToTable)
            : $.get(
                `product-lines/${gProductLineId}/products`,
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
      throw `100. productCode can't empty`;
    }
    if (pProduct.productName == "") {
      vResult = false;
      throw `200. productName can't empty`;
    }
    if (pProduct.buyPrice == "") {
      vResult = false;
      throw `300. buyPrice can't empty`;
    }
    if (pProduct.quantityInStock == "") {
      vResult = false;
      throw `400. quantityInStock can't empty`;
    }
  } catch (e) {
    alert(e);
  }
  return vResult;
}

function loadProductToInput(pProduct) {
  $("#inp-product-code").val(pProduct.productCode);
  $("#inp-product-name").val(pProduct.productName);
  $("#inp-product-description").val(pProduct.productDescription);
  $("#inp-buy-price").val(pProduct.buyPrice);
  $("#inp-product-scale").val(pProduct.productScale);
  $("#inp-product-vendor").val(pProduct.productVendor);
  $("#inp-quantity-in-stock").val(pProduct.quantityInStock);
}

function resetProductInput() {
  $("#inp-check-number").val("");
  $("#inp-product-date").val("");
  $("#inp-productDescription").val("");
}

// productLine
let productLine = {
  newProductLine: {
    description: "",
    productLine: "",
  },
  onNewProductLineClick() {
    $("#modal-create-product-line").modal("show");
    gProductLineId = "";
  },
  onUpdateProductLineClick() {
    if (gProductLineId != "") {
      $("#modal-create-product-line").modal("show");
      $.get(`/product-lines/${gProductLineId}`, loadProductLineToInput);
    } else {
      alert("Please select productLine to update");
    }
  },
  onSaveProductLineClick() {
    this.newProductLine = {
      description: $("#inp-product-line-description").val(),
      productLine: $("#inp-product-line").val(),
    };
    if (gProductLineId == "") {
      if (validateProductLine(this.newProductLine)) {
        $.ajax({
          url: "/product-lines",
          method: "POST",
          data: JSON.stringify(this.newProductLine),
          contentType: "application/json",
          success: (productLine) => {
            alert(`Đã tạo thành công Product line`);
            $("#modal-create-product-line").modal("hide");
            resetProductLineInput();
            location.reload();
          },
          error: (err) => alert(err.responseText),
        });
      }
    } else {
      if (validateProductLine(this.newProductLine)) {
        $.ajax({
          url: `/product-lines/${gProductLineId}`,
          method: "PUT",
          data: JSON.stringify(this.newProductLine),
          contentType: "application/json",
          success: (productLine) => {
            alert(
              `Đã cập nhât thành công productLine với id: ${gProductLineId}`
            );
            $("#modal-create-product-line").modal("hide");
            resetProductLineInput();
            location.reload();
          },
          error: (err) => alert(err.responseText),
        });
      }
    }
  },
  onDeleteProductLineClick() {
    if (gProductLineId != "") {
      $("#modal-delete-product-line").modal("show");
    } else {
      alert("Please select productLine to delete");
    }
  },
  onDeleteAllProductLineClick() {
    $("#modal-delete-product-line").modal("show");
    gProductLineId == "";
  },
  onConfirmDeleteProductLineClick() {
    if (gProductLineId == "") {
      $.ajax({
        url: `/product-lines/`,
        method: "DELETE",
        success: () => {
          alert(`Successfully Delete All ProductLine`);
          location.reload();
        },
        error: () => alert(`Need delete All region then delete Product line`),
      });
    } else {
      $.ajax({
        url: `/product-lines/${gProductLineId}`,
        method: "DELETE",
        success: () => {
          alert(`Successfully Delete Product Line with id: ${gProductLineId}`);
          location.reload();
        },
        error: () => alert(`Need delete All region then delete Product line`),
      });
    }
  },
};

$("#create-product-line").click(productLine.onNewProductLineClick);
$("#update-product-line").click(productLine.onUpdateProductLineClick);
$("#btn-save-product-line").click(productLine.onSaveProductLineClick);
$("#delete-product-line").click(productLine.onDeleteProductLineClick);
$("#delete-all-product-line").click(productLine.onDeleteAllProductLineClick);
$("#btn-confirm-delete-product-line").click(
  productLine.onConfirmDeleteProductLineClick
);

function validateProductLine(pProductLine) {
  let vResult = true;
  try {
    if (pProductLine.description == "") {
      vResult = false;
      throw "Không được để trống productLine code";
    }

    if (pProductLine.productLine == "") {
      vResult = false;
      throw "Không được để trống productLine name";
    }
  } catch (e) {
    alert(e);
  }
  return vResult;
}

function loadProductLineToInput(pProductLine) {
  $("#inp-product-line").val(pProductLine.productLine);
  $("#inp-product-line-description").val(pProductLine.description);
}

function resetProductLineInput() {
  $("#inp-product-line").val("");
  $("#inp-product-line-description").val("");
}
