"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Answers",
      [
        {
          value: "Yea Joe already said we will get an A.",
          userId: 1,
          questionId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          value: "Birds, you idiot!",
          questionId: 2,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          value: `In my GED class, I shared a poem I wrote about my relationship with Math. I called it Me &
                        Math.
                        
                        After sharing the poem—which students enjoyed—students wrote their own poems
                        about their relationship with mathematics.
                        
                        This was an excellent way of getting them to talk
                        about how they were feeling, and for me.`,
          questionId: 2,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Answers", null, {});
  },
};
