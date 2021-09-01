const { validationResult } = require("express-validator");

module.exports = function(request, response, next) {
  const errors = validationResult(request).array();

  if(errors.length > 0) {
    return response.status(400).json({ error: errors[0].msg });
  }

  next();
}