// Alternative convert.js that doesn't require ImageMagick
const pdf = require('pdf-poppler');
const fs = require("fs");
const path = require("path");

async function convertPdfToImages(pdfPath, num = 1, outputDir = null, options = {}) {
    // Use path.join for Windows compatibility
    const defaultOutputDir = path.join(__dirname, `output-images${num}`);
    const finalOutputDir = outputDir || defaultOutputDir;

    // Ensure output  directory exists
    try {
        if (!fs.existsSync(finalOutputDir)) {
            fs.mkdirSync(finalOutputDir, { recursive: true });
            console.log(`Created directory: ${finalOutputDir}`);
        }
    } catch (dirError) {
        console.error('Error creating output directory:', dirError);
        throw new Error(`Failed to create output directory: ${dirError.message}`);
    }

    // Normalize the PDF path for Windows
    const normalizedPdfPath = path.resolve(pdfPath);
    
    console.log(`Converting PDF: ${normalizedPdfPath}`);
    console.log(`Output directory: ${finalOutputDir}`);

    try {
        // Check if PDF file exists
        if (!fs.existsSync(normalizedPdfPath)) {
            throw new Error(`PDF file not found: ${normalizedPdfPath}`);
        }

        // pdf-poppler options
        const convertOptions = {
            format: 'png',
            out_dir: finalOutputDir,
            out_prefix: 'page',
            page: null, // Convert all pages
            scale: 1024, // Scale for image quality
        };

        // Convert PDF to images
        const images = await pdf.convert(normalizedPdfPath, convertOptions);
        
        console.log(`Successfully converted PDF to ${images.length} images`);
        return images;
        
    } catch (error) {
        console.error("Error converting PDF:", error);
        
        // More specific error messages
        if (error.message.includes('ENOENT')) {
            throw new Error(`File not found: ${normalizedPdfPath}`);
        } else if (error.message.includes('EACCES')) {
            throw new Error(`Permission denied. Try running as administrator.`);
        } else {
            throw new Error(`PDF conversion failed: ${error.message}`);
        }
    }
}

module.exports = convertPdfToImages;