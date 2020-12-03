const express = require('express');
const router = express.Router();
const { asyncHandler } = require("../utils");
const db = require("../db/models");
const { Op } = require('sequelize');


router.post('/', asyncHandler(async(req, res, next) => {
    const { term } = req.body;
    const searchQuestions = await db.Questions.findAll({
        where: {
            title: { [Op.ilike]: '%' + term + '%', 
         }, 
        },
    });
    res.json(searchQuestions);  
    
            
        })
);


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