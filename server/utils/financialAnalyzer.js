const axios = require("axios");

async function analyzeTranscript(text) {
    try {
        console.log("Preparing transcript for single-call analysis...");

        const usableText = text.substring(0, 12000);

        const prompt = `
You are an expert financial analyst.

Perform a DETAILED analysis of the following earnings call transcript.

Your response must contain:

SECTION A – EXECUTIVE SUMMARY  
- A 6–8 sentence paragraph summarizing the overall performance, major themes, and outlook.

SECTION B – STRUCTURED ANALYSIS  

1. Management Tone  
   - Describe tone in detail (optimistic, cautious, defensive, etc.)
   - Provide reasons from the transcript

2. Confidence Level  
   - High / Medium / Low  
   - Explain why with context

3. Key Positives (at least 5)  
   - Include operational and financial positives  
   - Add brief explanation for each

4. Key Concerns / Risks (at least 5)  
   - Business risks, market challenges, internal issues  
   - Explain impact

5. Forward Guidance  
   - Revenue outlook  
   - Margin outlook  
   - Strategic priorities  
   - Any numerical or directional guidance

6. Capacity Utilization  
   - Trends in production or utilization  
   - Expansion plans if mentioned

7. New Growth Initiatives  
   - New products  
   - New markets  
   - Strategic investments  
   - Partnerships or acquisitions

SECTION C – ADDITIONAL INSIGHTS  

- Important qualitative observations  
- Notable management comments  
- Market conditions mentioned  
- Competitive positioning  

RULES:
- Do NOT invent information  
- Do NOT hallucinate numbers  
- Base everything strictly on the transcript  
- If something is not mentioned, clearly state “Not specified in transcript”

Transcript:
${usableText}
`;

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`
                }
            }
        );

        return response.data.choices[0].message.content;

    } catch (error) {
        console.error("Groq Error:", error.message);
        throw new Error("AI Analysis Failed");
    }
}

module.exports = { analyzeTranscript };
