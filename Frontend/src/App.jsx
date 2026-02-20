import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function sum(){
  return 1+1
}`);

  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  async function reviewCode() {
  try {
    setLoading(true);
    setError("");
    setReview("");

    const response = await axios.post(
      "http://localhost:3000/ai/get-review",
      { code }
    );

    console.log(response.data);

    // Backend returns plain string
    setReview(response.data);

  } catch (err) {
    console.error(err);
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
}

  return (
    <main>
      <div className="left">
        <div className="code">
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              Prism.highlight(code, Prism.languages.javascript, "javascript")
            }
            padding={10}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 16,
              border: "1px solid #ddd",
              borderRadius: "5px",
              height: "100%",
              width: "100%",
            }}
          />
        </div>

        <button
          onClick={reviewCode}
          className="review"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Review"}
        </button>
      </div>

      <div className="right">
        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Analyzing your code...</p>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {!loading && review && (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {review}
          </ReactMarkdown>
        )}
      </div>
    </main>
  );
}

export default App;