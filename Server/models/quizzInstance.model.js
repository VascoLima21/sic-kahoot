const { DataTypes } = require('sequelize');
const sequelize = require('../../connection')

const QuizzInstance = sequelize.define("QuizzInstance",
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

module.exports = QuizzInstance;