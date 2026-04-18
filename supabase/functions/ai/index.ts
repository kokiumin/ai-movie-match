// Supabase Edge Function: Claude API proxy
// Keeps ANTHROPIC_API_KEY server-side. Frontend calls this function instead of
// hitting api.anthropic.com directly.

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const ALLOWED_ORIGINS = [
  "https://ai-movie-match.com",
  "https://www.ai-movie-match.com",
  "https://ai-movie-match.vercel.app",
  "http://localhost:5173",
  "http://localhost:4173",
];

const CORS_HEADERS_BASE = {
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Max-Age": "86400",
};

function corsHeaders(origin) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return { ...CORS_HEADERS_BASE, "Access-Control-Allow-Origin": allowed };
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured" }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const { model, max_tokens, temperature, system, messages } = body ?? {};
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages array is required" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const safeBody = {
    model: model || "claude-sonnet-4-20250514",
    max_tokens: Math.min(Number(max_tokens) || 2048, 4096),
    temperature: typeof temperature === "number" ? Math.max(0, Math.min(1, temperature)) : 0.3,
    messages: messages.slice(-20).map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: typeof m.content === "string" ? m.content.slice(0, 20000) : "",
    })),
  };
  if (typeof system === "string") {
    safeBody.system = system.slice(0, 8000);
  }

  try {
    const anthropicRes = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(safeBody),
    });

    const text = await anthropicRes.text();
    return new Response(text, {
      status: anthropicRes.status,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Proxy error: " + (err?.message || String(err)) }), {
      status: 502,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
