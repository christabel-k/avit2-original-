export default async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "A valid prompt is required." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API key loaded:", Boolean(apiKey));
    console.log("API key loaded:", apiKey);

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Gemini API key is missing." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini status:", response.status);
console.log("Gemini error:", JSON.stringify(data.error));

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });

} catch (error) {
  console.error("Gemini function error:", error);

  return new Response(
    JSON.stringify({
      error: error.message || "Something went wrong while getting the recommendation.",
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
}
};