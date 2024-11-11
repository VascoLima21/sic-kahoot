const { DataTypes } = require('sequelize');
const sequelize = require('../../connection')

const User = sequelize.define("User",
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 100]
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                const hashedPassword = bcrypt.hashSync(value,10)
                this.setDataValue('password',hashedPassword)
            },
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user'
        }
    },
    {
        tableName: 'Users'
    }
);

module.exports = User;