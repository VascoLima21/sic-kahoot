const { User, Quizz, UserQuizz, Question, QuestionAnswer } = require('../models/index');

router.post('/quizzes', async (req, res) => {
    const { userId, title, theme, questions } = req.body;
  
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({ message: 'User Not Found' });
      }
  
      // Cria um novo quiz com tema
      const newQuizz = await Quizz.create({ title, theme });
  
      // Relaciona o user ao quiz (quem criou)
      await UserQuizz.create({ userId: user.id, quizzId: newQuizz.id });
  
      // Adiciona perguntas e respostas
      for (const questionData of questions) {
        const newQuestion = await Question.create({ 
          quizzId: newQuizz.id, 
          text: questionData.text 
        });
  
        for (const answerData of questionData.answers) {
          await QuestionAnswer.create({ 
            questionId: newQuestion.id, 
            text: answerData.text, 
            isCorrect: answerData.isCorrect 
          });
        }
      }
  
      // Publica o quiz no MQTT no tópico `Quizzes/<Theme>`
      const topic = `Quizzes/${theme}`;
      const quizPayload = {
        id: newQuizz.id,
        title: newQuizz.title,
        theme: newQuizz.theme,
        questions: questions.map(q => ({
          text: q.text,
          answers: q.answers.map(a => a.text)
        }))
      };
      mqttClient.publish(topic, JSON.stringify(quizPayload));
  
      res.status(201).json({ message: 'Quiz criado com sucesso!', quizId: newQuizz.id });
    } catch (error) {
      console.error('Erro ao criar o quiz:', error);
      res.status(500).json({ error: 'Erro ao criar o quiz' });
    }
  });
  