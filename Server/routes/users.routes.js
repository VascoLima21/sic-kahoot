const express = require('express');
const router = express.Router();

// import users controller
const { login, register } = require("../controllers/users.controller");
const { verifyUser, verifyAdmin } = require("../middlewares/jwt");
const { checkToken } = require("../middlewares/checkToken");

router.route('/login')
    .post(login)
    
router.all('*', (req, res) => {
     res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;