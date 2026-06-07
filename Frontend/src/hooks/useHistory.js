import { useState, useEffect } from "react";

// this hook handles saving and loading review history from localStorage
const useHistory = () => {
  const [history, setHistory] = useState([]);

  // load history when app starts
  useEffect(() => {
    const saved = localStorage.getItem("crHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveHistory = (type, language, code, reviewText) => {
    const item = {
      id: Date.now(),
      type,
      language,
      codePreview: code.slice(0, 70),
      review: reviewText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const updated = [item, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem("crHistory", JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("crHistory");
  };

  return { history, saveHistory, clearHistory };
};

export default useHistory;
