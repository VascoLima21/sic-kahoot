const mqtt = require('mqtt');

// Conectar ao broker MQTT com o protocolo mqtt://
const mqttClient = mqtt.connect('mqtt://test.mosquitto.org');

// Configuração dos eventos de callback
mqttClient.on('connect', () => {
  console.log('MQTT client connected');
});

mqttClient.on('error', (err) => {
  console.error('Erro no cliente MQTT:', err);
  mqttClient.end();
});

mqttClient.on('close', () => {
  console.log('MQTT client disconnected');
});

module.exports = mqttClient;