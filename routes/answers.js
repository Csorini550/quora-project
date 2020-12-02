const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { csrfProtection, asyncHandler } = require('../utils');
const db = require('../db/models');

const questionNotFoundError = (id) => {
    const err = Error(`Question with id of ${id} could not be found!`);
    err.title = "Question not found!";
    err.status = 404;
    return err;
};

const questionValidators = [
    check('value')
        .exists({ checkFalsy: true })
        .withMessage('Please enter a question!')
        .isLength({ max: 500 })
        .withMessage('Question must be no longer than 500 characters.')
];

router.get('/:id/edit', csrfProtection, asyncHandler(async(req, res, next) => {
    const answerId = parseInt(req.params.id, 10)
    const answer = await db.Answer.findByPk(answerId);
    if (res.locals.authenticated) {
        res.render('edit-answer', { answer, csrfToken: req.csrfToken() })
    } else {
        res.redirect('/login');
    }
}));

router.post('/:id', csrfProtection, questionValidators, asyncHandler(async(req, res, next) => {
    const { value } = req.body;
    const answerId = parseInt(req.params.id, 10)
    const answer = await db.Answer.findByPk(answerId);
    if (answer) {
        await answer.update({ value: value });
        res.redirect('`/questions/${answer.questionId}`');
    } else {
        next(questionNotFoundError(answerId));
    }
}));

router.post('/:id/delete', asyncHandler(async(req, res, next) => {
    const answerId = parseInt(req.params.id, 10)
    const answer = await db.Answer.findByPk(answerId);
    if (answer) {
        await answer.destroy({ value: value });
        res.redirect('`/questions/${answer.questionId}`');
    } else {
        next(questionNotFoundError(answerId));
    }
}))