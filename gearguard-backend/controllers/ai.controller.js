const service = require('../services/ai.service');

module.exports = {
    // Returns structured JSON for the form auto-fill
    getSuggestion: async (req, res) => {
        try {
            const { subject, description } = req.body;
            const textToAnalyze = `${subject} ${description || ''}`;

            const suggestion = await service.generateSuggestion(textToAnalyze);
            res.status(200).json(suggestion);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Returns a text response for the Chatbot UI
    chat: async (req, res) => {
        try {
            const { message } = req.body;
            if (!message) return res.status(400).json({ message: "Message is required" });

            const response = await service.processChat(message);
            res.status(200).json({ response });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
