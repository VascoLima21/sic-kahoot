const { mqttClient } = require('./mqttClient');

// Função para publicar uma mensagem no MQTT
const publishMessage = (topic, message) => {
  mqttClient.publish(topic, message, { qos: 1 }, (err) => {
    if (err) {
      console.error(`Erro ao publicar mensagem no tópico ${topic}:`, err);
    } else {
      console.log(`Mensagem publicada no tópico ${topic}`);
    }
  });
};

// Função para se inscrever em um tópico
const subscribeToTopic = (topic) => {
  mqttClient.subscribe(topic, { qos: 1 }, (err) => {
    if (err) {
      console.error('Erro ao se inscrever no tópico', topic);
    } else {
      console.log(`Inscrito no tópico ${topic}`);
    }
  });
};

module.exports = { publishMessage, subscribeToTopic };