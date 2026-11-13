/**
 * Agentic SEO - Official Cloudflare Edge Worker
 * Deployed directly on Cloudflare Edge Infrastructure (V8 Isolate)
 *
 * Full 360° Edge Diagnostic Engine:
 * - Network & Infrastructure (TTFB, SSL/TLS, IP, Content Encoding, HTML Weight)
 * - Security & HTTP Header Posture (HSTS, CSP, X-Frame, MIME Sniffing, Referrer Policy)
 * - On-Page Core SEO (Title, Description, Canonical, Robots Meta, Viewport, Charset, Lang)
 * - Heading Semantics & Hierarchy (H1 count, H2/H3 outline, Multiple/Missing H1 detection)
 * - Image Optimization (Alt attribute compliance, Lazy loading ratio)
 * - Link Architecture & Security (Internal vs External, Reverse Tabnabbing checks)
 * - Structured Data (JSON-LD Schema.org extraction: Organization, WebSite, Article, Product, etc.)
 * - Content Depth & Readability (Clean word count, Reading time, Thin content flag)
 * - Technology & CMS Detection (WordPress, Next.js, Shopify, Webflow, React, Vue)
 * - AI Search & GEO Matrix (Robots.txt, GPTBot, ClaudeBot, PerplexityBot, CCBot, Google-Extended, /llms.txt)
 * - Discovery Endpoints (Sitemap.xml validation)
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

  // 1. Health & Discovery Endpoint
  if (url.pathname === '/health') {
    return new Response(JSON.stringify({
      status: 'active',
      service: 'Agentic SEO Cloudflare Edge Engine',
      version: '2.5.0',
      region: request.cf ? request.cf.colo : 'global',
      endpoints: {
        audit: '/api/audit?url=https://example.com',
        health: '/health',
        site: '/'
      },
      timestamp: new Date().toISOString()
    }, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // 2. Comprehensive 360° Edge Diagnostic Audit Endpoint
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

      // Parallel Probe: Fetch main HTML, robots.txt, llms.txt, and sitemap.xml simultaneously
      const origin = parsedTarget.origin;
      const [pageRes, robotsRes, llmsRes, sitemapRes] = await Promise.all([
        fetch(parsedTarget.href, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; AgenticSEOBot/2.5; +https://seo.lookanet.app/)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          },
          redirect: 'follow'
        }),
        fetch(`${origin}/robots.txt`, {
          headers: { 'User-Agent': 'AgenticSEOBot/2.5' }
        }).catch(() => null),
        fetch(`${origin}/llms.txt`, {
          headers: { 'User-Agent': 'AgenticSEOBot/2.5' }
        }).catch(() => null),
        fetch(`${origin}/sitemap.xml`, {
          headers: { 'User-Agent': 'AgenticSEOBot/2.5' }
        }).catch(() => null)
      ]);

      const responseTime = Date.now() - startTime;
      const statusCode = pageRes.status;
      const headers = Object.fromEntries(pageRes.headers.entries());
      const html = await pageRes.text();
      const htmlSizeKb = Math.round((html.length / 1024) * 10) / 10;

      // -------------------------------------------------------------
      // Pillar A: Security & Header Posture (OWASP)
      // -------------------------------------------------------------
      const security = {
        hsts: !!headers['strict-transport-security'],
        csp: !!headers['content-security-policy'],
        x_frame_options: !!headers['x-frame-options'],
        x_content_type: !!headers['x-content-type-options'],
        referrer_policy: !!headers['referrer-policy'],
        permissions_policy: !!(headers['permissions-policy'] || headers['feature-policy'])
      };
      const securityPassed = Object.values(security).filter(Boolean).length;
      const securityScore = Math.round((securityPassed / 6) * 100);

      // -------------------------------------------------------------
      // Pillar B: On-Page Metadata & Semantics
      // -------------------------------------------------------------
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : null;
      const titleLength = title ? title.length : 0;

      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
      const description = descMatch ? descMatch[1].trim() : null;
      const descriptionLength = description ? description.length : 0;

      const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) ||
                             html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
      const canonical = canonicalMatch ? canonicalMatch[1].trim() : null;
      const isSelfCanonical = canonical ? (canonical.replace(/\/$/, '') === parsedTarget.href.replace(/\/$/, '')) : false;

      const robotsMetaMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i);
      const robotsMeta = robotsMetaMatch ? robotsMetaMatch[1].trim() : null;

      const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html);
      const charsetMatch = html.match(/<meta[^>]*charset=["']?([^"'>\s]+)/i);
      const charset = charsetMatch ? charsetMatch[1].toUpperCase() : 'Not declared';
      const langMatch = html.match(/<html[^>]*lang=["']([^"']*)["']/i);
      const language = langMatch ? langMatch[1] : 'Not declared';

      const socialTags = {
        og_title: /<meta[^>]*property=["']og:title["']/i.test(html),
        og_description: /<meta[^>]*property=["']og:description["']/i.test(html),
        og_image: /<meta[^>]*property=["']og:image["']/i.test(html),
        twitter_card: /<meta[^>]*name=["']twitter:card["']/i.test(html)
      };

      let onpageScore = 0;
      if (title && titleLength >= 35 && titleLength <= 65) onpageScore += 25;
      else if (title) onpageScore += 12;

      if (description && descriptionLength >= 100 && descriptionLength <= 165) onpageScore += 25;
      else if (description) onpageScore += 12;

      if (canonical) onpageScore += 20;
      if (hasViewport) onpageScore += 10;
      if (socialTags.og_title && socialTags.og_image) onpageScore += 10;
      if (language !== 'Not declared') onpageScore += 10;

      // -------------------------------------------------------------
      // Pillar C: Heading Architecture & Semantics
      // -------------------------------------------------------------
      const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
      const h2Matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
      const h3Matches = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)];

      const h1Count = h1Matches.length;
      let headingStatus = 'optimal';
      if (h1Count === 0) headingStatus = 'missing_h1';
      else if (h1Count > 1) headingStatus = 'multiple_h1';

      // -------------------------------------------------------------
      // Pillar D: Image SEO & Alt Compliance
      // -------------------------------------------------------------
      const imgMatches = [...html.matchAll(/<img([^>]*)>/gi)];
      let missingAltCount = 0;
      let lazyLoadedCount = 0;

      for (const img of imgMatches) {
        const attrs = img[1];
        if (!/alt=["'][^"']+["']/i.test(attrs)) {
          missingAltCount++;
        }
        if (/loading=["']lazy["']/i.test(attrs)) {
          lazyLoadedCount++;
        }
      }
      const totalImages = imgMatches.length;
      const altCompliancePct = totalImages > 0 ? Math.round(((totalImages - missingAltCount) / totalImages) * 100) : 100;

      // -------------------------------------------------------------
      // Pillar E: Link Architecture & Tabnabbing Hygiene
      // -------------------------------------------------------------
      const linkMatches = [...html.matchAll(/<a[^>]*href=["']([^"']*)["']([^>]*)>/gi)];
      let internalLinksCount = 0;
      let externalLinksCount = 0;
      let unsafeBlankCount = 0;

      for (const link of linkMatches) {
        const href = link[1].trim();
        const restAttrs = link[2];
        if (href.startsWith('http://') || href.startsWith('https://')) {
          if (href.includes(parsedTarget.hostname)) {
            internalLinksCount++;
          } else {
            externalLinksCount++;
          }
        } else if (!href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
          internalLinksCount++;
        }

        if (/target=["']_blank["']/i.test(restAttrs) && !/rel=["'][^"']*(noopener|noreferrer)[^"']*["']/i.test(restAttrs)) {
          unsafeBlankCount++;
        }
      }

      // -------------------------------------------------------------
      // Pillar F: Structured Data (Schema.org)
      // -------------------------------------------------------------
      const schemaMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
      const schemasDetected = new Set();

      for (const m of schemaMatches) {
        try {
          const parsed = JSON.parse(m[1].trim());
          if (parsed['@type']) {
            if (Array.isArray(parsed['@type'])) parsed['@type'].forEach(t => schemasDetected.add(t));
            else schemasDetected.add(parsed['@type']);
          }
          if (Array.isArray(parsed['@graph'])) {
            for (const item of parsed['@graph']) {
              if (item['@type']) {
                if (Array.isArray(item['@type'])) item['@type'].forEach(t => schemasDetected.add(t));
                else schemasDetected.add(item['@type']);
              }
            }
          }
        } catch {}
      }
      const schemasList = Array.from(schemasDetected);
      const hasSchema = schemasList.length > 0;

      // -------------------------------------------------------------
      // Pillar G: Content Depth & Text-to-HTML Ratio
      // -------------------------------------------------------------
      const cleanText = html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const words = cleanText ? cleanText.split(/\s+/).filter(w => w.length > 1) : [];
      const wordCount = words.length;
      const readingTimeMin = Math.max(1, Math.round(wordCount / 200));
      const textToHtmlRatio = html.length > 0 ? Math.round((cleanText.length / html.length) * 100) : 0;
      const contentStatus = wordCount < 250 ? 'thin_content' : wordCount <= 1500 ? 'standard' : 'comprehensive';

      let contentScore = 0;
      if (h1Count === 1) contentScore += 25;
      else if (h1Count > 1) contentScore += 12;

      if (h2Matches.length >= 2) contentScore += 20;
      else if (h2Matches.length === 1) contentScore += 10;

      if (wordCount >= 300) contentScore += 25;
      else contentScore += 10;

      if (altCompliancePct >= 90) contentScore += 15;
      else contentScore += Math.round(altCompliancePct * 0.15);

      if (hasSchema) contentScore += 15;

      // -------------------------------------------------------------
      // Pillar H: Technology & CMS Identification
      // -------------------------------------------------------------
      const lowerHtml = html.toLowerCase();
      const techStack = [];
      if (lowerHtml.includes('wp-content') || lowerHtml.includes('wordpress')) techStack.push('WordPress');
      if (lowerHtml.includes('__next_data__') || lowerHtml.includes('/_next/')) techStack.push('Next.js');
      if (lowerHtml.includes('__nuxt') || lowerHtml.includes('/_nuxt/')) techStack.push('Nuxt');
      if (lowerHtml.includes('cdn.shopify.com') || lowerHtml.includes('shopify-section')) techStack.push('Shopify');
      if (lowerHtml.includes('w-webflow')) techStack.push('Webflow');
      if (lowerHtml.includes('squarespace.com')) techStack.push('Squarespace');
      if (lowerHtml.includes('react') || lowerHtml.includes('react-dom')) techStack.push('React');
      if (lowerHtml.includes('tailwind')) techStack.push('Tailwind CSS');
      if (techStack.length === 0) techStack.push('Custom / Static Web');

      // -------------------------------------------------------------
      // Pillar I: AI Search (GEO) & Bot Matrix
      // -------------------------------------------------------------
      const hasRobots = robotsRes && robotsRes.status === 200;
      let robotsTxtContent = hasRobots ? await robotsRes.text() : '';

      function isBotAllowed(botName) {
        if (!hasRobots) return true; // By default without robots.txt, crawlers are permitted
        const re = new RegExp(`User-agent:\\s*${botName}[\\s\\S]*?Disallow:\\s*\\/(\\n|$)`, 'i');
        return !re.test(robotsTxtContent);
      }

      const gptBotAllowed = isBotAllowed('GPTBot');
      const claudeBotAllowed = isBotAllowed('ClaudeBot');
      const perplexityAllowed = isBotAllowed('PerplexityBot');
      const ccBotAllowed = isBotAllowed('CCBot');
      const googleExtendedAllowed = isBotAllowed('Google-Extended');

      const hasLlms = llmsRes && llmsRes.status === 200;
      const hasSitemap = sitemapRes && (sitemapRes.status === 200 || sitemapRes.status === 304);

      let geoScore = 20;
      if (gptBotAllowed) geoScore += 20;
      if (claudeBotAllowed) geoScore += 20;
      if (perplexityAllowed) geoScore += 20;
      if (hasLlms) geoScore += 10;
      if (hasSitemap) geoScore += 10;

      // -------------------------------------------------------------
      // Technical Infrastructure Score
      // -------------------------------------------------------------
      let technicalScore = 0;
      if (statusCode === 200) technicalScore += 30;
      if (parsedTarget.protocol === 'https:') technicalScore += 30;
      if (responseTime < 300) technicalScore += 20;
      else if (responseTime < 800) technicalScore += 10;
      if (hasSitemap) technicalScore += 20;

      // Overall Composite Score (5 Weighted Pillars)
      const overall = Math.round(
        (technicalScore * 0.20) +
        (onpageScore * 0.25) +
        (contentScore * 0.25) +
        (geoScore * 0.15) +
        (securityScore * 0.15)
      );

      const grade = overall >= 90 ? 'A+' : overall >= 80 ? 'A' : overall >= 70 ? 'B' : overall >= 55 ? 'C' : overall >= 40 ? 'D' : 'F';

      // -------------------------------------------------------------
      // Action Items Generation (Prioritized)
      // -------------------------------------------------------------
      const actionItems = [];
      if (!security.csp) {
        actionItems.push({ severity: 'CRITICAL', category: 'Security', issue: 'Missing Content-Security-Policy (CSP)', fix: 'Add a robust CSP header to block cross-site scripting (XSS) and code injection.' });
      }
      if (!security.hsts && parsedTarget.protocol === 'https:') {
        actionItems.push({ severity: 'CRITICAL', category: 'Security', issue: 'Missing HSTS Header', fix: 'Enforce Strict-Transport-Security (max-age=31536000; includeSubDomains; preload).' });
      }
      if (h1Count === 0) {
        actionItems.push({ severity: 'CRITICAL', category: 'Content', issue: 'Missing <h1> Primary Heading', fix: 'Add exactly one descriptive <h1> tag matching user search intent.' });
      } else if (h1Count > 1) {
        actionItems.push({ severity: 'WARNING', category: 'Content', issue: `Multiple <h1> Headings Detected (${h1Count} found)`, fix: 'Consolidate multiple <h1> elements into a single main heading, using <h2> for sections.' });
      }
      if (missingAltCount > 0) {
        actionItems.push({ severity: 'WARNING', category: 'Images', issue: `${missingAltCount} Images Missing Descriptive Alt Attributes`, fix: 'Provide informative, keyword-relevant alt attributes on all informative images for accessibility and image indexing.' });
      }
      if (unsafeBlankCount > 0) {
        actionItems.push({ severity: 'WARNING', category: 'Links', issue: `${unsafeBlankCount} External Links with target="_blank" Missing rel="noopener"`, fix: 'Add rel="noopener noreferrer" to external links to prevent reverse tabnabbing and window hijacking.' });
      }
      if (!hasSchema) {
        actionItems.push({ severity: 'WARNING', category: 'Schema', issue: 'No Schema.org JSON-LD Structured Data Detected', fix: 'Deploy Organization, WebSite, or Article schema in JSON-LD to unlock rich snippets in Google and AI engines.' });
      }
      if (descriptionLength < 80 || descriptionLength > 165) {
        actionItems.push({ severity: 'WARNING', category: 'Meta', issue: `Meta Description Length Sub-optimal (${descriptionLength} chars)`, fix: 'Adjust meta description to standard 120-160 characters for maximum search CTR.' });
      }
      if (!hasLlms) {
        actionItems.push({ severity: 'INFO', category: 'GEO', issue: 'Standard /llms.txt Discovery File Not Found', fix: 'Publish an /llms.txt file to guide AI crawlers (Perplexity, SearchGPT, Claude) on your core documentation and products.' });
      }
      if (!hasSitemap) {
        actionItems.push({ severity: 'INFO', category: 'Crawling', issue: 'Sitemap /sitemap.xml Not Discovered at Root', fix: 'Ensure /sitemap.xml is published and declared inside robots.txt.' });
      }

      // -------------------------------------------------------------
      // Final Comprehensive Payload
      // -------------------------------------------------------------
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
          is_https: parsedTarget.protocol === 'https:',
          html_size_kb: htmlSizeKb,
          content_encoding: headers['content-encoding'] || 'identity'
        },
        scores: {
          overall: overall,
          grade: grade,
          technical: technicalScore,
          onpage: onpageScore,
          content_structure: contentScore,
          ai_search_geo: geoScore,
          security: securityScore
        },
        metadata: {
          title: title,
          title_length: titleLength,
          description: description,
          description_length: descriptionLength,
          canonical: canonical,
          is_self_canonical: isSelfCanonical,
          robots_meta: robotsMeta,
          has_viewport: hasViewport,
          charset: charset,
          language: language,
          social_tags: socialTags
        },
        headings: {
          h1_count: h1Count,
          h1_texts: h1Matches.slice(0, 3),
          h2_count: h2Matches.length,
          h3_count: h3Matches.length,
          status: headingStatus
        },
        images: {
          total: totalImages,
          missing_alt: missingAltCount,
          has_lazy_loading: lazyLoadedCount,
          alt_compliance_pct: altCompliancePct
        },
        links: {
          total: linkMatches.length,
          internal: internalLinksCount,
          external: externalLinksCount,
          unsafe_blank_targets: unsafeBlankCount
        },
        schema: {
          has_schema: hasSchema,
          schemas_detected: schemasList,
          total_schemas: schemasList.length
        },
        content: {
          word_count: wordCount,
          reading_time_minutes: readingTimeMin,
          text_to_html_ratio_pct: textToHtmlRatio,
          status: contentStatus
        },
        technology: {
          cms_or_framework: techStack,
          server_header: headers['server'] || 'Guarded'
        },
        ai_search: {
          has_robots_txt: hasRobots,
          gptbot_allowed: gptBotAllowed,
          claudebot_allowed: claudeBotAllowed,
          perplexity_allowed: perplexityAllowed,
          ccbot_allowed: ccBotAllowed,
          google_extended_allowed: googleExtendedAllowed,
          has_llms_txt: hasLlms,
          has_sitemap: hasSitemap,
          sitemap_url: `${origin}/sitemap.xml`
        },
        security_headers: security,
        action_items: actionItems
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

  // 3. Proxy Frontend Web Application from GitHub Pages
  try {
    const GITHUB_PAGES_ORIGIN = 'https://dalroot.github.io/agentic-seo';
    let targetPath = url.pathname;
    if (targetPath === '/' || targetPath === '') {
      targetPath = '/index.html';
    }
    const upstreamUrl = `${GITHUB_PAGES_ORIGIN}${targetPath}`;
    const upstreamRes = await fetch(upstreamUrl, {
      headers: {
        'User-Agent': request.headers.get('User-Agent') || 'Mozilla/5.0 AgenticSEO-Edge-Worker',
        'Accept': request.headers.get('Accept') || '*/*'
      }
    });

    const responseHeaders = new Headers(upstreamRes.headers);
    for (const [k, v] of Object.entries(corsHeaders)) {
      responseHeaders.set(k, v);
    }
    // Ensure fresh cache on web updates
    responseHeaders.set('Cache-Control', 'public, max-age=60');
    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      headers: responseHeaders
    });
  } catch (proxyErr) {
    return new Response('Agentic SEO Edge Gateway Error: ' + proxyErr.message, {
      status: 502,
      headers: corsHeaders
    });
  }
}
