import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { aiDescriptionSchema } from "@/features/auth/schemas";
import { getAccessToken } from "@/lib/session";
import { springFetch } from "@/lib/spring";

const hits = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 10;

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

export async function POST(request: Request) {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const me = await springFetch("/users/me");
    if (me.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch {
    // Still allow if Spring is down but a session cookie exists.
  }

  const json = await request.json().catch(() => null);
  const parsed = aiDescriptionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const userKey = token.slice(-12);
  if (rateLimited(userKey)) {
    return NextResponse.json({ error: "Too many AI requests. Try later." }, { status: 429 });
  }

  const apiKey = process.env.OPENAI_API_KEY ?? process.env.AI_API_KEY;
  if (apiKey && !process.env.OPENAI_API_KEY) {
    process.env.OPENAI_API_KEY = apiKey;
  }
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI is not configured. Ask your teammate to set AI_API_KEY." },
      { status: 503 },
    );
  }

  const modelName = process.env.AI_MODEL ?? "gpt-4o-mini";
  const { businessName, category, services, area, yearsOfExperience } = parsed.data;
  const prompt = `Write a customer-facing business description of at most 500 characters for "${businessName}". Category: ${category}. Extra services: ${services.join(", ") || "none"}. Service area: ${area}. Years of experience: ${yearsOfExperience}. Tone: warm, professional, local. Return only the description.`;

  try {
    const result = await generateText({
      model: openai(modelName),
      prompt,
      abortSignal: AbortSignal.timeout(Number(process.env.AI_TIMEOUT_MS ?? 15000)),
    });
    const description = result.text.slice(0, 500);
    return new Response(description, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not generate a description right now." },
      { status: 502 },
    );
  }
}
