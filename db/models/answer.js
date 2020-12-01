"use strict";
module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define(
    "Answer",
    {
      value: {
        type: DataTypes.STRING(500),
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );
  Answer.associate = function (models) {
    Answer.belongsTo(models.Question, { foreignKey: "questionId" });
    Answer.belongsTo(models.User, { foreignKey: "userId" });
  };
  return Answer;
};
