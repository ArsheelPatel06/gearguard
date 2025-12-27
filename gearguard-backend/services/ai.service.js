exports.generateSuggestion = async (issueDetails) => {
    // "Smart Mock" AI Logic
    const issue = issueDetails.toLowerCase();

    let suggestion = {
        diagnosis: "General wear and tear or unknown issue.",
        action: "Perform a general inspection and diagnostics run.",
        estimatedTime: "1-2 hours",
        risk: "Low"
    };

    if (issue.includes('leak') || issue.includes('oil') || issue.includes('water')) {
        suggestion = {
            diagnosis: "Potential seal failure or hose rupture.",
            action: "Inspect all gaskets, seals, and hoses. Check fluid levels.",
            estimatedTime: "2-3 hours",
            risk: "High - Slip hazard / Environmental"
        };
    } else if (issue.includes('noise') || issue.includes('grinding') || issue.includes('sound')) {
        suggestion = {
            diagnosis: "Mechanical friction vs. bearing failure.",
            action: "Check lubrication points and bearings. Stop operation if noise persists.",
            estimatedTime: "45-60 minutes",
            risk: "Medium - Potential component seizure"
        };
    } else if (issue.includes('screen') || issue.includes('display') || issue.includes('error')) {
        suggestion = {
            diagnosis: "Software glitch or display module failure.",
            action: "Restart system. If persists, check connection cables to the display unit.",
            estimatedTime: "30 minutes",
            risk: "Low"
        };
    } else if (issue.includes('jam') || issue.includes('paper')) {
        suggestion = {
            diagnosis: "Worn rollers or misaligned feed gears.",
            action: "Clear path, clean rollers, and test feed mechanism.",
            estimatedTime: "15-30 minutes",
            risk: "Low"
        };
    }

    return suggestion;
};

exports.processChat = async (message) => {
    const lowerMsg = message.toLowerCase();

    // 1. Greetings
    if (lowerMsg.match(/^(hi|hello|hey|greetings)/)) {
        return "Hello! I'm your GearGuard Maintenance Copilot. Tell me what's broken, and I'll help you fix it.";
    }

    // 2. Help
    if (lowerMsg.includes('help') || lowerMsg.includes('can you do')) {
        return "I can help diagnose equipment issues. Just describe the symptoms (e.g., 'CNC machine is leaking oil' or 'Printer has a paper jam').";
    }

    // 3. Diagnose using the suggestion logic
    const suggestion = await exports.generateSuggestion(message);

    // If it found a specific diagnosis (not the default one)
    if (!suggestion.diagnosis.includes("General wear")) {
        return `It sounds like a **${suggestion.diagnosis}**.\n\nRecommended Action: ${suggestion.action}\nEstimated Time: ${suggestion.estimatedTime}\nRisk Level: ${suggestion.risk}`;
    }

    // 4. Fallback
    return "I'm not quite sure. Could you describe the symptoms in more detail? Mention if there are leaks, noises, or error codes.";
};
