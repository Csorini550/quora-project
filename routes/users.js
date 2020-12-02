var express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");
const { User, sequelize } = db;
const { loginUser, logoutUser } = require("../auth");

const router = express.Router();

//******************************************************
//******************** VALIDATIONS *********************
//******************************************************

const userValidators = [
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for First Name")
    .isLength({ max: 50 })
    .withMessage("First Name must not be more than 50 characters long"),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Last Name")
    .isLength({ max: 50 })
    .withMessage("Last Name must not be more than 50 characters long"),
  check("emailAddress")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Email Address")
    .isLength({ max: 50 })
    .withMessage("Email Address must not be more than 50 characters long")
    .isEmail()
    .withMessage("Email Address is not a valid email")
    .custom((value) => {
      return db.User.findOne({ where: { emailAddress: value } }).then(
        (user) => {
          if (user) {
            return Promise.reject(
              "The provided Email Address is already in use by another account"
            );
          }
        }
      );
    }),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Password")
    .isLength({ max: 50 })
    .withMessage("Password must not be more than 50 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, "g")
    .withMessage(
      'Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'
    ),
  check("confirmPassword")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Confirm Password")
    .isLength({ max: 50 })
    .withMessage("Confirm Password must not be more than 50 characters long")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm Password does not match Password");
      }
      return true;
    }),
];

const loginValidators = [
  check("emailAddress")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Email Address"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Password"),
];

//************ Routes **********************************

//******************** User Registration ***************
//******************************************************

router.get("/register", csrfProtection, (req, res) => {
  if (!res.locals.authenticated) {
    const user = db.User.build();
    res.render("user-register", {
      title: "Register",
      user,
      csrfToken: req.csrfToken(),
    });
  } else {
    res.redirect("/");
  }
});
// Add user to db
router.post(
  "/register",
  csrfProtection,
  userValidators,
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = db.User.build({
      email,
    });

    const validatorErrors = validationResult(req);
    try {
      if (validatorErrors.isEmpty()) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.hashedPassword = hashedPassword;
        await user.save();

        loginUser(req, res, user);
        return req.session.save((err) => {
          if (!err) {
            console.log("No Error");
            return res.redirect("/");
          } else {
            console.log(err);
            next(err);
          }
        });
      } else {
        const errors = validatorErrors.array().map((err) => err.msg);
        res.render("register", {
          title: "Register",
          user,
          errors,
          csrfToken: req.csrfToken(),
        });
      }
    } catch (e) {
      if (
        e.name === "SequelizeValidationError" ||
        e.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = e.errors.map((error = error.message));
        res.render("register", {
          title: "Register",
          user,
          errors,
          csrfToken: req.csrfToken(),
        });
      } else {
        next(e);
      }
    }
  })
);

// // Create new user
// router.post('/signup', csrfProtection, userValidators, asyncHandler(async (req, res, next) => {
//   const { emailAddress, firstName, lastName, password } = req.body;
//   const user = db.User.build({
//     emailAddress,
//     firstName,
//     lastName,
//   });

//   const validatorErrors = validationResult(req);
//   if (validatorErrors.isEmpty()) {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     user.hashedPassword = hashedPassword;
//     await user.save();
//     loginUser(req, res, user);
//     res.redirect('/');
//   } else {
//     const errors = validatorErrors.array().map((error) => error.msg);
//     res.render('user-register', {
//       title: 'Register',
//       user,
//       errors,
//       csrfToken: req.csrfToken(),
//     });
//   }

// }));

//******************************************************
//******************** User Login **********************
//******************************************************

router.get("/login", csrfProtection, (req, res) => {
  if (!res.locals.authenticated) {
    res.render("login", {
      csrfToken: req.csrfToken(),
    });
  } else {
    res.redirect("/");
  }
});

router.post(
  "/login",
  csrfProtection,
  loginValidators,
  asyncHandler(async (req, res) => {
    const { emailAddress, password } = req.body;

    let errors = [];

    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
      // Attempt to get the user by their email address.
      const user = await db.User.findOne({ where: { emailAddress } });
      if (user !== null) {
        // If the user exists then compare their password
        // to the provided password.
        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword.toString()
        );
        if (passwordMatch) {
          // If the password hashes match, then login the user
          // and redirect them to the default route.
          loginUser(req, res, user);
          return res.session.save((err) => {
            if (!err) {
              console.log("no error");
              return res.redirect("/");
            } else {
              console.log(err);
              next(err);
            }
          });
        }
      }
      // Otherwise display an error message to the user.
      errors.push("Login failed for the provided email address and password");
    } else {
      errors = validatorErrors.array().map((error) => error.msg);
    }
    res.render("login", {
      title: "Login",
      emailAddress,
      errors,
      csrfToken: req.csrfToken(),
    });
  })
);

//******************************************************
//******************** User Logout *********************
//******************************************************

router.post("/logout", (req, res, next) => {
  logoutUser(req);
  return req.session.save((err) => {
    if (!err) {
      return res.redirect("/");
    } else {
      next(err);
    }
  });
});

//******************************************************
//******************** Demo User ***********************
//******************************************************

router.get(
  "/demo",
  asyncHandler(async (req, res, next) => {
    const demoUser = await db.User.findOne({
      where: { emailAddress: "demo@demo.com" },
    });
    loginUser(req, res, demoUser);
    return res.redirect("/");
  })
);

//******************************************************
//******************** Questions ***********************
//******************************************************

//TODO: QUESTION ROUTES

//******************************************************
//******************** Answers *************************
//******************************************************

//TODO: ANSWER ROUTES

module.exports = router;
