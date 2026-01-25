// Arquivo: api/diagnostico.js
export default async function handler(req, res) {
    // Adiciona cabeçalhos para permitir que seu site acesse a API (CORS)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Responde imediatamente a requisições OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "Chave da API não configurada no servidor." });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Método não permitido. Use POST." });
    }

    try {
        const { prompt } = req.body;

        // Chama a API do Google (Usando REST puro para não depender de biblioteca no serverless)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Extrai apenas o texto da resposta para enviar limpo ao front
        const textResponse = data.candidates[0].content.parts[0].text;

        return res.status(200).json({ result: textResponse });

    } catch (error) {
        console.error("Erro na API:", error);
        return res.status(500).json({ error: error.message || "Erro ao processar solicitação." });
    }
}
