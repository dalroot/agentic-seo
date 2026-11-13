<div align="center">

# 🤖 Agentic SEO

### Autonomous AI SEO & GEO Engine — Run 1 Command, Optimize Everything.

**[🇺🇸 English](README.md) • [🇮🇷 فارسی (Persian)](README.fa.md)**

[![Release](https://img.shields.io/github/v/release/dalroot/agentic-seo?style=for-the-badge&color=blue)](https://github.com/dalroot/agentic-seo/releases)
[![PyPI version](https://img.shields.io/badge/PyPI-v2.0.0-informational?style=for-the-badge&logo=pypi)](https://pypi.org/project/agentic-seo/)
[![Live Demo](https://img.shields.io/badge/Live_Dashboard-Live-success?style=for-the-badge&logo=cloudflare)](https://dalroot.github.io/agentic-seo)
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/dalroot/agentic-seo)
[![Deploy to DigitalOcean](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/dalroot/agentic-seo/tree/master)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<br/>

**Agentic SEO** transforms how engineering and growth teams optimize websites for search engines and AI models.
By replacing error-prone AI hallucinations with **100% deterministic code audits**, it diagnoses technical SEO, evaluates Core Web Vitals, validates Schema.org markup, optimizes for AI Search (GEO/AEO), and continuously synchronizes with Google Search Console.

</div>

---

## ⚡ Quick Start: The One-Command Experience

Run a full 360° deterministic audit on any live URL with **zero configuration**:

```bash
# Instant execution with npx (No installation required)
npx agentic-seo https://example.com

# Or install via pip / uv
pip install agentic-seo
agentic-seo https://example.com
```

### 📋 Instant Production-Grade Deliverables

Every audit immediately generates an executive terminal summary and 4 production-grade deliverables:

| Deliverable | Format | Purpose |
| :--- | :--- | :--- |
| **Executive Dashboard** | `audit-report.html` | Interactive browser scorecard with Lighthouse metrics, status codes, and issue breakdowns |
| **Prioritized Action Plan** | `ACTION-PLAN.md` | Concrete, engineering-ready remediation checklist ordered by Impact vs. Effort |
| **Comprehensive Audit Report** | `FULL-AUDIT-REPORT.md` | In-depth technical breakdown with code-level evidence and reproduction steps |
| **Machine-Readable Diagnostics** | `audit-results.json` | Structured JSON data for CI/CD assertions, webhooks, and automation pipelines |

---

## 💎 Why Agentic SEO? (Core Pillars)

```text
       ┌─────────────────────────────────────────────────────────────┐
       │                   Agentic SEO Engine                        │
       └──────┬──────────────┬──────────────┬──────────────┬─────────┘
              │              │              │              │
              ▼              ▼              ▼              ▼
     [ 360° Technical ]   [ GEO & AI ]   [ Core Web Vitals ] [ GitOps & GSC ]
     - Crawl & Status     - LLMs.txt     - LCP / CLS / INP   - GSC Sync
     - Canonical Graph    - Bot Directives - JSON-LD Schema  - PR Auto-Fixes
     - Broken Links       - Citations    - Mobile Rendering  - Webhook Alerts
```

### 1. 🔍 100% Deterministic Technical SEO
No LLM hallucinations or guesswork. Agentic SEO runs direct HTTP probes to inspect status codes, redirect loops, canonical graph integrity, XML sitemaps, `robots.txt`, and security headers (CSP, HSTS, X-Content-Type-Options).

### 2. 🤖 Generative Engine Optimization (GEO & AEO)
Ensure your site is discovered and cited by next-gen AI search engines (ChatGPT Search, Perplexity, Claude, and Google AI Overviews). Validates `llms.txt`, tests AI bot permissions, and audits structured answer blocks.

### 3. ⚡ Core Web Vitals & Validated Schema
Audits real Google user experience metrics: Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Interaction to Next Paint (INP). Validates Schema.org JSON-LD against Google Search Gallery requirements and prevents deprecated schemas.

### 4. 📈 Continuous GitOps & Search Console Synchronization
Deploy as a background daemon or CI/CD workflow. Sync Google Search Console impressions and CTR, detect sudden keyword drops, and trigger automated Pull Requests to remediate indexation errors.

---

## 🤖 Native AI IDE Support

Agentic SEO runs as a native skill across all modern AI coding assistants and IDEs:

| Platform | Native Path | Activation |
| :--- | :--- | :--- |
| **Antigravity** | `.agent/skills/seo/` | Automatic / Skill directory |
| **Cursor** | `.cursor/rules/seo.mdc` | MDC Rule + Sub-skills |
| **Claude Code** | `~/.claude/skills/seo/` | Skill directory |
| **Windsurf** | `.windsurf/rules/seo.md` | Windsurf Rule |
| **Codex CLI** | `~/.codex/skills/seo/` | Skill directory |
| **GitHub Copilot** | `.github/copilot-instructions.md` | Repository instructions |
| **Cline** | `.clinerules` | Project rules |

### One-Line AI IDE Installer:
```bash
# Installs automatically to all active AI editors in your environment:
curl -fsSL https://raw.githubusercontent.com/dalroot/agentic-seo/main/install.sh | bash -s -- --online
```

---

## ☁️ Enterprise Cloud & Edge Architecture

Deploy Agentic SEO as a 24/7 autonomous monitoring service:

- **Edge Layer (Cloudflare Pages & Edge Functions):** Serves the global, blazing-fast web dashboard and ingests GitHub webhooks at sub-millisecond edge latency (`wrangler.toml`).
- **Compute Layer (DigitalOcean / Docker):** Executes deep headless browser rendering (Playwright), continuous background crawls, and Google Search Console synchronization (`docker-compose.yml`, `.do/app.yaml`).

```bash
# Self-host via Docker Compose in seconds
docker compose up -d
```

---

## 🛠️ Advanced CLI Reference & Custom Workflows

<details>
<summary><b>▶ Targeted CLI Subcommands & Flags</b></summary>

While `agentic-seo <url>` defaults to a comprehensive 360° audit, you can target specific sub-systems:

```bash
# 1. Target specific diagnostic categories
agentic-seo audit https://example.com --type technical   # Robots, Security, Broken Links, Redirects
agentic-seo audit https://example.com --type geo         # LLMs.txt, AI bot policies, Answer blocks
agentic-seo audit https://example.com --type schema      # JSON-LD & Structured Data validation
agentic-seo audit https://example.com --type speed       # Core Web Vitals & PageSpeed Insights

# 2. Google Search Console Analytics & Indexing Sync
agentic-seo gsc https://example.com --days 28 --credentials service_account.json

# 3. GitHub Repository Discoverability & SEO
agentic-seo repo dalroot/agentic-seo

# 4. Launch Self-Hosted REST API & Webhook Daemon
agentic-seo serve --port 8000
```
</details>

<details>
<summary><b>▶ Copy-and-Paste Ready AI Agent Prompts</b></summary>

Paste these tested prompts into Antigravity, Cursor, or Claude Code:

- **360° Master Audit:**
  > "Run a comprehensive 360-degree SEO audit on https://example.com. Check technical crawlability, Core Web Vitals, Schema.org JSON-LD, and GEO/AEO readiness. Generate audit-report.html, FULL-AUDIT-REPORT.md, and ACTION-PLAN.md."
- **E-Commerce Optimization:**
  > "Audit this product page https://example.com/product for e-commerce SEO: validate Product, AggregateOffer, and Review schemas, inspect image CLS, and optimize metadata CTR."
- **Generative Engine Optimization (GEO):**
  > "Evaluate https://example.com for GEO readiness: audit AI bot permissions in robots.txt, validate llms.txt, and optimize core content blocks for citation in ChatGPT Search and Perplexity."
</details>

<details>
<summary><b>▶ Enforced SEO Standards & Anti-Pattern Prevention</b></summary>

Agentic SEO enforces modern, strict search engine specifications:
- **INP replaces FID:** Evaluates Interaction to Next Paint as the sole responsiveness metric (FID deprecated).
- **Modern Schema Standards:** Exclusively produces JSON-LD; flags deprecated Microdata, RDFa, HowTo, and restricted FAQ schemas.
- **Mobile-First Indexing:** Audits against Google's 100% mobile crawler specifications.
- **Canonical & Redirect Integrity:** Halts crawler traps, circular redirects, and canonical self-referential conflicts.
</details>

<details>
<summary><b>▶ Complete Architecture & Sub-Skill Inventory</b></summary>

### 📦 Ecosystem Inventory
- Specialized sub-skills: `16`
- Specialist agents: `10`
- Scripts in `scripts/`: `89` (`88` Python + `1` shell validation helper)

### 🧩 Sub-Skills
| Sub-Skill | Purpose |
| :--- | :--- |
| [seo audit](resources/skills/seo-audit.md) | Full website audit with evidence-backed scoring |
| [seo technical](resources/skills/seo-technical.md) | Crawlability, indexability, security, Core Web Vitals, AI crawlers |
| [seo geo](resources/skills/seo-geo.md) | Generative Engine Optimization — AI Overviews, ChatGPT, Perplexity |
| [seo schema](resources/skills/seo-schema.md) | Schema.org detection, validation & JSON-LD generation |
| [seo content](resources/skills/seo-content.md) | Content quality & E-E-A-T assessment |
| [seo article](resources/skills/seo-article.md) | Article data extraction & LLM-driven content optimization |
| [seo aeo](resources/skills/seo-aeo.md) | Answer Engine Optimization — Featured Snippets, PAA, Knowledge Panel |
| [seo page](resources/skills/seo-page.md) | Deep single-page analysis |
| [seo sitemap](resources/skills/seo-sitemap.md) | XML sitemap analysis & generation |
| [seo images](resources/skills/seo-images.md) | Image optimization audit (alt text, formats, lazy loading, CLS) |
| [seo links](resources/skills/seo-links.md) | Link profile analysis — internal links, backlinks, anchor text |
| [seo programmatic](resources/skills/seo-programmatic.md) | Programmatic SEO safeguards & quality gates |
| [seo competitor-pages](resources/skills/seo-competitor-pages.md) | Comparison & alternatives page generation |
| [seo hreflang](resources/skills/seo-hreflang.md) | International SEO / hreflang validation |
| [seo plan](resources/skills/seo-plan.md) | Strategic SEO planning with topical clusters & industry templates |
| [seo github](resources/skills/seo-github.md) | GitHub repository SEO, topics, community health, and traffic archival |

For the complete 89-script inventory and technical documentation:
- **[Agentic SEO Wiki & Script Documentation](https://github.com/dalroot/agentic-seo/wiki)**
- **[Live Interactive Dashboard](https://dalroot.github.io/agentic-seo/)**
</details>

---

## 📄 License & Community

Released under the [MIT License](LICENSE). Contributions, feature requests, and bug reports are warmly welcome via [GitHub Issues](https://github.com/dalroot/agentic-seo/issues) and [Pull Requests](https://github.com/dalroot/agentic-seo/pulls).
