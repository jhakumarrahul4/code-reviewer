import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const useGithub = (setCode, setLanguage) => {
  const [githubUrl, setGithubUrl] = useState("");
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState("");
  const [fetchedFile, setFetchedFile] = useState("");

  const fetchFromGithub = async () => {
    if (!githubUrl.trim()) return;

    // basic check before even sending to backend
    if (!githubUrl.includes("github.com")) {
      setGithubError("Please enter a valid GitHub URL");
      return;
    }

    if (!githubUrl.includes("/blob/")) {
      setGithubError(
        "Open a specific file in GitHub and copy that URL. Example: github.com/user/repo/blob/main/index.js",
      );
      return;
    }

    setGithubLoading(true);
    setGithubError("");
    setFetchedFile("");

    try {
      const res = await axios.post(`${API_URL}/ai/fetch-github`, {
        url: githubUrl.trim(),
      });

      setCode(res.data.code);
      setLanguage(res.data.language);
      setFetchedFile(res.data.filename);
      setGithubUrl("");
    } catch (err) {
      setGithubError(
        err.response?.data?.message ||
          "Failed to fetch from GitHub. Check the URL and try again.",
      );
    } finally {
      setGithubLoading(false);
    }
  };

  return {
    githubUrl,
    setGithubUrl,
    githubLoading,
    githubError,
    fetchedFile,
    fetchFromGithub,
  };
};

export default useGithub;
