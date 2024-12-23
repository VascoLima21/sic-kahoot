const { Quizz, UserQuizz, Question, QuestionAnswer, User } = require('../models');
const { mqttClient } = require('../service/mqttClient'); // Assuming an MQTT client is set up
const { handleServerError } = require('../utilities/errors');
const { publishMessage, subscribeToTopic } = require('../service/mqttService')

module.exports = {
    addQuizz: async (req, res) => {
        const { userId, theme, questions } = req.body;
        try {
            // Step 1: Create or find an existing quiz with the given theme
            let newQuizz = await Quizz.create({ theme });
            console.log(newQuizz.quizzId);

            // Step 2: Associate the quiz with the user who created it
            await UserQuizz.create({
                quizzId: newQuizz.quizzId,
                userId: userId,
            });

            // Step 3: Add questions and answers to the quiz
            for (const questionData of questions) {
                const newQuestion = await Question.create({
                    quizzId: newQuizz.quizzId,
                    questionText: questionData.questionText,
                    answerTime: questionData.answerTime,
                });

                for (const answerData of questionData.answers) {
                    await QuestionAnswer.create({
                        questionId: newQuestion.questionId,
                        answerText: answerData.answerText,
                        isCorrect: answerData.isCorrect,
                    });
                }
            }

            // Step 4: Publish the quiz to the MQTT topic
            const mqttTopic = `Quizzes/${theme}`;
            const quizzPayload = {
                id: newQuizz.quizzId,
                theme: newQuizz.theme,
                questions: questions.map(q => ({
                    text: q.questionText,
                    answers: q.answers.map(a => a.answerText),
                })),
            };
            mqttClient.publish(mqttTopic, JSON.stringify(quizzPayload));

            res.status(201).json({ message: 'Quizz created successfully!', quizzId: newQuizz.quizzId });
        } catch (error) {
            console.error('Error creating quiz:', error);
            res.status(500).json({ error: 'An error occurred while creating the quiz' });
        }
    },
    getQuizzes: async (req, res) => {
        try {
            const quizzes = await Quizz.findAll({
                include: [{
                    model: User,
                    attributes: ['userId', 'username']
                }],
                attributes: ['quizzId', 'theme']
            })
            if (quizzes) {
                return res.status(200).send({
                    quizzes: quizzes
                })
            }
        } catch (error) {
            handleServerError(error, res)
        }
    },
    getQuizzQuestions: async (req, res) => {
        const { quizzId } = req.params
        try {
            const questions = await Question.findAll({ where: { quizzId: quizzId } })
            if (questions) {
                return res.status(200).send({
                    questions: questions
                })
            }
        } catch (error) {
            handleServerError(error, res)
        }
    },
    getQuestionAnswers: async (req, res) => {
        const { questionId } = req.params
        try {
            const answers = await QuestionAnswer.findAll({ where: { questionId: questionId } })
            if (answers) {
                return res.status(200).send({
                    answers: answers
                })
            }
        } catch (error) {
            handleServerError(error, res)
        }
    },
    subscribeToQuizz: async (req, res) => {
        const { quizzId } = req.params;
        try {
            const quizz = await Quizz.findByPk(quizzId);
            if (!quizz) {
                return res.status(404).send({ message: 'Quiz não encontrado.' });
            }

            const topic = `Quizzes/${quizz.theme}/${quizzId}/questions`;
            subscribeToTopic(topic);

            res.status(200).send({ message: `Inscrito com sucesso no tópico ${topic}.` });

        } catch (error) {
            console.error('Erro ao se inscrever no quiz:', error);
            res.status(500).send({ error: 'Erro ao se inscrever no quiz.' });
        }
    },
    publishQuestions: async (req, res) => {
        const { quizzId } = req.params;

        try {
            // Encontrar o quiz pelo ID
            const quizz = await Quizz.findByPk(quizzId);
            if (!quizz) {
                return res.status(404).send({ message: 'Quiz não encontrado.' });
            }

            // Recuperar todas as perguntas associadas a esse quiz
            const questions = await Question.findAll({
                where: { quizzId: quizzId },
                include: [{
                    model: QuestionAnswer,
                    attributes: ['answerText', 'isCorrect']
                }]
            });

            // Criar o tópico MQTT
            const topic = `Quizzes/${quizz.theme}/${quizzId}/questions`;

            // Publicar cada pergunta no tópico
            questions.forEach((question) => {
                const questionPayload = {
                    questionId: question.questionId,
                    question: question.questionText,
                    answers: question.QuestionAnswers.map(a => ({
                        answerText: a.answerText
                    })),
                    answerTime: question.answerTime,
                };

                // Chamar a função de publicação
                publishMessage(topic, JSON.stringify(questionPayload));
            });

            res.status(200).json({
                message: 'Perguntas publicadas com sucesso.',
                questions: questions.map(q => q.questionText),
            });

        } catch (error) {
            console.error('Erro ao publicar perguntas:', error);
            res.status(500).json({ error: 'Erro ao publicar perguntas.' });
        }
    }
}