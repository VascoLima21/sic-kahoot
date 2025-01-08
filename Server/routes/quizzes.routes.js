const express = require('express');
const router = express.Router();

// import users controller
const { addQuizz, getQuizzes, getQuizzQuestions, getQuestionAnswers, subscribeToQuizz, publishQuestions, createRoom, joinRoom, startQuiz } = require("../controllers/quizzes.controller");
const { verifyAdmin, verifyUser } = require("../middlewares/jwt");

router.route('/')
    .post(verifyAdmin, addQuizz)
    .get(getQuizzes)

router.route('/:quizzId/createRoom')
    .post(verifyUser, createRoom)

router.route('/:quizzId/:roomCode/joinRoom')
    .post(joinRoom)

router.route('/:quizzId/:roomCode/startQuiz')
    .post(startQuiz)

router.route('/:quizzId/subscribe')
    .post(subscribeToQuizz)

router.route('/:quizzId/questions')
    .get(getQuizzQuestions)

router.route('/:quizzId/publishQuestions')
    .post(publishQuestions)

router.route('/:quizzId/questions/:questionId/answers')
    .get(getQuestionAnswers)

router.all('*', (req, res) => {
    res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;