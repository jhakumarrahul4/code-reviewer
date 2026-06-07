import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ScoreCard from "./ScoreCard";

// this component is the entire right panel
// output bar + score card + review content
const OutputPanel = ({
  review,
  loading,
  error,
  activeTab,
  score,
  copied,
  onCopy,
}) => {
  return (
    <div className="right-panel">
      {/* top bar — always visible */}
      <div className="output-bar">
        <div className="output-bar-left">
          <span className="panel-label">Output</span>
          {activeTab && (
            <span className={`tab-badge ${activeTab}`}>
              {activeTab === "review" && "Code Review"}
              {activeTab === "fix" && "Bug Fix"}
              {activeTab === "security" && "Security Scan"}
            </span>
          )}
        </div>

        {review && (
          <button
            className={`copy-btn ${copied ? "done" : ""}`}
            onClick={onCopy}
          >
            {copied ? "✅ Copied" : "📋 Copy"}
          </button>
        )}
      </div>

      {/* score card — only shown after review with a score */}
      {activeTab === "review" && score !== null && !loading && (
        <ScoreCard score={score} />
      )}

      {/* scrollable content area */}
      <div className="output-scroll">
        {/* loading spinner */}
        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>
              {activeTab === "review" && "Analyzing your code…"}
              {activeTab === "fix" && "Fixing your code…"}
              {activeTab === "security" && "Scanning for vulnerabilities…"}
            </p>
          </div>
        )}

        {/* error message */}
        {!loading && error && <div className="error-box">⚠️ {error}</div>}

        {/* ai review output */}
        {!loading && review && (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{review}</ReactMarkdown>
        )}

        {/* empty state when nothing has been reviewed yet */}
        {!loading && !review && !error && (
          <div className="empty-state">
            <div className="e-icon">⚡</div>
            <h3>Ready to Analyze</h3>
            <p>
              Write or paste your code on the left,
              <br />
              then choose an action below.
            </p>
            <div className="empty-pills">
              <span className="pill pill-r">🔍 Review</span>
              <span className="pill pill-f">🔧 Fix</span>
              <span className="pill pill-s">🛡️ Security</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
