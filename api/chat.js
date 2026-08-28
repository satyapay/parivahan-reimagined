module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const prompt = `You are Parivahan Sahayak, the official AI assistant for the Indian government's Parivahan Sewa portal. 
Your STRICT mandate is to answer questions ONLY related to the Motor Vehicles Act, road safety, driving licenses, vehicle registration, challans (fines), and transport services in India.

CRITICAL RULES:
1. If the user asks ANY question that is NOT related to motor vehicles, transport, roads, or driving in India, you MUST refuse to answer. 
2. Use exactly this fallback response for off-topic questions: "I apologize, but I am Parivahan Sahayak. I can only assist you with questions related to the Motor Vehicles Act, transport services, and road rules in India."
3. Keep your answers professional, concise, and helpful. Do not use complex markdown formatting like headers.

User's question: ${message}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 200,
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
        console.error("Gemini API Error:", JSON.stringify(data));
        return res.status(500).json({ error: 'Failed to fetch from Gemini API', details: data });
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
