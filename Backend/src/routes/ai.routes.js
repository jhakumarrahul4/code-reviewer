const express = require("express");
const router = express.Router();

const aiController = require("../controllers/ai.controller");
const rateLimiter = require("../middleware/rateLimiter");
const validateCode = require("../middleware/validateCode");

router.post("/get-review", rateLimiter, validateCode, aiController.getReview);

module.exports = router;