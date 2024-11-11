const { DataTypes } = require('sequelize');
const sequelize = require('../../connection')

const Question = sequelize.define("Question",
    {
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        questionText: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        answerTime: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        tableName: 'Questions'
    }
);

module.exports = Question;