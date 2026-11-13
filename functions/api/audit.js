/**
 * Cloudflare Edge SEO Audit Engine.
 * Runs instantly on Cloudflare Workers without requiring any git clone or server install.
 */
export async function onRequestGet({ request }) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new Response(
      JSON.stringify({
        error: "Missing url parameter. Example: /api/audit?url=https://example.com",
      }),
      { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`);
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid URL provided." }),
      { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }

  const startTime = Date.now();
  const origin = parsedUrl.origin;

  try {
    // 1. Fetch main page HTML
    const pageRes = await fetch(parsedUrl.href, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AgenticSEOBot/2.0; +https://agentic-seo.pages.dev)",
      },
      redirect: "follow",
    });

    const responseTime = Date.now() - startTime;
    const statusCode = pageRes.status;
    const headers = Object.fromEntries(pageRes.headers.entries());
    const html = await pageRes.text();

    // Security Headers Check
    const security = {
      hsts: !!headers["strict-transport-security"],
      x_frame_options: !!headers["x-frame-options"],
      x_content_type_options: !!headers["x-content-type-options"],
      csp: !!headers["content-security-policy"],
      referrer_policy: !!headers["referrer-policy"],
    };
    const securityScore = Object.values(security).filter(Boolean).length * 20;

    // Basic SEO Meta Extraction
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    const description = descMatch ? descMatch[1].trim() : null;

    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
    const canonical = canonicalMatch ? canonicalMatch[1].trim() : null;

    const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i);
    const robotsMeta = robotsMatch ? robotsMatch[1].trim() : null;

    // Check robots.txt & llms.txt in parallel
    const [robotsRes, llmsRes] = await Promise.all([
      fetch(`${origin}/robots.txt`).catch(() => null),
      fetch(`${origin}/llms.txt`).catch(() => null),
    ]);

    const hasRobots = robotsRes && robotsRes.status === 200;
    const hasLlms = llmsRes && llmsRes.status === 200;

    // Calculate Edge Health Score (0-100)
    let score = 30; // base score for resolving
    if (statusCode === 200) score += 20;
    if (title) score += 10;
    if (description) score += 10;
    if (canonical) score += 10;
    if (hasRobots) score += 10;
    if (hasLlms) score += 10;

    return new Response(
      JSON.stringify({
        url: parsedUrl.href,
        status: "success",
        timestamp: new Date().toISOString(),
        engine: "Cloudflare Edge Engine (Zero-Clone)",
        response_time_ms: responseTime,
        status_code: statusCode,
        score: Math.min(100, score),
        seo: {
          title,
          title_length: title ? title.length : 0,
          description,
          description_length: description ? description.length : 0,
          canonical,
          robots_meta: robotsMeta,
          has_robots_txt: hasRobots,
          has_llms_txt: hasLlms,
        },
        security: {
          score: securityScore,
          headers: security,
        },
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
      JSON.stringify({ error: `Failed to audit target URL: ${err.message}` }),
      { status: 502, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
}
