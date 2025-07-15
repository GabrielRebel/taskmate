// Basic validation middleware for Express

function validateFields(requiredFields) {
  return function (req, res, next) {
    const missing = requiredFields.filter(field => !(field in req.body));
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }
    next();
  };
}

module.exports = {
  validateFields,
}; 