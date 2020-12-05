const db = require("../db/models");
const { Answer, Question, User, sequelize } = db;
const { asyncHandler, csrfProtection } = require("../utils");

var express = require("express");
var router = express.Router();

const requireAuth = (req, res, next) => {
  if (!res.locals.authenticated) {
    return res.redirect("/users/login");
  }
  return next();
};


/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { questions: [], title: 'a/A Express Skeleton Home' });
  
// });


//Helper Functions

const shortContent = (questions) => {
  for (let i = 0; i < questions.length; i++) {
    let question = questions[i];
    let content = question.value;

    let shortened;
    if (content.length > 140) {
      shortened = content.substring(0, 140);
    } else {
      shortened = content;
    }
    question.shortenedContent = shortened + "...";
  }
};

const addQuestionLink = (questions) => {
  for (let i = 0; i < questions.length; i++) {
    questions[i].link = "/questions/" + questions[i].id;
  }
};

/* GET home page. */
function dateCreate(questions) {
  let months = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  for (let i = 0; i < questions.length; i++) {
    let question = questions[i];
    let createdAt = question.createdAt.toString();
    let parts = createdAt.split(" ");
    question.formattedDate = months[parts[1]] + "/" + parts[2] + "/" + parts[3];
  }
}

router.get(
  "/",
  csrfProtection,
  asyncHandler(async (req, res) => {
    let questions = await Question.findAll({
      include: [
        { model: User, as: "User", attributes: ["email"] },
        {
          model: Answer,
          as: "Answers",
          attributes: [[Answer.sequelize.fn("COUNT", "id"), "answerCount"], "value"],
        },
      ],
      order: [["createdAt", "DESC"]],
      attributes: ["id", "value", "createdAt"],
      group: ["Question.id", "User.id", "Answers.id"],
    });

    dateCreate(questions);
    shortContent(questions);
    addQuestionLink(questions);

    // console.log(questions);
    res.render("index", { questions, csrfToken: req.csrfToken() });
    // res.json({ questions });
  })
);

module.exports = router;
