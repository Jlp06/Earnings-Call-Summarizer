import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { Oval } from "react-loader-spinner";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnalysis("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");
      setAnalysis("");

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/analyze`,
        formData
      );

      setAnalysis(response.data.analysis);
      setLoading(false);

    } catch (err) {
      setError("Error analyzing file. Please try again.");
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("Earnings Call Analysis Report", 10, 10);

    doc.setFontSize(10);

    const lines = doc.splitTextToSize(analysis, 180);

    let y = 20;

    for (let i = 0; i < lines.length; i++) {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }

      doc.text(lines[i], 10, y);
      y += 7;
    }

    doc.save("Earnings_Call_Analysis.pdf");
  };

  return (
    <div className="container">
      <h1 className="title">📊 Earnings Call Summarizer</h1>

      <div className="card">
        <form onSubmit={handleSubmit} className="upload-box">
          <label className="file-label">
            {file ? file.name : "Choose PDF file"}
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              hidden
            />
          </label>

          <button type="submit" className="analyze-btn">
            Analyze PDF
          </button>
        </form>
      </div>

      {loading && (
        <div className="loader">
          <Oval color="#4f46e5" height={60} width={60} />
          <p>Processing scanned document... This may take up to 60 seconds.</p>
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      {analysis && (
        <div className="result-box">
          <h2>Analysis Result</h2>

          {analysis.split("\n").map((line, index) => (
            <p key={index} className="analysis-line">
              {line}
            </p>
          ))}

          <button onClick={downloadPDF} className="download-btn">
            Download as PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
