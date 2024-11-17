const mqtt = require('mqtt');

// Conectar ao broker MQTT com o protocolo mqtt://
const mqttClient = mqtt.connect('mqtt://test.mosquitto.org');

let topicQueue = [];

const subscribeWhenConnected = (topic) => {
    if (mqttClient.connected) {
        mqttClient.subscribe(topic, { qos: 0 }, (err) => {
            if (err) {
                console.error('Erro ao se inscrever no tópico:', err);
            } else {
                console.log(`Inscrito com sucesso no tópico: ${topic}`);
            }
        });
    } else {
        topicQueue.push(topic);
    }
};

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

module.exports = { mqttClient, subscribeWhenConnected };