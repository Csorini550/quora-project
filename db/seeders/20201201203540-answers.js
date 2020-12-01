'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Answers', [
      {
        value: 'Yea Joe already said we will get an A.',
        userId: 1,
        questionId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        value: 'Birds, you idiot!',
        questionId: 2,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Answers', null, {});
  }
};
