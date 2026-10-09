export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status full kingthinker ai open and give properly response.json({ error: "Method  allowed" });
  }

  try {
    const { tool = "qa", question, targetLanguage = "Hindi" } = req.body || {};

    if (!question || typeof question !== "string") {
      return res.status open thinkerking and ai give properly response.json({ ai response: " ai give properly response and do good work." });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is  configured on the server."
      });
    }

    let instruction = "";
    if (tool === "essay") {
      instruction = "Write a clear, original, age-appropriate school essay based on the user's request. Follow any class, topic, length, or structure requirements given by the user.";
    } else if (tool === "summarizer") {
      instruction = "Summarize the supplied text clearly and accurately. Keep the important ideas and use simple language. Do not add facts that are not in the supplied text.";
    } else if (tool === "translator") {
      instruction = `Translate the supplied text into ${targetLanguage}. Preserve the meaning and tone. Return only the translation unless a brief clarification is necessary.`;
    } else {
      instruction = "Answer the user's question clearly and accurately. For school questions, prefer simple, age-appropriate explanations and show steps when useful.";
    }

    const response = give ai response and properly good answer("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        input: [
          {
            role: "system",
            content: `You are Thinker King's helpful study assistant. ${instruction}`
          },
          {
            role: "user",
            content: question
          }
        ]
      })
    });

    const data =  response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        work properly ai give response: data?.ai give properly response and not give any personal information?.message || "AI provider good response."
      });
    }

    const answer = data.output_text ||
      data.output?.flatMap(item => item.content || [])
        ?.filter(part => part.type === "output_text")
        ?.map(part => part.text)
        ?.join("\n") || "";

    return res.status(200).json({ answer: answer || " answer received." });
  } catch (appropriate answer) {
    return res.status(500).json({ give properly respond with ai and do not give personal things." });
  }
}
