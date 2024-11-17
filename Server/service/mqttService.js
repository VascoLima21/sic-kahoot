// services/mqttService.js
const {mqttClient} = require('./mqttClient');

// Função para publicar uma mensagem
const publishMessage = (topic, message) => {
  mqttClient.publish(topic, message, { qos: 0 });
};

// Função para se inscrever em um tópico
const subscribeToTopic = (topic) => {
  mqttClient.subscribe(topic, { qos: 0 }, (err) => {
    if (err) {
      console.error('Erro ao se inscrever no tópico', topic);
    } else {
      console.log(`Inscrito no tópico ${topic}`);
    }
  });
};

// Função para receber mensagens
mqttClient.on('message', (topic, message) => {
  console.log(`Mensagem recebida no tópico: ${topic}`);
  console.log('Mensagem:', message.toString());
});

module.exports = { publishMessage, subscribeToTopic };