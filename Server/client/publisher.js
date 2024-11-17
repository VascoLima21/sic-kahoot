const mqtt = require("mqtt");

var mqttClient;

// Configurações do broker MQTT
const mqttHost = "test.mosquitto.org"; // Altere para o IP/host do seu broker
const protocol = "mqtt";
const port = "1883";

function connectToBroker() {
  const clientId = "client" + Math.random().toString(36).substring(7);

  const hostURL = `${protocol}://${mqttHost}:${port}`;

  const options = {
    keepalive: 60,
    clientId: clientId,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
  };

  mqttClient = mqtt.connect(hostURL, options);

  mqttClient.on("error", (err) => {
    console.log("Error: ", err);
    mqttClient.end();
  });

  mqttClient.on("reconnect", () => {
    console.log("Reconnecting...");
  });

  mqttClient.on("connect", () => {
    console.log("Client connected: " + clientId);

    // Publicar uma mensagem de exemplo após a conexão ser bem-sucedida
    publishMessage("Quizzes/QuizzCapitals/Pergunta1", JSON.stringify({
      pergunta: "Qual é a capital da França?",
      opcoes: ["Paris", "Marselha", "Lyon"],
      correta: "Paris"
    }));

    // Outra mensagem de exemplo
    publishMessage("Quizzes/QuizzCapitals/Pergunta2", JSON.stringify({
      pergunta: "Qual é a capital da Espanha?",
      opcoes: ["Madrid", "Barcelona", "Sevilha"],
      correta: "Madrid"
    }));
  });

  // Receber mensagens para debug (opcional)
  mqttClient.on("message", (topic, message, packet) => {
    console.log(
      "Received Message: " + message.toString() + "\nOn topic: " + topic
    );
  });
}

function publishMessage(topic, message) {
  console.log(`Enviando Tópico: ${topic}, Mensagem: ${message}`);
  mqttClient.publish(topic, message, {
    qos: 0,
    retain: false,
  });
}

connectToBroker();