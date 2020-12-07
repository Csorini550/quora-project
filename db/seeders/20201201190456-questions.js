"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Questions",
      [
        {
          value: "What are the odds we get an A on this project?",
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          value: "Are dragons lizards or birds?",
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Questions", null, {});
  },
};
