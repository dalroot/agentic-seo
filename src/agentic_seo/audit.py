"""
Agentic SEO Core Audit Engine.

Encapsulates 360° technical, GEO, schema, and content diagnostics,
deterministic scoring, artifact generation, and instant executive summary rendering.
"""

import json
import os
import sys
from datetime import datetime
from urllib.parse import urlparse

# Ensure repository root and scripts directory are in sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SCRIPTS_DIR = os.path.join(BASE_DIR, "scripts")
if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from generate_report import (  # noqa: E402
    calculate_overall_score,
    collect_data,
    collect_report_findings,
    generate_html,
    load_scoring_config,
    render_action_plan,
    render_markdown_report,
    write_text_output,
)


def normalize_url(url: str) -> str:
    """Normalize input URL, ensuring proper protocol scheme and stripping whitespace."""
    url = (url or "").strip()
    if not url:
        raise ValueError("URL cannot be empty.")
    if not url.startswith(("http://", "https://")):
        url = f"https://{url}"
    return url


def get_score_rating(score: int) -> tuple[str, str]:
    """Return status label and indicator for a numeric score (0-100)."""
    if score >= 90:
        return "EXCELLENT", "🟢"
    if score >= 75:
        return "GOOD", "🟢"
    if score >= 50:
        return "NEEDS IMPROVEMENT", "🟡"
    return "CRITICAL", "🔴"


def format_executive_summary(payload: dict) -> str:
    """Generate a clean, high-impact terminal executive summary from audit results."""
    url = payload.get("url", "")
    data = payload.get("data", {})
    scores = payload.get("scores", {})
    artifacts = payload.get("artifacts", {})

    overall = scores.get("overall", 0)
    rating, indicator = get_score_rating(overall)
    env = data.get("environment", {})
    platform = env.get("primary", "Standard Web")
    confidence = env.get("confidence", "unknown")
    runtime = env.get("runtime", "")

    timestamp = data.get("timestamp") or datetime.now().isoformat()
    findings = collect_report_findings(data)

    categories = scores.get("categories", {})
    weights = scores.get("weights", {})

    category_labels = {
        "security": "Security Headers",
        "social": "Social Meta Tags",
        "robots": "Robots & AI Crawlers",
        "broken_links": "Link Health & Broken Links",
        "internal_links": "Internal Linking Structure",
        "redirects": "Redirect Health",
        "llms_txt": "AI Search Readiness (llms.txt)",
        "pagespeed": "PageSpeed & Core Web Vitals",
        "onpage": "On-Page SEO & Metadata",
        "readability": "Readability & Content Flow",
        "entity": "Entity SEO & Knowledge Graph",
        "link_profile": "Link Profile & Depth",
        "hreflang": "Hreflang & Internationalization",
        "duplicate_content": "Content Uniqueness",
    }

    lines = []
    border = "=" * 78
    divider = "-" * 78

    lines.append(border)
    lines.append("⚡ AGENTIC SEO — 360° EXECUTIVE AUDIT SUMMARY")
    lines.append(border)
    lines.append(f"🎯 Target URL:   {url}")
    lines.append(f"📅 Timestamp:    {timestamp}")
    lines.append(f"🛠️  Platform:     {platform} ({runtime}, Confidence: {confidence.capitalize()})")
    lines.append(f"⭐ Overall Score: {overall}/100 {indicator} [{rating}]")
    lines.append(divider)
    lines.append("📊 CATEGORY SCORECARD")
    lines.append(f"  {'Category':<32} {'Weight':<8} {'Score':<10} {'Status'}")
    lines.append(f"  {'-'*30:<32} {'-'*6:<8} {'-'*8:<10} {'-'*15}")

    for cat_key, weight in weights.items():
        cat_name = category_labels.get(cat_key, cat_key.replace("_", " ").title())
        score_val = categories.get(cat_key, 0)
        cat_rating, cat_icon = get_score_rating(score_val)
        lines.append(f"  {cat_name:<32} {f'{weight}%':<8} {f'{score_val}/100':<10} {cat_icon} {cat_rating}")

    lines.append(divider)
    lines.append("🚨 TOP ACTION ITEMS & PRIORITIES")

    # Filter critical & high priority findings
    top_findings = [f for f in findings if f.get("severity") in ("Critical", "Warning")][:6]
    if not top_findings:
        top_findings = findings[:4]

    if top_findings:
        for idx, item in enumerate(top_findings, 1):
            sev = item.get("severity", "Info").upper()
            area = item.get("area", "General")
            finding_text = item.get("finding", "")
            fix_text = item.get("fix", "")
            icon = "🔴" if sev == "CRITICAL" else "🟡" if sev in ("WARNING", "HIGH") else "ℹ️"
            lines.append(f"  {idx}. {icon} [{sev}] ({area}) {finding_text}")
            if fix_text:
                lines.append(f"     👉 Fix: {fix_text}")
    else:
        lines.append("  🎉 Outstanding! No critical or high severity SEO issues detected.")

    if artifacts:
        lines.append(divider)
        lines.append("📁 GENERATED AUDIT ARTIFACTS")
        for label, path in artifacts.items():
            lines.append(f"  • {label:<20} {path}")

    lines.append(border)
    return "\n".join(lines)


def run_audit(
    url: str,
    output_dir: str = None,
    html_name: str = None,
    write_artifacts: bool = True,
) -> dict:
    """
    Execute complete 360° audit deterministically, write artifacts, and return payload.
    """
    clean_url = normalize_url(url)
    scoring_config = load_scoring_config()
    data = collect_data(clean_url)
    scores = calculate_overall_score(data, scoring_config=scoring_config)

    payload = {
        "url": clean_url,
        "scores": scores,
        "data": data,
        "artifacts": {},
    }

    if write_artifacts:
        output_dir = output_dir or os.path.join(BASE_DIR, "docs", "reports")
        os.makedirs(output_dir, exist_ok=True)

        # JSON results
        json_path = os.path.join(output_dir, "audit-results.json")
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2)
            f.write("\n")
        payload["artifacts"]["JSON Results"] = os.path.abspath(json_path)

        # HTML Report
        domain_slug = urlparse(clean_url).netloc.replace(".", "_")
        html_file = html_name or f"seo-report-{domain_slug}.html"
        html_path = os.path.join(output_dir, html_file)
        write_text_output(html_path, generate_html(data, scores))
        payload["artifacts"]["HTML Dashboard"] = os.path.abspath(html_path)

        # Markdown Report
        md_path = os.path.join(output_dir, "FULL-AUDIT-REPORT.md")
        write_text_output(md_path, render_markdown_report(data, scores, scoring_config))
        payload["artifacts"]["Markdown Report"] = os.path.abspath(md_path)

        # Action Plan
        plan_path = os.path.join(output_dir, "ACTION-PLAN.md")
        write_text_output(plan_path, render_action_plan(data, scores))
        payload["artifacts"]["Action Plan"] = os.path.abspath(plan_path)

    payload["summary_text"] = format_executive_summary(payload)
    return payload
