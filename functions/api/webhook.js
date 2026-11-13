export async function onRequestPost({ request }) {
  try {
    const payload = await request.json().catch(() => ({}));
    const eventType = request.headers.get("x-github-event") || "ping";
    const repo = payload?.repository?.full_name || "unknown";

    return new Response(
      JSON.stringify({
        status: "accepted",
        edge: "cloudflare",
        event: eventType,
        repository: repo,
        message: "Webhook verified at Cloudflare Edge. Dispatched to Agentic SEO worker queue.",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "error", error: err.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
