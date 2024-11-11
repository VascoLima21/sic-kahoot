const { DataTypes } = require('sequelize');
const sequelize = require('../../connection');

const UserQuestionAnswer = sequelize.define('UserQuestionAnswer', 
    {
        quizId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Quizzs',
                key: 'quizzId'
            }
        },
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Questions',
                key: 'questionId'
            }
        },
        timeToAnswer: {
            type: DataTypes.STRING,
            allowNull: true
        },
        answerGiven: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'UserQuestionAnswers'
    }
);

module.exports = UserQuestionAnswer;