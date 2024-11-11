const { DataTypes } = require('sequelize');
const sequelize = require('../../connection')

const QuizInstance = sequelize.define("QuizInstance",
    {
        instanceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    },
    {
        tableName: "QuizzInstances",
    }
);

module.exports = QuizInstance;