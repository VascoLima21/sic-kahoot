// Controller logic to create a new quiz
const { Quizz, UserQuizz, Question, QuestionAnswer, User } = require('../models');
const mqttClient = require('../service/mqttClient'); // Assuming an MQTT client is set up

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
    }
}