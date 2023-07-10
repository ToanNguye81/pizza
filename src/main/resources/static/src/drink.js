"use strict";
let gDrinkId = 0;
let drink = {
  newDrink: {
    drinkCode: "",
    drinkName: "",
    price: "",
    note: "",
  },
  onCreateNewDrinkClick() {
    this.newDrink = {
      drinkCode: $("#input-drink-code").val().trim(),
      drinkName: $("#input-drink-name").val(),
      price: $("#input-drink-price").val().trim(),
      note: $("#input-note").val().trim(),
    };
    if (validateDrink(this.newDrink)) {
      $.ajax({
        url: "drinks",
        method: "POST",
        data: JSON.stringify(this.newDrink),
        contentType: "application/json",
        success: (data) => {
          alert("Drink created successfully");
          getDrinkFromDb();
          resetDrinkInput();
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
  onUpdateDrinkClick() {
    let vSelectedRow = $(this).parents("tr");
    let vSelectedData = drinkTable.row(vSelectedRow).data();
    gDrinkId = vSelectedData.id;
    $.get(`drinks/${gDrinkId}`, loadDrinkToInput);
  },
  onSaveDrinkClick() {
    this.newDrink = {
      drinkCode: $("#input-drink-code").val().trim(),
      drinkName: $("#input-drink-name").val().trim(),
      price: $("#input-drink-price").val().trim(),
      note: $("#input-note").val().trim(),
    };
    if (validateDrink(this.newDrink)) {
      $.ajax({
        url: `drinks/${gDrinkId}`,
        method: "PUT",
        data: JSON.stringify(this.newDrink),
        contentType: "application/json",
        success: (data) => {
          alert("Drink updated successfully");
          getDrinkFromDb();
          gDrinkId = 0;
          resetDrinkInput();
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
  onDeleteDrinkByIdClick() {
    $("#modal-delete-drink").modal("show");
    let vSelectedRow = $(this).parents("tr");
    let vSelectedData = drinkTable.row(vSelectedRow).data();
    gDrinkId = vSelectedData.id;
  },
  onDeleteAllDrinkClick() {
    $("#modal-delete-drink").modal("show");
    gDrinkId = 0;
  },
  onDeleteConfirmClick() {
    if (gDrinkId == 0) {
      $.ajax({
        url: "/drinks",
        method: "DELETE",
        success: () => {
          alert("All drink were successfully deleted");
          getDrinkFromDb();
          $("#modal-delete-drink").modal("hide");
        },
        error: (err) => alert(err.responseText),
      });
    } else {
      $.ajax({
        url: `/drinks/${gDrinkId}`,
        method: "DELETE",
        success: () => {
          alert(`Drink with id: ${gDrinkId} was successfully deleted`);
          getDrinkFromDb();
          $("#modal-delete-drink").modal("hide");
        },
        error: (err) => alert(err.responseText),
      });
    }
  },
};

let drinkTable = $("#drink-table").DataTable({
  columns: [
    { data: "id" },
    { data: "drinkCode" },
    { data: "drinkName" },
    { data: "price" },
    { data: "note" },
    { data: "dayCreated" },
    { data: "dayUpdated" },
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

function loadDrinkOnTable(paramDrinks) {
  "use strict";
  drinkTable.clear();
  drinkTable.rows.add(paramDrinks);
  drinkTable.draw();
}

function getDrinkFromDb() {
  "use strict";
  $.get("/drinks", (drink) => loadDrinkOnTable(drink));
}
getDrinkFromDb();

$("#create-drink").click(drink.onCreateNewDrinkClick);
$("#drink-table").on("click", ".fa-edit", drink.onUpdateDrinkClick);
$("#drink-table").on("click", ".fa-trash", drink.onDeleteDrinkByIdClick);
$("#update-drink").click(drink.onSaveDrinkClick);
$("#delete-all-drink").click(drink.onDeleteAllDrinkClick);
$("#delete-drink").click(drink.onDeleteConfirmClick);

function loadDrinkToInput(paramDrinks) {
  $("#input-drink-code").val(paramDrinks.drinkCode);
  $("#input-drink-name").val(paramDrinks.drinkName);
  $("#input-drink-price").val(paramDrinks.price);
  $("#input-note").val(paramDrinks.note);
}

function resetDrinkInput() {
  $("#input-drink-code").val("");
  $("#input-drink-name").val("");
  $("#input-drink-price").val("");
  $("#input-note").val("");
}

function validateDrink(paramDrinks) {
  "use strict";
  let vResult = true;
  try {
    if (paramDrinks.drinkCode == "") {
      vResult = false;
      throw "100.cần nhập mã nước uống";
    }
    if (paramDrinks.drinkName == "") {
      vResult = false;
      throw "200.cần nhập tên nước uống";
    }
    if (
      isNaN(paramDrinks.price) ||
      paramDrinks.price < 0 ||
      paramDrinks.price == ""
    ) {
      vResult = false;
      throw "cần nhập giá nước uống";
    }
  } catch (e) {
    alert(e);
  }
  return vResult;
}
