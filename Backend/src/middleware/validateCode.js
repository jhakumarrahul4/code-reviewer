module.exports = (req, res, next) => {
  const { code } = req.body;

  if (!code || typeof code !== "string" || code.length > 50000) {
    return res.status(400).json({
      success: false,
      message: "Invalid code input",
    });
  }

  next();
};