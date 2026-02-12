const { extractTextFromPDF } = require("../utils/pdfExtractor");
const { analyzeTranscript } = require("../utils/financialAnalyzer");

exports.analyzePDF = async (req, res) => {
    try {
        const filePath = req.file.path;

        const extractedText = await extractTextFromPDF(filePath);

        const analysisResult = await analyzeTranscript(extractedText);

        res.json({
            success: true,
            analysis: analysisResult,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
