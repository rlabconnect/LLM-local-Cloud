const OpenAI = require('openai');
const fs = require('fs'); // Sync functions
const fsPromises = require('fs').promises; // Async functions
const reader = require("xlsx");

const openai = new OpenAI({
  apiKey: '',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

async function main(num) {
  let maincontent = "";
  try {
    const filepath = `./recognized_txt${num}/recognized_text.txt`;
    const filecontent = await fsPromises.readFile(filepath, "utf-8");

    const completion = await openai.chat.completions.create({
      model: "nvidia/llama-3.1-nemotron-70b-instruct",
      messages: [{ "role": "user", "content": filecontent }],
      temperature: 0.5,
      top_p: 1,
      max_tokens: 1024,
      stream: true,
    });

    for await (const chunk of completion) {
      maincontent += chunk.choices[0]?.delta?.content || '';
    }
    console.log(maincontent)
    return maincontent;
  } catch (error) {
    console.log("Some error occurred ", error);
  }
}

function WriteToExcel(message) {
  try {
    const startindex = message.indexOf("[");
    const endindex = message.indexOf("]") + 1;
    const jsonstring = message.slice(startindex, endindex);
    const data = JSON.parse(jsonstring);

    const filePath = "./studentdata.xlsx";
    let workbook;
    let worksheet;
    let sheetName = "Sheet3";

    if (fs.existsSync(filePath)) {
      workbook = reader.readFile(filePath);
      worksheet = workbook.Sheets[sheetName];

      if (!worksheet) {
        worksheet = reader.utils.json_to_sheet(data);
        reader.utils.book_append_sheet(workbook, worksheet, sheetName);
      } else {
        const existingData = reader.utils.sheet_to_json(worksheet);
        const newData = existingData.concat(data);
        worksheet = reader.utils.json_to_sheet(newData);
        workbook.Sheets[sheetName] = worksheet;
      }
    } else {
      workbook = reader.utils.book_new();
      worksheet = reader.utils.json_to_sheet(data);
      reader.utils.book_append_sheet(workbook, worksheet, sheetName);
    }

    reader.writeFile(workbook, filePath);
    console.log("Data appended successfully.");
  } catch (error) {
    console.error("Error writing to Excel:", error);
  }
}

// main();
module.exports = main;
