// sentimentHelper.js
export async function classifyEmotion(text) {
    const response = await fetch("https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: text })
    });
    const result = await response.json();
    return result;
}
