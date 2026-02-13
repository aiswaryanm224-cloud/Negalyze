import { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [harshness, setHarshness] = useState("normal");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!text.trim()) {
      alert("Please paste your project content first.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          harshness,
        }),
      });

      const data = await res.json();
      setResult(data.result);
    } catch (error) {
      setResult("⚠️ Server error. Make sure backend is running.");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">NEGALYZE</h1>

      <textarea
        className="inputBox"
        placeholder="Paste your project content here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
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

      {result && <div className="resultBox">{result}</div>}
    </div>
  );
}

export default App;
