const fs = require("fs");
const vision = require("@google-cloud/vision");

function getVisionClient() {
    const credentials = JSON.parse(
        process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
    );

    return new vision.ImageAnnotatorClient({ credentials });
}

async function extractTextFromPDF(filePath) {
    try {
        const client = getVisionClient();

        const fileBuffer = fs.readFileSync(filePath);

        const request = {
            requests: [
                {
                    inputConfig: {
                        content: fileBuffer.toString("base64"),
                        mimeType: "application/pdf",
                    },
                    features: [
                        { type: "DOCUMENT_TEXT_DETECTION" }
                    ],
                },
            ],
        };

        const [response] = await client.batchAnnotateFiles(request);

        const responses = response.responses[0].responses;

        let fullText = "";

        for (const page of responses) {
            if (page.fullTextAnnotation?.text) {
                fullText += page.fullTextAnnotation.text + "\n";
            }
        }

        if (!fullText.trim()) {
            throw new Error("No text extracted from PDF");
        }

        return fullText;

    } catch (error) {
        console.error("Google Vision OCR Error:", error);
        throw new Error("Error extracting text using Google Vision OCR");
    }
}

module.exports = { extractTextFromPDF };