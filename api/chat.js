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
Your job is to answer questions about the Motor Vehicles Act, fines, ownership transfers, driving licenses, and other related services.
Keep your answers professional, concise, and helpful. Do not use complex markdown formatting like headers, so it fits nicely in a small chat window.

User's question: ${message}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
        console.error("Gemini API Error:", data);
        return res.status(500).json({ error: 'Failed to fetch from Gemini API' });
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
