const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const cors = require('cors');

const SequelizeStore = require("connect-session-sequelize")(session.Store);

const { sequelize } = require("./db/models");
const { sessionSecret } = require("./db/models");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const answersRouter = require("./routes/answers");
const questionsRouter = require("./routes/questions");
const searchRouter = require("./routes/search");
const personalQAndARouter = require("./routes/personalQAndA");
const app = express();
// app.use(cors());

const { restoreUser, requireAuth } = require("./auth");

// view engine setup
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// set up session middleware
const store = new SequelizeStore({ db: sequelize });

app.use(
  session({
    name: "Query.sid",
    secret: "sessionSecret",
    store,
    saveUninitialized: false,
    resave: false,
  })
);

// create Session table if it doesn't already exist
store.sync();
app.use(restoreUser);
app.use("/", indexRouter);
app.use("/users", usersRouter);
//app.use(requireAuth);
app.use("/questions", questionsRouter);
app.use("/answers", answersRouter);
app.use("/api/search", searchRouter);
//change route name
app.use("/personal", personalQAndARouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
