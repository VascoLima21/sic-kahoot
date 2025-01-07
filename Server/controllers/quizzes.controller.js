const { Quizz, UserQuizz, Question, QuestionAnswer, User } = require('../models');
const { mqttClient } = require('../service/mqttClient'); // Assuming an MQTT client is set up
const { handleServerError } = require('../utilities/errors');
const { publishMessage, subscribeToTopic } = require('../service/mqttService')
const crypto = require('crypto');

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
    },
    publishPlayerAnswer: async (req, res) => {
        const { quizzId } = req.params;
        const { userId, questionId, answerText } = req.body;
    
        try {
            // Verificar se o quiz existe
            const quizz = await Quizz.findByPk(quizzId);
            if (!quizz) {
                return res.status(404).send({ message: 'Quiz não encontrado.' });
            }
    
            // Verificar se a pergunta existe
            const question = await Question.findByPk(questionId);
            if (!question || question.quizzId !== parseInt(quizzId, 10)) {
                return res.status(404).send({ message: 'Pergunta não encontrada no quiz.' });
            }
    
            // Criar o tópico para as respostas dos jogadores
            const topic = `Quizzes/${quizz.theme}/${quizzId}/Respostas`;
    
            // Preparar a payload para o MQTT
            const answerPayload = {
                userId,
                questionId,
                answerText,
                timestamp: new Date().toISOString(),
            };
    
            // Publicar a resposta no tópico MQTT
            mqttClient.publish(topic, JSON.stringify(answerPayload), { qos: 0 }, (err) => {
                if (err) {
                    console.error('Erro ao publicar a resposta no MQTT:', err);
                    return res.status(500).send({ message: 'Erro ao publicar a resposta no MQTT.' });
                }
                console.log(`Resposta publicada no tópico: ${topic}`);
            });
    
            // Responder ao cliente indicando que a resposta foi publicada
            res.status(200).json({
                message: 'Resposta publicada com sucesso.',
                data: answerPayload,
            });
        } catch (error) {
            console.error('Erro ao publicar resposta:', error);
            res.status(500).json({ error: 'Erro ao publicar a resposta.' });
        }
    },
    createRoom: async (req, res) => {
        const userId = res.locals.userId
        const quizzId = req.params.quizzId
        try {
            // Verificar se o quiz existe
            const quizz = await Quizz.findByPk(quizzId);
            if (!quizz) {
                return res.status(404).send({ message: 'Quiz não encontrado.' });
            }
    
            // Gerar um código único para a sala
            const roomCode = crypto.randomBytes(3).toString('hex'); // Exemplo: "abc123"
    
            // Publicar no tópico de criação de salas
            const roomTopic = `Quizzes/${quizz.theme}/${quizzId}/${roomCode}`;
            mqttClient.publish(roomTopic, JSON.stringify({
                quizzId,
                roomCode,
                createdBy: userId,
            }));
    
            res.status(201).json({ 
                message: 'Sala criada com sucesso.',
                roomCode,
                topic: roomTopic 
            });
        } catch (error) {
            console.error('Erro ao criar a sala:', error);
            res.status(500).json({ error: 'Erro ao criar a sala.' });
        }
    },
    joinRoom: async (req, res) => {
        const { quizzId, roomCode } = req.params;
        const userId = res.locals.userId; // Recupera o ID do utilizador autenticado
    
        try {
            // Verificar se o userId está definido
            if (!userId) {
                return res.status(401).json({ message: "Utilizador não autenticado." });
            }
    
            // Criar o subtópico específico para os jogadores da sala
            const playerTopic = `Quizzes/${quizzId}/${roomCode}/players`;
    
            // Publicar a entrada do jogador na sala
            const playerPayload = {
                userId,
                timestamp: new Date().toISOString()
            };
            publishMessage(playerTopic, JSON.stringify(playerPayload));
    
            // Inscrever-se no tópico principal da sala
            const roomTopic = `Quizzes/${quizzId}/${roomCode}`;
            subscribeToTopic(roomTopic);
    
            res.status(200).json({ 
                message: `Utilizador ${userId} inscrito com sucesso na sala ${roomCode}.`, 
                playerTopic: playerTopic 
            });
        } catch (error) {
            console.error('Erro ao entrar na sala:', error);
            res.status(500).json({ error: 'Erro ao entrar na sala.' });
        }
    },    
    startQuiz: async (req, res) => {
        const { quizzId, roomCode } = req.params;
    
        try {
            const quizz = await Quizz.findByPk(quizzId);
            if (!quizz) {
                return res.status(404).send({ message: 'Quiz não encontrado.' });
            }
    
            const questions = await Question.findAll({
                where: { quizzId: quizzId },
                include: [{ model: QuestionAnswer }]
            });
    
            if (!questions.length) {
                return res.status(404).send({ message: 'Nenhuma pergunta encontrada para este quiz.' });
            }
    
            res.status(200).send({ message: 'Quiz iniciado com sucesso.' });
    
            const topic = `Quizzes/${quizz.theme}/${quizzId}/${roomCode}`;
            let delay = 0;
    
            for (const question of questions) {
                const questionPayload = {
                    questionId: question.questionId,
                    question: question.questionText,
                    answers: question.QuestionAnswers.map(a => ({ answerText: a.answerText })),
                    answerTime: question.answerTime,
                };
    
                delay += question.answerTime * 1000;
    
                setTimeout(async () => {
                    try {
                        await publishMessage(topic, JSON.stringify(questionPayload));
                    } catch (error) {
                        console.error(`Erro ao publicar a pergunta no tópico ${topic}:`, error);
                    }
                }, delay);
            }
        } catch (error) {
            console.error('Erro ao iniciar o quiz:', error);
            res.status(500).json({ error: 'Erro ao iniciar o quiz.' });
        }
    },    
    evaluateAnswer: async (req, res) => {
        const { quizzId, roomCode } = req.params;
        const { userId, questionId, answerText, responseTime } = req.body;
    
        try {
            const question = await Question.findByPk(questionId, { include: [QuestionAnswer] });
            if (!question || question.quizzId !== parseInt(quizzId, 10)) {
                return res.status(404).send({ message: 'Pergunta não encontrada.' });
            }
    
            const correctAnswer = question.QuestionAnswers.find(a => a.isCorrect);
    
            const isCorrect = correctAnswer.answerText === answerText;
            const maxTime = question.answerTime;
            const points = isCorrect ? Math.max(0, (maxTime - responseTime) * 10) : 0;
    
            // Publicar feedback no tópico de respostas
            const feedbackTopic = `Quizzes/${quizzId}/${roomCode}/Feedback`;
            mqttClient.publish(feedbackTopic, JSON.stringify({
                userId,
                questionId,
                isCorrect,
                points,
                correctAnswer: correctAnswer.answerText,
            }));
    
            res.status(200).json({
                message: 'Resposta avaliada com sucesso.',
                points,
                isCorrect,
            });
        } catch (error) {
            console.error('Erro ao avaliar a resposta:', error);
            res.status(500).json({ error: 'Erro ao avaliar a resposta.' });
        }
    },
            
}