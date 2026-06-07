const aiService = require("../services/ai.service");
const axios = require("axios");

// REVIEW CODE — gives feedback + quality score
module.exports.getReview = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const lang = language || "javascript";

    // we ask AI to start with a score so we can parse it on frontend
    const systemPrompt = `You are a senior ${lang} code reviewer.

Your response must follow this exact format:
SCORE: X/100

Then give 8 to 10 bullet points of clear feedback about the code quality, bugs, and improvements.

If the code needs fixing, show the improved version at the end.

Keep your tone professional but simple.`;

    const prompt = `Please review this ${lang} code:\n\n${code}`;

    const response = await aiService(prompt, systemPrompt);

    res.send(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// FIX CODE — returns the fixed version of the code
module.exports.fixCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const lang = language || "javascript";

    const systemPrompt = `You are an expert ${lang} developer.
Your job is to fix bugs and improve the code quality.
Return the fixed code first, then briefly explain what you changed in bullet points.
Keep the explanation short and simple.`;

    const prompt = `Please fix and improve this ${lang} code:\n\n${code}`;

    const response = await aiService(prompt, systemPrompt);

    res.send(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// SCAN SECURITY — only looks for security issues
module.exports.scanSecurity = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const lang = language || "javascript";

    const systemPrompt = `You are a security expert who specializes in ${lang} code.
Scan the given code only for security vulnerabilities.

For each issue found, mention:
- Severity: Critical / High / Medium / Low
- What the issue is
- How to fix it

If no security issues are found, say "No security vulnerabilities detected."

Do not give general code quality feedback. Focus only on security.`;

    const prompt = `Scan this ${lang} code for security vulnerabilities:\n\n${code}`;

    const response = await aiService(prompt, systemPrompt);

    res.send(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// FETCH CODE FROM GITHUB URL
module.exports.fetchGithubCode = async (req, res) => {
  try {
    const { url } = req.body

    if (!url) {
      return res.status(400).json({ message: "URL is required" })
    }

    // clean the url first — remove extra spaces
    const cleanUrl = url.trim()

    // check if it is a github url
    if (!cleanUrl.includes("github.com")) {
      return res.status(400).json({
        message: "Please enter a valid GitHub URL",
      })
    }

    // check if it is a file url not a repo homepage
    if (!cleanUrl.includes("/blob/")) {
      return res.status(400).json({
        message: "Please paste a direct file URL. Open a file in GitHub and copy the URL from browser.",
      })
    }

    // convert normal github URL to raw content URL
    // handles both with and without https://
    let rawUrl = cleanUrl

    // add https if missing
    if (!rawUrl.startsWith("http")) {
      rawUrl = "https://" + rawUrl
    }

    // do the conversion
    rawUrl = rawUrl
      .replace("https://github.com", "https://raw.githubusercontent.com")
      .replace("/blob/", "/")

    // remove any query params or hash from url
    rawUrl = rawUrl.split("?")[0].split("#")[0]

    console.log("Fetching from raw URL:", rawUrl)

    // fetch the raw code from github
    const response = await axios.get(rawUrl, {
      // set a timeout so it doesn't hang forever
      timeout: 10000,
      // tell github we are a browser
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    })

    // detect language from file extension
    const filename = cleanUrl.split("/").pop().split("?")[0]
    const extension = filename.split(".").pop().toLowerCase()

    const extensionMap = {
      js:   "javascript",
      jsx:  "javascript",
      ts:   "typescript",
      tsx:  "typescript",
      py:   "python",
      java: "java",
      c:    "c",
      cpp:  "cpp",
      cc:   "cpp",
      h:    "c",
    }

    const detectedLanguage = extensionMap[extension] || "javascript"

    res.status(200).json({
      code: response.data,
      language: detectedLanguage,
      filename,
    })

  } catch (error) {
    console.error("GitHub fetch error:", error.message)

    if (error.response?.status === 404) {
      return res.status(404).json({
        message: "File not found. Make sure the GitHub repo is public.",
      })
    }

    if (error.code === "ECONNABORTED") {
      return res.status(408).json({
        message: "Request timed out. Please try again.",
      })
    }

    res.status(500).json({
      message: "Failed to fetch from GitHub. Please check the URL and try again.",
    })
  }
}
