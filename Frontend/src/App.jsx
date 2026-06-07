import { useState } from "react";
import "./App.css";

import useHistory from "./hooks/useHistory";
import useCodeReview from "./hooks/useCodeReview";
import useGithub from "./hooks/useGithub";

import EditorPanel from "./components/EditorPanel";
import OutputPanel from "./components/OutputPanel";
import HistorySidebar from "./components/HistorySidebar";

function App() {
  const [code, setCode] = useState(
    `function sum(a, b) {\n  return a + b\n}\n\nconsole.log(sum(1, 2))`,
  );
  const [language, setLanguage] = useState("javascript");
  const [showHistory, setShowHistory] = useState(false);

  // all history logic lives in this hook
  const { history, saveHistory, clearHistory } = useHistory();

  // all AI review logic lives in this hook
  const {
    review,
    loading,
    error,
    activeTab,
    score,
    copied,
    callAI,
    handleCopy,
    loadFromHistory
  } = useCodeReview(code, language, saveHistory);

  // all github fetch logic lives in this hook
  const githubProps = useGithub(setCode, setLanguage);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <span className="nav-logo">⚡ CodeReview AI</span>
          <span className="nav-tag">Powered by Llama 3.1</span>
        </div>
        <button className="history-btn" onClick={() => setShowHistory(true)}>
          📋 History ({history.length})
        </button>
      </nav>

      {/* main body — always 50/50 split */}
      <div className="app-body">
        <EditorPanel
          code={code}
          setCode={setCode}
          language={language}
          setLanguage={setLanguage}
          loading={loading}
          activeTab={activeTab}
          onReview={() => callAI("get-review", "review")}
          onFix={() => callAI("fix-code", "fix")}
          onScan={() => callAI("scan-security", "security")}
          githubProps={githubProps}
        />

        <OutputPanel
          review={review}
          loading={loading}
          error={error}
          activeTab={activeTab}
          score={score}
          copied={copied}
          onCopy={handleCopy}
        />
      </div>

      {/* history sidebar — slides in from right */}
      {showHistory && (
        <HistorySidebar
          history={history}
          onLoad={(item) => {
            // clicking a history item loads it back into output
            loadFromHistory(item)
            setShowHistory(false);
          }}
          onClear={clearHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}

export default App;
