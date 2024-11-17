const { User } = require("../models/index");
const { compareHash } = require("../utilities/bcrypt");
const { handleInvalidRequest, handleBadRequest, handleServerError, handleSequelizeValidationError, handleConflictError } = require("../utilities/errors");
const { SignToken } = require("../middlewares/jwt");
const { Op } = require('sequelize')

module.exports = {
    login: async (req, res) => {
        // await User.create({
        //     username: 'teste',
        //     password: '123',
        //     role: 'admin'
        // })
        try {
            const user = await User.findOne({ where: { username: req.body.username } });
            if (req.body.password && req.body.username) {
                //Verifies if the password matches the user's password'
                const passwordIsValid = await compareHash(user.password, req.body.password);
                if (passwordIsValid) {
                    //Calls the SignToken function that creates the token
                    const token = await SignToken(user.userId);
                    return res.status(201).send({ accessToken: token });
                } else {
                    handleInvalidRequest(res, "Invalid Credentials")
                }
            } else {
                handleBadRequest(res, "Please fill all the required fields.")
            }
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                // Capture Sequelize Validation Errors
                handleSequelizeValidationError(error, res)
            }
            handleServerError(error, res)
        }
    },
    register: async (req, res) => {
        try {
            if (req.body.password && req.body.username) {
                if (await User.findOne({
                    where: {
                        username: req.body.username
                    }
                })) {
                    handleConflictError(res, "User with this username already exists");
                } else {
                    const user = await User.create({
                        username: req.body.username,
                        password: req.body.password,
                    });
                    const token = await SignToken(user.userId);
                    return res.status(201).send({ message: "Registered Successfully", token: token })
                }
            } else {
                handleBadRequest(res, "Please fill all the required fields")
            }
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                handleSequelizeValidationError(error, res)
            }
            handleServerError(error, res)
        }
    }
}