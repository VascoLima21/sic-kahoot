const express = require("express");
const router = express.Router();

var publisherController = require("../controllers/publisherController");

// Publisher Home Route.
router.get("/", publisherController.getPublisherPage);

router.post("/", publisherController.publishMQTTMessage);

module.exports = router;
