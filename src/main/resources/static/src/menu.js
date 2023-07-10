let menuTable = $("#menu-table").DataTable({
  columns: [
    { data: "size" },
    { data: "diameter" },
    { data: "meat" },
    { data: "salad" },
    { data: "drinkQuantity" },
    { data: "price" },
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

function loadMenuToTable(paramMenu) {
  menuTable.clear();
  menuTable.rows.add(paramMenu);
  menuTable.draw();
}

function getMenuFromDb() {
  $.get(`/menus`, loadMenuToTable);
}
getMenuFromDb();

let gMenuId = 0;
let menu = {
  newMenu: {
    size: "",
    diameter: "",
    meat: "",
    salad: "",
    drinkQuantity: "",
    price: "",
  },
  onCreateMenuClick() {
    gMenuId = 0;
    this.newMenu = {
      size: $("#input-pizza-size").val().trim(),
      diameter: $("#input-pizza-diameter").val().trim(),
      meat: $("#input-meat").val().trim(),
      salad: $("#input-salad").val().trim(),
      drinkQuantity: $("#input-drink").val().trim(),
      price: $("#input-price").val().trim(),
    };
    if (validateMenu(this.newMenu)) {
      $.ajax({
        url: `/menus`,
        method: "POST",
        data: JSON.stringify(this.newMenu),
        contentType: "application/json",
        success: () => {
          alert("Menu created successfully");
          resetMenu();
          getMenuFromDb();
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
  onUpdateMenuClick() {
    let vSelectRow = $(this).parents("tr");
    let vSelectedData = menuTable.row(vSelectRow).data();
    gMenuId = vSelectedData.id;
    $.get(`/menus/${gMenuId}`, loadMenuToInput);
  },
  onSaveMenuClick() {
    this.newMenu = {
      size: $("#input-pizza-size").val().trim(),
      diameter: $("#input-pizza-diameter").val().trim(),
      meat: $("#input-meat").val().trim(),
      salad: $("#input-salad").val().trim(),
      drinkQuantity: $("#input-drink").val().trim(),
      price: $("#input-price").val().trim(),
    };
    if (validateMenu(this.newMenu)) {
      $.ajax({
        url: `/menus/${gMenuId}`,
        method: "PUT",
        data: JSON.stringify(this.newMenu),
        contentType: "application/json",
        success: () => {
          alert("Menu updated successfully");
          resetMenu();
          getMenuFromDb();
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
  onDeleteIconClick() {
    $("#modal-delete-menu").modal("show");
    let vSelectRow = $(this).parents("tr");
    let vSelectedData = menuTable.row(vSelectRow).data();
    gMenuId = vSelectedData.id;
  },
  onDeleteAllMenuClick() {
    $("#modal-delete-menu").modal("show");
    gMenuId = 0;
  },
  onConfirmDeleteClick() {
    if (gMenuId === 0) {
      $.ajax({
        url: `/menus`,
        method: "DELETE",
        success: () => {
          alert("All menu were successfully deleted");
          $("#modal-delete-menu").modal("hide");
          getMenuFromDb();
        },
        error: (err) => alert(err.responseText),
      });
    } else {
      $.ajax({
        url: `/menus/${gMenuId}`,
        method: "DELETE",
        success: () => {
          alert(`menu with id: ${gMenuId} was successfully deleted`);
          $("#modal-delete-menu").modal("hide");
          getMenuFromDb();
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
};

$("#create-menu").click(menu.onCreateMenuClick);
$("#menu-table").on("click", ".fa-edit", menu.onUpdateMenuClick);
$("#menu-table").on("click", ".fa-trash", menu.onDeleteIconClick);
$("#update-menu").click(menu.onSaveMenuClick);
$("#delete-all-menu").click(menu.onDeleteAllMenuClick);
$("#delete-menu").click(menu.onConfirmDeleteClick);

function validateMenu(paramMenu) {
  let vResult = true;
  try {
    if (paramMenu.size == "") {
      vResult = false;
      throw "Size không được để trống";
    }
    if (paramMenu.diameter == "") {
      vResult = false;
      throw "Đường kính không được để trống";
    }
    if (paramMenu.meat == "") {
      vResult = false;
      throw "Số lượng thịt không được để trống";
    }
    if (paramMenu.salad == "") {
      vResult = false;
      throw "Salad không được để trống";
    }
    if (paramMenu.drinkQuantity == "") {
      vResult = false;
      throw "Số lượng nước không được để trống";
    }
    if (paramMenu.price == "") {
      vResult = false;
      throw "Giá không được để trống";
    }
  } catch (e) {
    alert(e);
  }
  return vResult;
}

function loadMenuToInput(paramMenu) {
  $("#input-pizza-size").val(paramMenu.size);
  $("#input-pizza-diameter").val(paramMenu.diameter);
  $("#input-meat").val(paramMenu.meat);
  $("#input-salad").val(paramMenu.salad);
  $("#input-drink").val(paramMenu.drinkQuantity);
  $("#input-price").val(paramMenu.price);
}

function resetMenu() {
  $("#input-pizza-size").val("");
  $("#input-pizza-diameter").val("");
  $("#input-meat").val("");
  $("#input-salad").val("");
  $("#input-drink").val("");
  $("#input-price").val("");
}
