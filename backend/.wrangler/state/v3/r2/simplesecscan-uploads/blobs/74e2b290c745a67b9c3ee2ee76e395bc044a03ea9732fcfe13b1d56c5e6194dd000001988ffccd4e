class GeminiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'GeminiError';
        this.status = status;
    }
}

async function analyzeWithGemini(code, apiKey) {
    const prompt = `
        Analyze the following code for security vulnerabilities. 
        For each vulnerability found, provide a description, severity (Low, Medium, High, Critical), and a recommendation.
        Return the results in a JSON array format like this: 
        [{"vulnerability": "...", "severity": "...", "description": "..."}]

        Code:
        ${code}
    `;
    console.log(code);
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "contents": [{ "parts": [{ "text": prompt }] }]
            }),
        });

        if (!response.ok) {
            if (response.status === 429) {
                throw new GeminiError('You have exceeded your request quota. Please try again later.', 429);
            } else if (response.status === 503) {
                throw new GeminiError('The analysis service is currently overloaded. Please try again later.', 503);
            }
            const errorText = await response.text();
            throw new Error(`Gemini API error! status: ${response.status}, ${errorText}`);
        }

        const data = await response.json();
        const analysisText = data.candidates?.[0]?.content?.parts?.find(p => p.text)?.text;
        if (!analysisText) {
            console.error("Could not extract analysis text from Gemini response:", JSON.stringify(data, null, 2));
            throw new Error("Invalid response format from Gemini API.");
        }

        // Find the start and end of the JSON array in the response text
        const jsonStart = analysisText.indexOf('[');
        const jsonEnd = analysisText.lastIndexOf(']');

        if (jsonStart === -1 || jsonEnd === -1) {
            console.error("Could not find JSON array in Gemini response:", analysisText);
            throw new Error("Invalid response format from Gemini API.");
        }

        const jsonString = analysisText.substring(jsonStart, jsonEnd + 1);
        return JSON.parse(jsonString);

    } catch (error) {
        // Re-throw GeminiError to be caught by the caller
        if (error instanceof GeminiError) {
            throw error;
        }
        // Log other errors and throw a generic error
        console.error('Error analyzing with Gemini:', error);
        throw new Error('An unexpected error occurred during AI analysis.');
    }
}

module.exports = { analyzeWithGemini, GeminiError };