const { DataTypes } = require('sequelize');
const sequelize = require('../../connection')

const Quizz = sequelize.define("Quizz",
    {
        quizzId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        theme: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 100]
            }
        }
    },
    {
        tableName: 'Quizzes'
    }
);

module.exports = Quizz;