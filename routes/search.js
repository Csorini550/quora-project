const express = require('express');
const router = express.Router();
const { asyncHandler } = require("../utils");
const db = require("../db/models");
const { Op } = require('sequelize');


router.get('/', asyncHandler(async(req, res, next) => {
    const { term } = req.query;
    const searchQuestions = await db.Question.findAll({
        where: {
            value: { [Op.iLike]: '%' + term + '%', 
         }, 
        },
    });
    res.render('search', {searchQuestions} );
    //res.json(searchQuestions);          
}));


//get

// router.get('/', asyncHandler(async(req, res, next) => {
//         let foundQuestions = await searchQuestions(req.query.term)
//         //what route are we rendering to?
//         res.render('navbar', { 
//             searchResults: `Search Results for ${req.query.term}`,
//             foundQuestions,
//         });

//         res.redirect('/');
// }));

module.exports = router;