/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Configuration, OpenAIApi } = require("openai");

admin.initializeApp(); 

const configuration = new Configuration({
    apiKey: "sk-svcacct-9NI-9VFHNosmG6YMgCMtxKgPqNkVACcx9ljTguCxVffT1wuC6asZ1mBQibqQ9shT3BlbkFJhiojFzW_M2H1KNn526oBNh2Ukw-0E8UcZfH18Tu7qD8dzkh8i3v-ZwSgdf4B_AA", 
});
const openai = new OpenAIApi(configuration);

exports.chatbotResponse = functions.https.onRequest(async (req, res) => {
    try {
        const { userMessage } = req.body;
        if (!userMessage) {
            return res.status(400).send({ error: "User message is required" });
        }

        const openAiResponse = await openai.createCompletion({
            model: "text-davinci-003", 
            prompt: userMessage,
            max_tokens: 150,
            temperature: 0.7,
        });

        const botReply = openAiResponse.data.choices[0].text.trim();
        res.status(200).send({ reply: botReply });
    } catch (error) {
        console.error("Error with chatbot:", error);
        res.status(500).send({ error: "Failed to process the chatbot response" });
    }
});