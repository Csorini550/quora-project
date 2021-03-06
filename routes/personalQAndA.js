const express = require("express");
const { check, validationResult } = require("express-validator");
const { sequelize } = require("../db/models");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");
const { User, Question, Answer } = db;

const router = express.Router();

// const shortContent = (questions) => {
//     for (let i = 0; i < questions.length; i++) {
//         let question = questions[i];
//         let content = question.value;

//         let shortened;
//         if (content.length > 140) {
//             shortened = content.substring(0, 140);
//         } else {
//             shortened = content;
//         }
//         question.shortenedContent = shortened + "...";
//     }
// };

// const addQuestionLink = (questions) => {
//     for (let i = 0; i < questions.length; i++) {
//         questions[i].link = "/personal/" + questions[i].id;
//     }
// };

// function dateCreate(questions) {
//     let months = {
//         Jan: "01",
//         Feb: "02",
//         Mar: "03",
//         Apr: "04",
//         May: "05",
//         Jun: "06",
//         Jul: "07",
//         Aug: "08",
//         Sep: "09",
//         Oct: "10",
//         Nov: "11",
//         Dec: "12",
//     };

//     for (let i = 0; i < questions.length; i++) {
//         let question = questions[i];
//         let createdAt = question.createdAt.toString();
//         let parts = createdAt.split(" ");
//         question.formattedDate = months[parts[1]] + "/" + parts[2] + "/" + parts[3];
//     }
// }

router.get(
  "/questions/:id",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const questions = await db.Question.findAll({
      include: [
        {
          model: User,
          as: "User",
          where: {
            id: userId,
          },
          attributes: ["email"],
        },

        {
          model: Answer,
          as: "Answers",
          attributes: [[Answer.sequelize.fn("COUNT", "id"), "answerCount"]],
        },
      ],
      order: [["createdAt", "DESC"]],
      attributes: ["id", "value", "createdAt"],
      group: ["Question.id", "User.id", "Answers.id"],
    });

    //dateCreate(questions);
    //shortContent(questions);
    // addQuestionLink(questions);

    res.render("questions", { questions, csrfToken: req.csrfToken() });
  })
);

// router.get('/', (req, res) => {
//     res.send('We did it!')
// })

router.get(
  "/answers/:id",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const answers = await db.Answer.findAll({
      where: {
        userId,
      },
      include: [
        { model: User, as: "User", attributes: ["email"] },
        {
          model: Question,
          as: "Question",
          attributes: [
            "value",
            // [Question.sequelize.fn("COUNT", "id"), "answerCount"],
          ],
          include: { model: Answer },
        },
      ],
      order: [["createdAt", "DESC"]],
      attributes: ["id", "value", "createdAt"],
      //   distinct: ["value"],

      //   group: ["Question.id", "User.id", "Answers.id"],
    }).map((answer) => answer.Question);

    const newAnswers = [];
    answers.forEach((question) => {
      if (!(question.value in newAnswers)) newAnswers.push(question);
    });

    // dateCreate(questions);
    // shortContent(questions);
    // addQuestionLink(questions);

    
    // res.json({ newAnswers });
    res.render("answers", { answers, csrfToken: req.csrfToken() });
  })
);

module.exports = router;
