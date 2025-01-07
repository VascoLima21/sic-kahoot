const { mqttClient } = require('./mqttClient');

// Função para publicar uma mensagem no MQTT
const publishMessage = (topic, message) => {
  return new Promise((resolve, reject) => {
      mqttClient.publish(topic, message, { qos: 1 }, (err) => {
          if (err) {
              console.error(`Erro ao publicar mensagem no tópico ${topic}:`, err);
              reject(err);
          } else {
              console.log(`Mensagem publicada no tópico ${topic}:`, message);
              resolve();
          }
      });
  });
};

// Função para se inscrever em um tópico
const subscribeToTopic = (topic) => {
  return new Promise((resolve, reject) => {
      mqttClient.subscribe(topic, { qos: 1 }, (err) => {
          if (err) {
              console.error(`Erro ao se inscrever no tópico ${topic}:`, err);
              reject(err);
          } else {
              console.log(`Inscrito com sucesso no tópico ${topic}`);
              resolve();
          }
      });
  });
};

module.exports = { publishMessage, subscribeToTopic };