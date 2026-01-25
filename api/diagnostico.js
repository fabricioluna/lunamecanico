
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "Chave da API não configurada na Vercel." });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Método não permitido." });
    }

    try {
        // Agora suporta 'mediaFiles' que é um array de { mimeType, data }
        // Mantemos 'audioData' e 'mimeType' antigos por compatibilidade, mas o ideal é usar mediaFiles
        const { prompt, audioData, mimeType, mediaFiles } = req.body;

        const parts = [{ text: prompt }];

        // 1. Suporte legado (Áudio do Grupo 3)
        if (audioData && mimeType) {
            parts.push({
                inlineData: {
                    mimeType: mimeType,
                    data: audioData
                }
            });
        }

        // 2. Novo suporte (Múltiplos arquivos do Resumo do Motorista)
        if (mediaFiles && Array.isArray(mediaFiles)) {
            mediaFiles.forEach(file => {
                parts.push({
                    inlineData: {
                        mimeType: file.mimeType,
                        data: file.data
                    }
                });
            });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: parts }] })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const textResponse = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ result: textResponse });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
