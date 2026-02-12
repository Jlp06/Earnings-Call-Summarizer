# 📊 Earnings Call Summarizer

A full-stack AI-powered web application that extracts text from scanned earnings call PDFs and generates structured summaries using cloud-based OCR and LLM processing.

🔗 Live Demo:
https://earnings-call-summarizer.vercel.app/

# 🚀 Features

- 📄 Upload multi-page scanned PDF earnings call transcripts

- 🔍 Text extraction using Google Vision OCR

- 🧠 AI-based summarization

- 📥 Download generated summary as PDF

- 🌐 Fully deployed (Frontend + Backend)

- 🔐 Secure cloud credential management

# 🏗️ Architecture

```java
React Frontend (Vercel)
        ↓
Node.js Backend (Render)
        ↓
Google Vision OCR
        ↓
LLM Summarization
```

# 🛠️ Tech Stack

## Frontend

- React

- Axios

- jsPDF

- React Loader Spinner

- Vercel (Deployment)

## Backend

- Node.js

- Express

- Google Cloud Vision API

- LLM API (for summarization)

- Render (Deployment)

# 🔐 Security & Configuration

- Environment variables used for all API keys

- Google service account credentials stored securely on Render

- No secrets committed to GitHub

# 📌 Key Engineering Decisions

- Replaced local OCR (Tesseract) with Google Vision OCR for:

- Better scalability

- Linux compatibility

- Large multi-page PDF support

- Implemented cloud-native architecture

- Handled file size and processing latency considerations

- Managed production deployment across multiple cloud services

# 🧪 How It Works

1. User uploads a scanned PDF.

2. Backend sends PDF to Google Vision for OCR.

3. Extracted text is passed to LLM for summarization.

4. Summary is returned to frontend.

5. User can download summary as a PDF report.

# ⚠️ Known Limitations (Free Hosting)

- The backend is deployed on Render free tier and may take 30–60 seconds to wake up after inactivity.

- Large multi-page PDFs may require longer processing time.

- Google Vision OCR usage is limited to the free monthly quota.

- File uploads are recommended under 10MB for optimal reliability.

# 📈 Future Improvements

- User authentication & history

- Processing time analytics

- Caching OCR results

- Multiple summary formats (bullet / detailed / executive)

# 📄 License

This project is for educational and portfolio purposes.
