export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { tool = "qa", question, targetLanguage = "Hindi" } = req.body || {};

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Please enter some text." });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured on the server."
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

    const response = await fetch("https://api.openai.com/v1/responses", {
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

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "AI provider request failed."
      });
    }

    const answer = data.output_text ||
      data.output?.flatMap(item => item.content || [])
        ?.filter(part => part.type === "output_text")
        ?.map(part => part.text)
        ?.join("\n") || "";

    return res.status(200).json({ answer: answer || "No answer received." });
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}
