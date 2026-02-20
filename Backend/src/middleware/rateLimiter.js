const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});
