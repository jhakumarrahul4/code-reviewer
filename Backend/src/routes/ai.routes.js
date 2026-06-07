const express = require("express");
const router = express.Router();

const aiController = require("../controllers/ai.controller");
const rateLimiter = require("../middleware/rateLimiter");
const validateCode = require("../middleware/validateCode");

// review code route
router.post("/get-review", rateLimiter, validateCode, aiController.getReview);

// fix code route
router.post("/fix-code", rateLimiter, validateCode, aiController.fixCode);

// security scan route
router.post(
  "/scan-security",
  rateLimiter,
  validateCode,
  aiController.scanSecurity,
);

// github fetch route — no validateCode here because we are fetching
// code from github, not receiving code from user directly
router.post("/fetch-github", rateLimiter, aiController.fetchGithubCode);

module.exports = router;
