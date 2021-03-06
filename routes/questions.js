const express = require("express");
const { check, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");

const router = express.Router();

//******************************************************
//******************** HELPERS *********************
const questionNotFoundError = (id) => {
  const err = Error(`Question iwth id of ${id} could not be found.`);
  err.title = "Question not found";
  err.status = 404;
  return err;
};

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
    //URGENT!!! Put below line in below if statement
    //res.locals.authenticated
    if (true) {
      res.render("new-question", {
        title: "New Question",
        csrfToken: req.csrfToken(),
      });
    } else {
      // is this being used?
      res.redirect("/users/login");

    }
  })
);

// router.post(
//   "/new",
//   csrfProtection,
//   questionValidators,
//   asyncHandler(async (req, res, next) => {
//     const { value } = req.body;
//     const userId = res.locals.user.id;

//     const question = db.Question.create({
//       value,
//       userId,
//     });
//     res.render('index')
//   })
// )
//******************************************************
//******************** New Question ********************

router.post(
  "/new",
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
    } catch (err) {
      if (
        err.name === "SequelizeValidationError" ||
        err.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = err.error.map((error) => error.message);
        res.render("new-question", {
          title: "New Question",
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

//******************************************************
//******************** Delete Question *****************

router.post(
  "/:id/delete", csrfProtection,
  asyncHandler(async (req, res, next) => {
    const questionId = parseInt(req.params.id, 10);
    const question = await db.Question.findByPk(questionId);

    if (question) {
      await db.Answer.destroy({
        where: { questionId }
      })
      await question.destroy();
      res.redirect("/");
    } else {
      next(questionNotFoundError(questionId));
    }
  })
);

//set up router .get res.render('delete-question')
router.get("/:id/delete", csrfProtection, asyncHandler(async (req, res) => {
  const questionId = parseInt(req.params.id, 10);
  const question = await db.Question.findByPk(questionId);
  res.render("delete-question", {
    title: "Delete question",
    question,
    csrfToken: req.csrfToken(),
  })
}))

//******************************************************
//******************** Edit Question ********************

router.get(
  "/:id/edit",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const questionId = parseInt(req.params.id, 10);
    const question = await db.Question.findByPk(questionId);

    // if (!res.locals.authenticated) { //added !
    return res.render("edit-question", { //made changes here added return
      question,
      csrfToken: req.csrfToken(),
    });
    // } else {
    //   res.redirect("/");
    // }
  })
);

router.post(
  "/:id/edit",
  csrfProtection,
  questionValidators,
  asyncHandler(async (req, res, next) => {
    const { value } = req.body;
    const questionId = parseInt(req.params.id, 10);
    const question = await db.Question.findByPk(questionId);
    if (question) {
      question.value = value;
      await question.save();
      res.redirect(`/`);
    } else {
      next(questionNotFoundError(questionId));
    }
  })
);

router.get(
  "/:id",
  csrfProtection,
  questionValidators,
  asyncHandler(async (req, res, next) => {
    const { value } = req.body;
    const questionId = parseInt(req.params.id, 10);

    const question = await db.Question.findByPk(questionId);
    return res.render("new-question", {
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
    const questionId = parseInt(req.params.id, 10);

    const question = await db.Question.findByPk(questionId);
    if (question) {
      await question.update({ value: value });
      res.redirect(`/questions/${questionId}`);
    } else {
      next(questionNotFoundError(questionId));
    }
  })
);

//******************************************************
//************* Get Answer for Question ****************
// : id(\\d +)


//******************************************************
//************* Create Answer for Question ****************

router.post(
  "/:id(\\d+)/answers",
  csrfProtection,
  answerValidators,
  asyncHandler(async (req, res, next) => {
    const questionId = parseInt(req.params.id, 10);
    const { value } = req.body;
    const userId = res.locals.user.id;

    const answer = db.Answer.build({
      value,
      userId,
      questionId,
    });

    const validationErrors = validationResult(req);
    try {
      if (validationErrors.isEmpty()) {
        await answer.save();
        res.redirect(`/questions/${questionId}`);
      } else {
        const errors = validationErrors.array().map((error) => error.msg);
        res.render("new-answer", {
          value,
          errors,
          question,
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

module.exports = router;