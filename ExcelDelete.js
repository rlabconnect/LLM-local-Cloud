const fs = require("fs");
const reader = require("xlsx");

function DeleteFromExcel() {
  try {
    const filePath = "./studentdata.xlsx";
    let workbook;
    let sheetName = "Sheet3";

    if (fs.existsSync(filePath)) {
      workbook = reader.readFile(filePath);
      workbook.Sheets[sheetName] = reader.utils.json_to_sheet([]); // Empty the sheet
      reader.writeFile(workbook, filePath);
      console.log("Data deleted successfully.");
    } else {
      console.log("File does not exist.");
    }
  } catch (error) {
    console.error("Error deleting data from Excel:", error);
  }
};
DeleteFromExcel()
