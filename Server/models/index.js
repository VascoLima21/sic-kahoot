const sequelize = require('../../connection');

const User = require('./user.model');
const Question = require('./question.model');
const QuestionAnswer = require('./questionAnswer.model');
const Quizz = require('./quizz.model');
const QuizzInstance = require('./quizzInstance.model');
const UserQuestionAnswer = require('./userQuestionAnswer.model');
const UserQuizz = require('./userQuizz.model');

User.belongsToMany(Quizz, { through: UserQuizz, foreignKey: 'userId' });
Quizz.belongsToMany(User, { through: UserQuizz, foreignKey: 'quizzId' });

QuestionAnswer.belongsToMany(UserQuizz, { through: UserQuestionAnswer, foreignKey: 'answerId' });
UserQuizz.belongsToMany(QuestionAnswer, { through: UserQuestionAnswer, foreignKey: ['quizzId', 'userId'] });

QuestionAnswer.hasOne(Question, {foreignKey: 'questionId'});
Question.hasMany(QuestionAnswer, {foreignKey: 'questionId'});

Question.hasOne(Quizz, {foreignKey: 'quizzId'});
Quizz.hasMany(Question, {foreignKey: 'quizzId'});

Quizz.hasMany(QuizzInstance, {foreignKey: 'quizzId'});
QuizzInstance.belongsTo(Quizz, {foreignKey: 'quizzId'});

sequelize.sync({'logging': false, 'force': false});

module.exports = { User, Question, QuestionAnswer, Quizz, QuizzInstance, UserQuestionAnswer, UserQuizz };