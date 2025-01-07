const { DataTypes } = require('sequelize');
const sequelize = require('../../connection');

const QuizzInstance = sequelize.define("QuizzInstance", {
    instanceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    roomCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    hostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    currentQuestionIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'waiting', // Possíveis valores: waiting, inProgress, completed
    },
}, {
    tableName: "QuizzInstances",
});

module.exports = QuizzInstance;