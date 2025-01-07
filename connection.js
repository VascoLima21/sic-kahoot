require('dotenv').config()
const { Sequelize } = require("sequelize")

const db_name = "sic_kahoot"
const db_user = "root"
const db_password = "filipeGeometrydash6"
const db_host = "127.0.0.1"
const db_dialect = 'mysql'

const sequelize = new Sequelize(db_name, db_user, db_password, {
    host: db_host,
    dialect: db_dialect
});

module.exports = sequelize