export async function onRequestGet() {
  return new Response(
    JSON.stringify({
      status: "healthy",
      service: "agentic-seo-edge",
      provider: "Cloudflare Pages Functions",
      version: "2.0.0",
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
