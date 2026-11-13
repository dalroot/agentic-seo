# Full Audit Report

- URL: `https://example.com`
- Generated: `2026-11-13T23:52:46.336980`
- Overall score: `53/100`
- Score confidence: `Medium`
- Scoring version: `1`

## Score Card

| Category | Weight | Score |
| --- | ---: | ---: |
| Security Headers | 8 | 25 |
| Social Meta | 5 | 0 |
| Robots and Crawlers | 8 | 20 |
| Broken Links | 10 | 100 |
| Internal Links | 8 | 80 |
| Redirects | 3 | 100 |
| AI Search | 5 | 0 |
| Performance and Core Web Vitals | 13 | 0 |
| On-Page SEO | 10 | 65 |
| Readability | 8 | 69 |
| Entity SEO | 5 | 0 |
| Link Profile | 7 | 52 |
| Hreflang | 5 | 0 |
| Content Uniqueness | 5 | 100 |

## Findings

| Severity | Area | Finding | Evidence | Fix |
| --- | --- | --- | --- | --- |
| Critical | Schema | No Organization/Person entity found in JSON-LD. |  | Add Organization or Person schema with name, url, logo, and sameAs properties. |
| Critical | environment | Missing H1 on page | No primary content heading was detected, which weakens topical clarity. | Ensure each page has exactly one descriptive H1 aligned to intent. |
| Critical | environment | 6 security headers missing | Missing headers reduce trust and can expose the site to browser/security risks. | Set missing security headers at web server or CDN layer. |
| Critical | link_profile | Average internal links per page is only 0.0 (target: 5-10). |  | Increase internal linking by adding contextual links within content. |
| Critical | security | 🔴 6 security headers missing — poor security posture |  |  |
| Critical | social | 🔴 Missing required: og:title |  |  |
| Critical | social | 🔴 Missing required: og:description |  |  |
| Critical | social | 🔴 Missing required: og:image |  |  |
| Critical | social | 🔴 Missing required: og:url |  |  |
| Critical | social | 🔴 Missing required: og:type |  |  |
| Warning | broken_links | ⚠️ No links found on page |  |  |
| Warning | environment | Meta description is missing or out of range | This can reduce SERP CTR and snippet quality. | Update page templates to set complete title/meta/OG/Twitter tags. |
| Warning | environment | Title tag needs optimization | Title length/content is likely suboptimal for rankings and click-through. | Update page templates to set complete title/meta/OG/Twitter tags. |
| Warning | environment | No llms.txt found | AI crawlers and assistants have no curated machine-readable guidance for key pages. | Add `/llms.txt` at site root with concise site description and key URLs. |
| Warning | environment | Social meta tags are incomplete | Missing OG/Twitter tags weakens social previews and share quality. | Update page templates to set complete title/meta/OG/Twitter tags. |
| Warning | internal_links | ⚠️ 1 page(s) have fewer than 3 internal links |  |  |
| Warning | link_profile | 1 page(s) with no outbound internal links (dead ends). |  | Add contextual internal links to related content from these pages. |
| Warning | readability | ⚠️ Thin content (25 words) — may rank poorly |  |  |
| Warning | robots | ⚠️ 11 AI crawlers not explicitly managed: GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended |  |  |
| Warning | robots | ⚠️ No Sitemap directive found in robots.txt |  |  |
| Warning | sameAs | Missing sameAs link to Wikipedia (Primary KG signal). |  | Add the existing official 'wikipedia.org' URL to sameAs; do not create this profile solely for SEO. |
| Warning | sameAs | Missing sameAs link to Wikidata (Primary KG signal). |  | Add the existing official 'wikidata.org' URL to sameAs; do not create this profile solely for SEO. |
| Warning | social | ⚠️ Missing: twitter:card |  |  |
| Info | environment | Performance measurement incomplete | PageSpeed API returned an error, so CWV recommendations are less reliable. | Set `PAGESPEED_API_KEY` in your environment or `.env` file (see `.env.example`), then rerun. The CLI also accepts `--api-key`. Prioritize LCP/INP/CLS fixes from that output. |
| info | pagespeed | pagespeed measurement incomplete | Rate limited by Google API. Wait a few minutes or add an API key. | Rerun this check after resolving the environment/API/network limitation. |
| Info | readability | ℹ️ Content readability is moderate (Flesch: 41.9) — suitable for educated audience |  |  |
| Info | sameAs | Missing sameAs link to LinkedIn (Strong KG signal). |  | Add 'linkedin.com' profile URL to sameAs array in your entity schema. |
| Info | sameAs | Missing sameAs link to Twitter/X (Strong KG signal). |  | Add 'x.com' profile URL to sameAs array in your entity schema. |

## Measurement Notes

1 checks returned errors or incomplete measurements; treat affected scores as directional.
