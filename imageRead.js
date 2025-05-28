const axios = require("axios");
const fs = require("fs");
const path = require("path");

const endpoint = "";
const subscriptionKey = "";


// Function to get all image file paths
async function getImageFilePaths(dirname) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        reject(err);
      } else {
        resolve(files.map(file => path.join(dirname, file)));
      }
    });
  });
}

// Function to recognize handwriting from an image
async function recognizeHandwriting(imageFilePath) {
  try {
    const imageBuffer = fs.readFileSync(imageFilePath);
    const readResponse = await axios.post(
      `${endpoint}/vision/v3.2/read/analyze`,
      imageBuffer,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": subscriptionKey,
          "Content-Type": "application/octet-stream",
        },
      }
    );

    const operationLocation = readResponse.headers["operation-location"];
    console.log("Operation location for", imageFilePath, ":", operationLocation);

    let result = null;
    while (!result || result.status === "running" || result.status === "notStarted") {
      console.log("Waiting for the result for", imageFilePath, "...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      const resultResponse = await axios.get(operationLocation, {
        headers: {
          "Ocp-Apim-Subscription-Key": subscriptionKey,
        },
      });
      result = resultResponse.data;
    }

    let recognizedText = "";
    if (result.status === "succeeded") {
      console.log("Recognized Text for", imageFilePath, ":");
      result.analyzeResult.readResults.forEach(page => {
        page.lines.forEach(line => {
          recognizedText += line.text + "\n";
        });
      });
    } else {
      console.log("Failed to analyze the handwriting for", imageFilePath);
    }

    return recognizedText.trim();
  } catch (error) {
    console.error("Error for", imageFilePath, ":", error.response ? error.response.data : error.message);
    return null;
  }
}

// Process images after ensuring the file list is ready
async function processImages(num,filterText="all") {
  const dirname = path.join(__dirname, `output-images${num}`);
  try {
    const imageFilePaths = await getImageFilePaths(dirname); // Wait until files are loaded
    let allRecognizedText = "";

    for (const imageFilePath of imageFilePaths) {
      const recognizedText = await recognizeHandwriting(imageFilePath);
      if (recognizedText) {
        allRecognizedText += recognizedText + "\n\n";
      }
    }

    if (allRecognizedText) {
      fs.writeFileSync(`./recognized_txt${num}/recognized_text.txt`, allRecognizedText.trim(), "utf8");
      fs.appendFileSync(
        `./recognized_txt${num}/recognized_text.txt`,
        `\n\n${filterText}`,
        "utf8"
      );
      return allRecognizedText;
    } else {
      console.log("No recognized text to save.");
    }
  } catch (error) {
    console.error("Error processing images:", error);
  }
}
module.exports = processImages;
