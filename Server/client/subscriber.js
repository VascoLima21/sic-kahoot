const mqtt = require("mqtt");

let mqttClient;

// Conecção Mosquitto
const mqttHost = "test.mosquitto.org";
const protocol = "mqtt";
const port = "1883";

function connectToBroker() {
  const clientId = "client" + Math.random().toString(36).substring(7);

  // Change this to point to your MQTT broker
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
    console.log("Client connected:" + clientId);
  });

  // Received Message
  mqttClient.on("message", (topic, message) => {
    try {
      const parsedMessage = JSON.parse(message.toString());
      console.log("Received Message Object:", parsedMessage);

      if (topic.startsWith("Quizzes/Quiz1/Respostas")) {
        // Lógica para processar respostas
        console.log("Player Response Received:", parsedMessage);
      } else if (topic.startsWith("Quizzes/Quiz1/Pergunta")) {
        // Lógica para processar perguntas
        console.log("New Quiz Question Received:", parsedMessage);
      }
    } catch (e) {
      console.error("Error parsing message:", e);
    }
  });
}

function subscribeToTopic(topic) {
  console.log(`Subscribing to Topic: ${topic}`);
  mqttClient.subscribe(topic, { qos: 0 });
}

connectToBroker();
subscribeToTopic("Quizzes/#"); // Subscreve a todos os sub-tópicos de Quizzes
