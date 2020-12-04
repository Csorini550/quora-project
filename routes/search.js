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
        include: [db.User, db.Answer]
    });

    console.log(searchQuestions);

    res.render('search', {searchQuestions} );
    
    // Model.findByPk(id, {
    //     include: [
    //       firstDataModel,
    //       {
    //         model: secondDataModel,
    //         include: [thirdDataModel]
    //       }
    //     ]
    // });

    //users and answers of the question 
    //found in the searchQuestions

    //findByPk or findAll?

    // async function 
    // const answers = await db.Answer.findAll(quest{
    //     where: {
            
    //     }
    // });



    // const users = await db.User.findByPk({
    //     where: {
    //         //get user email
    //         userId: {  }
    //     }
    //  });

    //  const answers = await db.Answer.findByPk({
    //      where: {
    //          //get answer value
                //how do we pull all answers for a question/display on pug?
    //      }
    //  })

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