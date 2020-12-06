"use strict";
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    "Question",
    {
      value: {
        type: DataTypes.STRING(5000),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );
  Question.associate = function (models) {
    Question.belongsTo(models.User, { foreignKey: "userId" });
    Question.hasMany(models.Answer, { foreignKey: "questionId" });
  };
  return Question;
};
