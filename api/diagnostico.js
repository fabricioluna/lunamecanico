// Arquivo: api/diagnostico.js
export default async function handler(req, res) {
    // A Vercel injeta a chave aqui, no lado do servidor (seguro)
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "Chave da API não configurada na Vercel." });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Método não permitido" });
    }

    try {
        const { prompt } = req.body;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Devolve apenas a resposta do texto para o seu site
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
