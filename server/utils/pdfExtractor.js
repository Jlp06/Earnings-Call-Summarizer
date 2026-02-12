const fs = require("fs");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const pdfPoppler = require("pdf-poppler");

async function convertPdfToImages(filePath) {
    const outputDir = "uploads";

    const opts = {
        format: "png",
        out_dir: outputDir,
        out_prefix: "page",
        page: null,
        pdftoppm_path: "pdftoppm"
    };

    await pdfPoppler.convert(filePath, opts);

    const files = fs.readdirSync(outputDir)
        .filter(f => f.startsWith("page") && f.endsWith(".png"));

    return files.map(f => `${outputDir}/${f}`);
}

async function extractTextFromPDF(filePath) {
    try {
        const cachedFile = "uploads/ocr_text.txt";

        // ---- NEW: If OCR text already exists, reuse it ----
        if (fs.existsSync(cachedFile)) {
            console.log("Using cached OCR text...");
            return fs.readFileSync(cachedFile, "utf-8");
        }

        const dataBuffer = fs.readFileSync(filePath);

        try {
            const data = await pdfParse(dataBuffer);
            if (data.text && data.text.trim().length > 0) {
                return data.text;
            }
        } catch (e) {
            console.log("Normal PDF parsing failed, switching to OCR...");
        }

        console.log("Converting PDF to images...");
        const images = await convertPdfToImages(filePath);

        let fullText = "";

        for (const img of images) {
            console.log("Running OCR on:", img);

            const result = await Tesseract.recognize(img, "eng");
            fullText += result.data.text + "\n";
        }

        // ---- SAVE OCR OUTPUT FOR FUTURE RUNS ----
        fs.writeFileSync(cachedFile, fullText);
        console.log("OCR text saved for future use.");

        return fullText;

    } catch (error) {
        console.error("Extraction Error:", error.message);
        throw new Error("Error extracting text from PDF");
    }
}

module.exports = { extractTextFromPDF };
