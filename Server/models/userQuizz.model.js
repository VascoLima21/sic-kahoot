const { DataTypes } = require('sequelize');
const sequelize = require('../../connection');

const UserQuiz = sequelize.define('UserQuiz', 
    {
        quizId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Quizzes',
                key: 'quizzId'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Users',
                key: 'userId'
            }
        },
        quizClassification: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        tableName: "UserQuizzes"
    }
);

module.exports = UserQuiz;