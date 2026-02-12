const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

async function extractTextFromPDF(filePath) {
    try {
        const apiKey = process.env.OCR_API_KEY;
        console.log("OCR API KEY exists:", !!apiKey);

        const formData = new FormData();
        formData.append("file", fs.createReadStream(filePath));
        formData.append("apikey", apiKey);
        formData.append("language", "eng");
        formData.append("isOverlayRequired", "false");

        // ✅ CRITICAL FIX
        formData.append("filetype", "PDF");
        formData.append("OCREngine", "2");

        const response = await axios.post(
            "https://api.ocr.space/parse/image",
            formData,
            {
                headers: formData.getHeaders(),
                timeout: 60000
            }
        );

        console.log("OCR RAW RESPONSE:", JSON.stringify(response.data, null, 2));

        if (response.data.IsErroredOnProcessing) {
            throw new Error(response.data.ErrorMessage);
        }

        const text = response.data.ParsedResults
            ?.map(r => r.ParsedText)
            .join("\n");

        if (!text || text.trim().length === 0) {
            throw new Error("OCR returned empty text");
        }

        return text;

    } catch (error) {
        console.error("OCR Extraction Error FULL:", error);
        throw new Error("Error extracting text from PDF using OCR API");
    }
}

module.exports = { extractTextFromPDF };