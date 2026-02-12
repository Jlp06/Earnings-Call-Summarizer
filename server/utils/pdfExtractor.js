const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

async function extractTextFromPDF(filePath) {
    try {
        const apiKey = process.env.OCR_API_KEY;

        if (!apiKey) {
            throw new Error("OCR API Key not configured");
        }

        const formData = new FormData();
        formData.append("file", fs.createReadStream(filePath));
        formData.append("apikey", apiKey);
        formData.append("language", "eng");
        formData.append("isOverlayRequired", "false");

        console.log("Sending PDF to OCR API...");

        const response = await axios.post(
            "https://api.ocr.space/parse/image",
            formData,
            {
                headers: formData.getHeaders(),
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        if (
            response.data &&
            response.data.ParsedResults &&
            response.data.ParsedResults.length > 0
        ) {
            const text = response.data.ParsedResults
                .map(r => r.ParsedText)
                .join("\n");

            console.log("OCR extraction successful.");
            return text;
        } else {
            throw new Error("No text returned from OCR API");
        }

    } catch (error) {
        console.error("OCR Extraction Error:", error.message);
        throw new Error("Error extracting text from PDF using OCR API");
    }
}

module.exports = { extractTextFromPDF };
