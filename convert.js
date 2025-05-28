const { fromPath } = require("pdf2pic");
const fs = require("fs");

async function convertPdfToImages(pdfPath,num=1, outputDir = `./output-images${num}`,options = {}) {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Default options
    const { density = 300, format = "png", width = 1024, height = 1200 } = options;

    const converter = fromPath(pdfPath, {
        density,
        savePath: outputDir,
        format,
        width,
        height,
    });

    return converter.bulk(-1) // Convert all pages
        .then((images) => {
            // console.log("PDF converted to images:", images);
            return images;
        })
        .catch((error) => {
            console.error("Error converting PDF:", error);
            throw error;
        });
}

module.exports = convertPdfToImages;
