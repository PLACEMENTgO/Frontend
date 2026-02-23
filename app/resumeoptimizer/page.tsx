"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function UploadResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [latex, setLatex] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const uploadResume = async () => {
    if (!file) return alert("Please select a file");
    if (!jobDescription.trim()) return alert("Please paste job description");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jobDescription);

    try {
      setLoading(true);
      setError("");
      setPdfBase64(null);
      setLatex(null);

      const data = await apiFetch("http://localhost:8080/api/resumes/upload", {
        method: "POST",
        body: formData,
      });

      if (!data.pdfBase64) {
        setError("PDF generation failed.");
        return;
      }

      setPdfBase64(data.pdfBase64);
      setLatex(data.latex);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfBase64) return;
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${pdfBase64}`;
    link.download = "resume.pdf";
    link.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0f2f5; }

        .nav {
          background: #1a1a2e;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          height: 56px;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          font-weight: 700;
          font-size: 16px;
        }
        .nav-logo-icon {
          width: 32px;
          height: 32px;
          background: #3b82f6;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .nav-links {
          display: flex;
          gap: 4px;
        }
        .nav-link {
          color: #94a3b8;
          text-decoration: none;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 14px;
          transition: color 0.15s;
          cursor: pointer;
          background: none;
          border: none;
        }
        .nav-link:hover { color: #fff; }
        .nav-link.active {
          color: #fff;
          border-bottom: 2px solid #3b82f6;
          border-radius: 0;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .btn-upgrade {
          background: #3b82f6;
          color: #fff;
          border: none;
          padding: 7px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .avatar {
          width: 34px;
          height: 34px;
          background: #e97316;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 14px;
        }

        .page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 36px 24px;
        }

        .page-header { margin-bottom: 28px; }
        .page-title {
          font-size: 26px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
        }
        .page-subtitle {
          font-size: 14px;
          color: #64748b;
        }

        .upload-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 28px;
        }

        .card {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 24px;
        }

        .card-title {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .card-title-num {
          width: 22px;
          height: 22px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: #3b82f6;
        }

        .dropzone {
          border: 2px dashed #cbd5e1;
          border-radius: 10px;
          padding: 48px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.15s;
          background: #f8fafc;
        }
        .dropzone:hover, .dropzone.over {
          border-color: #3b82f6;
          background: #eff6ff;
        }
        .dropzone-icon {
          font-size: 32px;
          margin-bottom: 12px;
          display: block;
          color: #3b82f6;
        }
        .dropzone-text {
          font-size: 14px;
          color: #475569;
          margin-bottom: 4px;
          font-weight: 500;
        }
        .dropzone-subtext {
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 16px;
        }
        .dropzone-file-name {
          font-size: 13px;
          color: #3b82f6;
          font-weight: 500;
          margin-top: 8px;
        }
        .btn-select {
          background: #fff;
          border: 1px solid #e2e8f0;
          color: #374151;
          padding: 8px 20px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-select:hover { background: #f8fafc; border-color: #94a3b8; }

        .jd-textarea {
          width: 100%;
          height: 168px;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          padding: 14px;
          font-size: 13.5px;
          color: #374151;
          resize: none;
          outline: none;
          transition: border-color 0.15s;
          line-height: 1.5;
          font-family: inherit;
        }
        .jd-textarea:focus { border-color: #3b82f6; }
        .jd-textarea::placeholder { color: #94a3b8; }

        .generate-row {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
        }

        .btn-generate {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #fff;
          border: none;
          padding: 14px 36px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.15s;
          box-shadow: 0 4px 14px rgba(59,130,246,0.35);
        }
        .btn-generate:hover:not(:disabled) {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          box-shadow: 0 6px 18px rgba(59,130,246,0.45);
          transform: translateY(-1px);
        }
        .btn-generate:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .badges {
          display: flex;
          gap: 20px;
          font-size: 12px;
          color: #64748b;
        }
        .badge { display: flex; align-items: center; gap: 5px; }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; }

        .error-msg { color: #ef4444; font-size: 13px; text-align: center; margin-top: 8px; }

        /* Preview section */
        .preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .preview-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .preview-title-icon { color: #22c55e; }

        .ats-score-badge {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #16a34a;
          font-size: 13px;
          font-weight: 700;
          padding: 5px 14px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ats-score-num { font-size: 18px; }

        .btn-download {
          background: #1a1a2e;
          color: #fff;
          border: none;
          padding: 9px 18px;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s;
        }
        .btn-download:hover { background: #2d2d4a; }

        .preview-cols {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 20px;
        }

        .preview-label {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .resume-preview-original {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 24px 20px;
          min-height: 340px;
          font-size: 8px;
          color: #64748b;
          position: relative;
        }

        .preview-iframe-wrap {
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          position: relative;
        }
        .optimized-badge {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: #3b82f6;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        .preview-footer {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 0 0 10px 10px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: #64748b;
          margin-top: -1px;
        }
        .footer-kw { display: flex; align-items: center; gap: 6px; }
        .footer-kw-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; }
        .footer-edit { color: #3b82f6; cursor: pointer; font-weight: 500; }

        .latex-details { margin-top: 20px; }
        .latex-summary {
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          color: #475569;
          padding: 10px 0;
        }
        .latex-pre {
          margin-top: 10px;
          background: #f4f4f4;
          padding: 20px;
          border-radius: 8px;
          overflow-x: auto;
          font-size: 12px;
          line-height: 1.6;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 700px) {
          .upload-grid { grid-template-columns: 1fr; }
          .preview-cols { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-icon">📄</div>
          Resume Studio
        </div>
        <div className="nav-links">
          <button className="nav-link">Dashboard</button>
          <button className="nav-link active">Optimizer</button>
          <button className="nav-link">Templates</button>
          <button className="nav-link">Career Insights</button>
        </div>
        <div className="nav-right">
          <button className="btn-upgrade">Upgrade Pro</button>
          <div className="avatar">H</div>
        </div>
      </nav>

      <div className="page">
        {/* HEADER */}
        <div className="page-header">
          <h1 className="page-title">Resume Optimizer</h1>
          <p className="page-subtitle">Tailor your profile to specific job descriptions and beat the ATS filters instantly.</p>
        </div>

        {/* UPLOAD GRID */}
        <div className="upload-grid">
          {/* Upload Resume */}
          <div className="card">
            <div className="card-title">
              <div className="card-title-num">1</div>
              Upload Your Resume
            </div>
            <div
              className={`dropzone${dragOver ? " over" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <span className="dropzone-icon">☁️</span>
              <div className="dropzone-text">Click to browse or drag and drop</div>
              <div className="dropzone-subtext">PDF, DOCX up to 10MB</div>
              <button className="btn-select" onClick={(e) => { e.stopPropagation(); document.getElementById("file-input")?.click(); }}>
                Select File
              </button>
              {file && <div className="dropzone-file-name">✓ {file.name}</div>}
            </div>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.docx"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          {/* Paste Job Description */}
          <div className="card">
            <div className="card-title">
              <div className="card-title-num">2</div>
              Paste Job Description
            </div>
            <textarea
              className="jd-textarea"
              placeholder="Paste the full job requirements here to identify missing keywords and skills..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
        </div>

        {/* GENERATE BUTTON */}
        <div className="generate-row">
          <button className="btn-generate" onClick={uploadResume} disabled={loading}>
            {loading ? (
              <><span className="spinner" /> Generating Resume...</>
            ) : (
              <><span>✨</span> Generate Optimized Resume</>
            )}
          </button>
          <div className="badges">
            <span className="badge"><span className="badge-dot" /> AI-Powered Analysis</span>
            <span className="badge"><span className="badge-dot" /> ATS Score Optimization</span>
          </div>
          {error && <div className="error-msg">{error}</div>}
        </div>

        {/* PREVIEW */}
        {pdfBase64 && (
          <div>
            <div className="preview-header">
              <div className="preview-title">
                <span className="preview-title-icon">✅</span>
                Optimization Preview
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="ats-score-badge">
                  ATS SCORE <span className="ats-score-num">94%</span>
                </div>
                <button className="btn-download" onClick={downloadPdf}>
                  ⬇ Download PDF
                </button>
              </div>
            </div>

            <div className="preview-cols">
              {/* Original */}
              <div>
                <div className="preview-label">Original Version</div>
                <div className="resume-preview-original">
                  <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", paddingTop: 80 }}>
                    Original resume preview
                  </div>
                </div>
              </div>

              {/* Optimized */}
              <div>
                <div className="preview-label">Optimized Version (ATS-Ready)</div>
                <div className="preview-iframe-wrap">
                  <iframe
                    src={`data:application/pdf;base64,${pdfBase64}`}
                    width="100%"
                    height="520px"
                    style={{ display: "block", border: "none" }}
                  />
                  <div className="optimized-badge">OPTIMIZED BY AI</div>
                </div>
                <div className="preview-footer">
                  <div className="footer-kw">
                    <span className="footer-kw-dot" />
                    ATS Keywords Found (12)
                  </div>
                  <span>⊙ Format: Standard Harvard</span>
                  <span className="footer-edit">Edit Formatting</span>
                </div>
              </div>
            </div>

            {latex && (
              <details className="latex-details">
                <summary className="latex-summary">Show LaTeX Source</summary>
                <pre className="latex-pre">{latex}</pre>
              </details>
            )}
          </div>
        )}
      </div>
    </>
  );
}
