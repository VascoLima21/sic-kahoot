const mqtt = require('mqtt');

// Conectar ao broker MQTT
const mqttClient = mqtt.connect('mqtt://test.mosquitto.org');

mqttClient.on('message', (topic, message) => {
    try {
        const parsedMessage = JSON.parse(message.toString());
        console.log(`\nMensagem recebida no tópico: ${topic}`);
        console.log('-------------------------------');

        // Exibir a pergunta
        console.log(`Pergunta: ${parsedMessage.question}`);

        // Exibir as respostas
        console.log('Respostas:');
        parsedMessage.answers.forEach((answer, index) => {
            console.log(`  ${index + 1}. ${answer.answerText}`);
        });

        // Exibir o tempo de resposta
        console.log(`Tempo de resposta: ${parsedMessage.answerTime} segundos`);

        console.log('-------------------------------\n');
    } catch (e) {
        console.error('Erro ao processar a mensagem:', e);
    }
});

mqttClient.on('error', (err) => {
    console.error('Erro no cliente MQTT:', err);
    mqttClient.end();
});

mqttClient.on('close', () => {
    console.log('Cliente MQTT desconectado');
});

module.exports = { mqttClient };