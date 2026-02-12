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
        "http://localhost:5000/api/analyze",
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
      <h1>Concall PDF Summarizer</h1>

      <form onSubmit={handleSubmit} className="upload-box">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button type="submit">Analyze PDF</button>
      </form>

      {loading && (
        <div className="loader">
          <Oval color="#00BFFF" height={60} width={60} />
          <p>Analyzing document... please wait</p>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {analysis && (
        <div className="result-box">
          <h2>Analysis Result</h2>

          <pre className="analysis-text">{analysis}</pre>

          <button onClick={downloadPDF} className="download-btn">
            Download as PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
