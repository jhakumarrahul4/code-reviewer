import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-typescript";
import Editor from "react-simple-code-editor";
import GithubBar from "./GithubBar";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
];

const EditorPanel = ({
  code,
  setCode,
  language,
  setLanguage,
  loading,
  activeTab,
  onReview,
  onFix,
  onScan,
  githubProps,
}) => {
  const getPrism = (lang) => {
    const map = {
      javascript: Prism.languages.javascript,
      typescript: Prism.languages.typescript,
      python: Prism.languages.python,
      java: Prism.languages.java,
      c: Prism.languages.c,
      cpp: Prism.languages.cpp,
    };
    return map[lang] || Prism.languages.javascript;
  };

  return (
    <div className="left-panel">
      <div className="panel-bar">
        <span className="panel-label">Editor</span>
        <select
          className="lang-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ fix — destructure githubProps and map fetchFromGithub to onFetch */}
      <GithubBar
        githubUrl={githubProps.githubUrl}
        setGithubUrl={githubProps.setGithubUrl}
        githubLoading={githubProps.githubLoading}
        githubError={githubProps.githubError}
        fetchedFile={githubProps.fetchedFile}
        onFetch={githubProps.fetchFromGithub}
      />

      <div className="editor-area">
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(c) => Prism.highlight(c, getPrism(language), language)}
          padding={16}
          style={{
            fontFamily: '"Fira Code", "Courier New", monospace',
            fontSize: 13,
            minHeight: "100%",
            background: "#0d1117",
          }}
        />
      </div>

      <div className="btn-row">
        <button
          className="btn btn-review"
          onClick={onReview}
          disabled={loading}
        >
          🔍 {loading && activeTab === "review" ? "Reviewing…" : "Review Code"}
        </button>
        <button className="btn btn-fix" onClick={onFix} disabled={loading}>
          🔧 {loading && activeTab === "fix" ? "Fixing…" : "Fix Code"}
        </button>
        <button className="btn btn-scan" onClick={onScan} disabled={loading}>
          🛡️{" "}
          {loading && activeTab === "security" ? "Scanning…" : "Scan Security"}
        </button>
      </div>
    </div>
  );
};

export default EditorPanel;
