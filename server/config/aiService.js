const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateHackathonAssistance = async (prompt, contextType) => {
    // Using gemini-flash-latest as verified to work with the current API Key
    const model = genAI.getGenerativeModel({
        model: "gemini-flash-latest"
    });

    let fullPrompt = "";

    switch (contextType) {
        case 'refine_problem':
            fullPrompt = `You are a professional hackathon mentor. 
Refine the following problem statement for clarity, technical relevance, and impact.
Do not introduce new ideas.

Problem Statement:
${prompt}`;
            break;

        case 'solution_approach':
            fullPrompt = `Provide a structured solution approach suitable for a hackathon submission.
Include architecture overview and feasibility.
Do not write code.

Project Idea:
${prompt}`;
            break;

        case 'module_breakdown':
            fullPrompt = `Break the following hackathon project into 4–5 technical modules.
For each module, give:
- Module name
- Responsibility

Project:
${prompt}`;
            break;

        case 'ppt_outline':
            fullPrompt = `Generate a professional PPT outline for a first-round hackathon submission.
Use short slide titles and bullet points.

Project:
${prompt}`;
            break;

        case 'debug_code':
            fullPrompt = `Explain the following code snippet and identify bugs.
Do not rewrite full code.
Only explain issues and suggest fixes.

Code:
${prompt}`;
            break;

        default:
            fullPrompt = prompt;
    }

    try {
        const result = await model.generateContent(fullPrompt);
        return result.response.text();
    } catch (error) {
        console.error("Gemini Generation Error:", error.message);
        throw error;
    }
};

module.exports = { generateHackathonAssistance };
