/**
 * Agentic SEO - Official Cloudflare Edge Worker
 * Deployed directly on Cloudflare Edge Infrastructure
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Health endpoint
  if (url.pathname === '/health' || url.pathname === '/') {
    return new Response(JSON.stringify({
      status: 'active',
      service: 'Agentic SEO Cloudflare Edge Engine',
      version: '2.0.0',
      region: request.cf ? request.cf.colo : 'global',
      endpoints: {
        audit: '/api/audit?url=https://example.com',
        health: '/health',
        webhook: '/webhook/github'
      },
      timestamp: new Date().toISOString()
    }, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Live Edge Audit Endpoint
  if (url.pathname === '/api/audit') {
    const target = url.searchParams.get('url');
    if (!target) {
      return new Response(JSON.stringify({ error: 'Missing ?url parameter. Example: /api/audit?url=https://example.com' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let parsedTarget;
    try {
      parsedTarget = new URL(target.startsWith('http') ? target : 'https://' + target);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    try {
      const startTime = Date.now();

      // 1. Fetch target HTML directly from edge (no browser CORS limits)
      const pageRes = await fetch(parsedTarget.href, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AgenticSEOBot/2.0; +https://dalroot.github.io/agentic-seo/)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        redirect: 'follow'
      });

      const responseTime = Date.now() - startTime;
      const statusCode = pageRes.status;
      const headers = Object.fromEntries(pageRes.headers.entries());
      const html = await pageRes.text();

      // 2. Real Security Headers Inspection
      const security = {
        hsts: !!headers['strict-transport-security'],
        x_frame_options: !!headers['x-frame-options'],
        x_content_type: !!headers['x-content-type-options'],
        csp: !!headers['content-security-policy'],
        referrer_policy: !!headers['referrer-policy'],
        permissions_policy: !!headers['permissions-policy']
      };
      const securityPassed = Object.values(security).filter(Boolean).length;
      const securityScore = Math.round((securityPassed / 6) * 100);

      // 3. Real HTML Metadata Extraction
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : null;

      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
      const description = descMatch ? descMatch[1].trim() : null;

      const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) ||
                             html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
      const canonical = canonicalMatch ? canonicalMatch[1].trim() : null;

      const robotsMetaMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i);
      const robotsMeta = robotsMetaMatch ? robotsMetaMatch[1].trim() : null;

      const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html);
      const ogTitle = /<meta[^>]*property=["']og:title["']/i.test(html);
      const ogImage = /<meta[^>]*property=["']og:image["']/i.test(html);

      // 4. Parallel real probe of robots.txt and llms.txt
      const origin = parsedTarget.origin;
      const [robotsRes, llmsRes] = await Promise.all([
        fetch(`${origin}/robots.txt`, { headers: { 'User-Agent': 'AgenticSEOBot/2.0' } }).catch(() => null),
        fetch(`${origin}/llms.txt`, { headers: { 'User-Agent': 'AgenticSEOBot/2.0' } }).catch(() => null)
      ]);

      const hasRobots = robotsRes && robotsRes.status === 200;
      let robotsTxtContent = hasRobots ? await robotsRes.text() : '';
      const gptBotAllowed = hasRobots ? !/User-agent:\s*GPTBot\s*\n\s*Disallow:\s*\//i.test(robotsTxtContent) : true;
      const claudeBotAllowed = hasRobots ? !/User-agent:\s*ClaudeBot\s*\n\s*Disallow:\s*\//i.test(robotsTxtContent) : true;

      const hasLlms = llmsRes && llmsRes.status === 200;

      // 5. Deterministic Score Calculation
      let onpageScore = 0;
      if (title && title.length >= 10 && title.length <= 65) onpageScore += 30;
      else if (title) onpageScore += 15;
      if (description && description.length >= 70 && description.length <= 165) onpageScore += 30;
      else if (description) onpageScore += 15;
      if (canonical) onpageScore += 20;
      if (hasViewport) onpageScore += 10;
      if (ogTitle && ogImage) onpageScore += 10;

      let geoScore = 40;
      if (gptBotAllowed) geoScore += 20;
      if (claudeBotAllowed) geoScore += 20;
      if (hasLlms) geoScore += 20;

      const overall = Math.round((onpageScore * 0.4) + (geoScore * 0.3) + (securityScore * 0.3));
      const grade = overall >= 85 ? 'A' : overall >= 70 ? 'B' : overall >= 50 ? 'C' : 'D';

      return new Response(JSON.stringify({
        url: parsedTarget.href,
        domain: parsedTarget.hostname,
        status: 'success',
        timestamp: new Date().toISOString(),
        network: {
          status_code: statusCode,
          response_time_ms: responseTime,
          edge_datacenter: request.cf ? request.cf.colo : 'global',
          ip: request.headers.get('cf-connecting-ip') || 'edge-resolved',
          is_https: parsedTarget.protocol === 'https:'
        },
        scores: {
          overall: overall,
          grade: grade,
          onpage_seo: onpageScore,
          ai_search_geo: geoScore,
          security_posture: securityScore
        },
        metadata: {
          title: title,
          title_length: title ? title.length : 0,
          description: description,
          description_length: description ? description.length : 0,
          canonical: canonical,
          robots_meta: robotsMeta,
          has_viewport: hasViewport,
          social_tags: { og_title: ogTitle, og_image: ogImage }
        },
        ai_search: {
          has_robots_txt: hasRobots,
          gptbot_allowed: gptBotAllowed,
          claudebot_allowed: claudeBotAllowed,
          has_llms_txt: hasLlms
        },
        security_headers: security
      }, null, 2), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Failed to inspect target website: ' + err.message }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}
