const { DataTypes } = require('sequelize');
const sequelize = require('../../connection');

const QuestionAnswer = sequelize.define('QuestionAnswer', 
    {
        answerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        answerText: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isCorrect: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        tableName: 'QuestionAnswers'
    }
);

module.exports = QuestionAnswer;