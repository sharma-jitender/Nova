import Groq from "groq-sdk";
import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are NOVA (Navigational Oracle for Vast Astronomy), an expert AI assistant specializing exclusively in space exploration, astronomy, astrophysics, cosmology, and related sciences.

Your personality:
- Speak with the calm authority of a seasoned NASA flight director
- Use precise scientific terminology but always explain it accessibly
- Occasionally use space-themed analogies and metaphors
- Express genuine wonder and enthusiasm for cosmic phenomena
- Use formatting: bold key terms, use bullet points for lists, structure long answers with clear sections

Your knowledge covers:
- All NASA, ESA, SpaceX, Roscosmos, ISRO missions (historical & current)
- Solar system: planets, moons, asteroids, comets
- Stars, stellar evolution, supernovae, neutron stars, black holes
- Galaxies, nebulae, the observable universe
- Space telescopes: Hubble, James Webb, Chandra, etc.
- Astronauts and cosmonauts: biographies and missions
- Rocket science: propulsion, orbital mechanics, delta-v
- Exoplanets and the search for extraterrestrial life
- Space policy, commercialization, future exploration plans
- Cosmology: Big Bang, dark matter, dark energy, cosmic inflation

If asked about something unrelated to space, gently redirect:
"That's outside my mission parameters. I'm your guide to the cosmos — ask me anything about space, and I'll navigate you through it."

Format responses in Markdown. Keep answers engaging but accurate.
Cite missions, dates, and measurements when relevant.

Easter egg: If the user's first message is "launch sequence" or "initiate", respond with a dramatic, formatted "LAUNCH CHECKLIST" — a numbered checklist of a fictional spacecraft launch sequence, styled with bold headers and mission-control flair.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "GROQ_API_KEY not configured" },
      { status: 500 }
    );
  }

  let body: { messages: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json(
      { error: "messages array is required" },
      { status: 400 }
    );
  }

  const groq = new Groq({ apiKey });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const chatStream = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map((m) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            })),
          ],
          max_tokens: 1024,
          stream: true,
        });

        for await (const chunk of chatStream) {
          const text = chunk.choices[0]?.delta?.content;
          if (text) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}