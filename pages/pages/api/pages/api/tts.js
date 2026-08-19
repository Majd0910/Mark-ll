const ELEVENLABS_VOICE_ID = "SyHeiQskEwLddZ1e6Q0x";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { text } = req.body || {};
  if (!text || typeof text !== "string") {
    res.status(400).json({ error: "Missing text" });
    return;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is missing ELEVENLABS_API_KEY" });
    return;
  }

  try {
    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.45, similarity_boost: 0.8 },
        }),
      }
    );

    if (!elevenRes.ok) {
      const errText = await elevenRes.text();
      res.status(elevenRes.status).json({ error: errText });
      return;
    }

    const arrayBuffer = await elevenRes.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    res.status(500).json({ error: "TTS request failed" });
  }
}
