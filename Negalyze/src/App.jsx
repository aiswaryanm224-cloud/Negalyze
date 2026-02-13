import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [inputText, setInputText] = useState("");
  const [harshness, setHarshness] = useState("normal");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);

    const type = uploadedFile.type;

    if (type.includes("image")) setFileType("Image");
    else if (type.includes("pdf")) setFileType("PDF Document");
    else if (type.includes("word") || type.includes("document"))
      setFileType("Word Document");
    else if (type.includes("text")) setFileType("Text File");
    else setFileType("Unknown File");
  };

  // ⭐ NEW: Remove selected file
  const removeFile = () => {
    setFile(null);
    setFileType("");
  };

  const analyze = async () => {
    if (!inputText.trim() && !file) {
      alert("Please paste content or upload a file.");
      return;
    }

    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("text", inputText);
    formData.append("harshness", harshness);
    formData.append("fileType", fileType);

    if (file) {
      formData.append("file", file);
    }

    try {
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data.result);
    } catch {
      setResult("⚠ Server error. Backend not running.");
    }

    setLoading(false);
  };

  // ⭐ Back to first stage
  const goBack = () => {
    setResult("");
    setFile(null);
    setFileType("");
    setInputText("");
  };

  return (
    <div className="container">
      <h1 className="title">NEGALYZE</h1>

      {!result && (
        <>
          <div className="uploadSection">
            <label className="uploadBox">
              📂 Upload Image / Document
              <input type="file" onChange={handleFileUpload} />
            </label>

            {file && (
              <div className="filePreview">
                <p>📄 {file.name}</p>
                <button className="removeFileBtn" onClick={removeFile}>
                  Remove File
                </button>
              </div>
            )}

            {fileType && (
              <p className="fileType">
                Uploaded Type: <b>{fileType}</b>
              </p>
            )}
          </div>

          <textarea
            className="inputBox"
            placeholder="Paste your project content here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <div className="controls">
            <h3>Harshness Level</h3>
            <select
              className="dropdown"
              value={harshness}
              onChange={(e) => setHarshness(e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="medium">Medium</option>
              <option value="extreme">Extreme</option>
            </select>
          </div>

          <button className="analyzeBtn" onClick={analyze}>
            {loading ? "Analyzing..." : "Analyze with Negalyze"}
          </button>
        </>
      )}

      {result && (
        <>
          <div className="resultBox">{result}</div>

          <button className="backBtn" onClick={goBack}>
            ⬅ Back
          </button>
        </>
      )}
    </div>
  );
}

export default App;
