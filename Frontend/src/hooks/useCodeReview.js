import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// this hook handles all AI calls — review, fix, security scan
const useCodeReview = (code, language, saveHistory) => {
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [score, setScore] = useState(null);
  const [copied, setCopied] = useState(false);

  // pull SCORE: XX/100 from AI response first line
  const parseScore = (text) => {
    const m = text.match(/SCORE:\s*(\d+)\/100/i);
    return m ? parseInt(m[1]) : null;
  };

  // remove the score line from display text
  const stripScore = (text) =>
    text.replace(/SCORE:\s*\d+\/100\s*\n?/i, "").trim();

  // one function handles all 3 AI actions
  const callAI = async (endpoint, tab) => {
    setLoading(true);
    setError("");
    setReview("");
    setScore(null);
    setActiveTab(tab);

    try {
      const res = await axios.post(`${API_URL}/ai/${endpoint}`, {
        code,
        language,
      });

      const raw = res.data;

      if (tab === "review") {
        setScore(parseScore(raw));
        setReview(stripScore(raw));
        saveHistory(tab, language, code, stripScore(raw));
      } else {
        setReview(raw);
        saveHistory(tab, language, code, raw);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(review);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // add this function inside useCodeReview hook
const loadFromHistory = (item) => {
  setReview(item.review)
  setActiveTab(item.type)
  setScore(null)
}

// add loadFromHistory to the return
return {
  review, loading, error,
  activeTab, score, copied,
  callAI, handleCopy, loadFromHistory,
}

  return {
    review,
    loading,
    error,
    activeTab,
    score,
    copied,
    callAI,
    handleCopy,
    loadFromHistory
  };
};

export default useCodeReview;
