const { validationResult } = require("express-validator");
const csrf = require("csurf");

const csrfProtection = csrf({ cookies: true });

const asyncHandler = (handler) => {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
};

const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => error.msg);

    const err = Error("Bad request.");
    err.status = 400;
    err.title = "Bad request.";
    err.errors = errors;
    return next(err);
  }
  next();
};

/// loop for divs
// let answerDiv = document.querySelectorAll('.user-answer');
// let currentLikes = 0
// answerDiv.addEventListener('click', event => {
//   curentLikes += 1;

// })

// const likeButton = () => {

// }

// const dislikeButton = () => {

// }

module.exports = { asyncHandler, handleValidationErrors, csrfProtection };
