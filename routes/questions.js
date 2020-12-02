const express = require("express");
const { check, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");

const router = express.Router();

//******************************************************
//******************** VALIDATIONS *********************
//******************************************************

const questionValidators = [
  check("value")
    .exists({ checkFalsy: true })
    .withMessage("Please enter a question")
    .isLength({ max: 500 })
    .withMessage("The question must be no longer than 500 characters long"),
];

const answerValidators = [
  check("value")
    .exists({ checkFalsy: true })
    .withMessage("Please enter an Answer")
    .isLength({ max: 255 })
    .withMessage("The answer must be no longer that 500 characters long"),
];

//************ ROUTES **********************************

//******************************************************
//******************** Get Question ********************

router.get(
  "/new",
  csrfProtection,
  asyncHandler(async (req, res) => {
    if (res.locals.authenticated) {
      res.render("new-question", {
        title: "New Question",
        csrfToken: req.csrfToken(),
      });
    } else {
      res.resdirect("/login");
    }
  })
);

//******************************************************
//******************** New Question ********************

router.post(
  "/",
  csrfProtection,
  questionValidators,
  asyncHandler(async (req, res, next) => {
    const { value } = req.body;
    const userId = res.locals.user.id;

    const question = db.Question.build({
      value,
      userId,
    });

    const validationErrors = validationResult(req);
    try {
      if (validationErrors.isEmpty()) {
        await question.save();
        res.redirect("/");
      } else {
        const errors = validationErrors.array().map((error) => error.msg);
        res.render("new-question", {
            value,
            errors,
            csrfToken: req.csrfToken(),
        });
      }
    } catch(err) {
        if(
            err.name === "SequelizeValidationError" ||
            err.name === "SequelizeUniqueContraintError"
        ) {
            const errors = err.error.map((error) => error.message);
            res.render("new-question", {
                title: "New Question",
                question,
                errors,
                csrfToken: req.csrfToken();
            });
        } else {
            next(err);
        }
    }
  })
);
