const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");

const questionNotFoundError = (id) => {
  const err = Error(`Question with id of ${id} could not be found!`);
  err.title = "Question not found!";
  err.status = 404;
  return err;
};

const questionValidators = [
  check("value")
    .exists({ checkFalsy: true })
    .withMessage("Please enter a question!")
    .isLength({ max: 500 })
    .withMessage("Question must be no longer than 500 characters."),
];

const answerValidators = [
  check("value")
    .exists({ checkFalsy: true })
    .withMessage("Please enter an Answer")
    .isLength({ max: 255 })
    .withMessage("The answer must be no longer that 500 characters long"),
];

router.get(
  "/:id/edit",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const answerId = parseInt(req.params.id, 10);
    const answer = await db.Answer.findByPk(answerId);
    return res.render("edit-answer", { answer, csrfToken: req.csrfToken() });
    // if (!res.locals.authenticated) {
    //   return res.render("edit-answer", { answer, csrfToken: req.csrfToken() });
    // } else {
    //   res.redirect("/");
    // }
  })
);

//**************************
router.post(
  "/new",
  csrfProtection,
  answerValidators,
  asyncHandler(async (req, res, next) => {
    const { value, questionId } = req.body;
    const answer = db.Answer.build({
      value,
      questionId,
      userId: req.session.auth.userId
    });
    
    const validationErrors = validationResult(req);
    try {
      if (validationErrors.isEmpty()) {
        await answer.save();
        res.redirect("/");
      } else {
        const errors = validationErrors.array().map((error) => error.msg);
        res.render("new-answer", {
          value,
          errors,
          csrfToken: req.csrfToken(),
        });
      }
    } catch (err) {
      if (
        err.name === "SequelizeValidationError" ||
        err.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = err.error.map((error) => error.message);
        res.render("new-answer", {
          title: "New Answer",
          question,
          errors,
          csrfToken: req.csrfToken(),
        });
      } else {
        next(err);
      }
    }
  })
);




router.get(
  "/:questionid",
  csrfProtection,
  questionValidators,
  asyncHandler(async (req, res, next) => {
    const { value } = req.body;
    const questionid = parseInt(req.params.questionid, 10);

    const question = await db.Question.findByPk(questionid);
    return res.render("new-answer", {
      question, csrfToken: req.csrfToken()
    }); //************ NEEDS NEW PUG FILE!!!!! ******************
  })
);

router.post(
  "/:id",
  csrfProtection,
  questionValidators,
  asyncHandler(async (req, res, next) => {
    const { value } = req.body;
    // const userId = res.locals.user.id;
    const answerId = parseInt(req.params.id, 10);

    const answer = await db.Answer.findByPk(answerId);
    if (answer) {
      await answer.update({ value: value });
      res.redirect(`/answer/${answerId}`);
    } else {
      next(questionNotFoundError(answerId));
    }
  })
);
// ADD GET REQUEST FOR /:ID  *************************

router.post(
  "/:id/edit",
  csrfProtection,
  questionValidators,
  asyncHandler(async (req, res, next) => {
    const { value } = req.body;
    const answerId = parseInt(req.params.id, 10);
    const answer = await db.Answer.findByPk(answerId);
    if (answer) {
      answer.value = value;
      await answer.save();
      res.redirect("/");
    } else {
      next(questionNotFoundError(answerId));
    }
  })
);

//**************************** */ COME BACK TO THIS ************
router.post(
  "/:id/delete",
  csrfProtection,
  questionValidators,
  asyncHandler(async (req, res, next) => {
    const answerId = parseInt(req.params.id, 10);
    const answer = await db.Answer.findByPk(answerId);

    if (answer) {
      await answer.destroy();
      res.redirect("/");
    } else {
      next(questionNotFoundError(answerId));
    }
  })
);

router.get("/:id/delete", csrfProtection, asyncHandler(async (req, res) => {
  const answerId = parseInt(req.params.id, 10);
  const answer = await db.Answer.findByPk(answerId);

  // if (!res.locals.authenticated) {
  return res.render("delete-answer", {
    title: "Delete answer",
    answer,
    csrfToken: req.csrfToken(),
  })
  // } else {
  //   res.redirect("/");
  // }
}))

module.exports = router;
