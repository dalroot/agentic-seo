#!/usr/bin/env python3
"""
Agentic SEO Unified CLI.

Provides single-entrypoint commands for:
  - audit: Run granular or 360° technical, GEO, schema, and speed audits
  - gsc: Query and sync Google Search Console analytics and indexing data
  - repo: Audit GitHub repositories for SEO and developer discoverability
  - serve: Launch the cloud REST API and webhook server
  - search: Query built-in SEO frameworks, rules, and anti-patterns
"""

import argparse
import os
import subprocess
import sys

# Ensure repository root and scripts directory are in sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SCRIPTS_DIR = os.path.join(BASE_DIR, "scripts")
if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)


def run_script(script_name: str, args: list, cwd: str = BASE_DIR) -> int:
    script_path = os.path.join(SCRIPTS_DIR, script_name)
    if not os.path.isfile(script_path):
        print(f"❌ Error: Script {script_name} not found at {script_path}", file=sys.stderr)
        return 1
    cmd = [sys.executable, script_path] + args
    res = subprocess.run(cmd, cwd=cwd)
    return res.returncode


def handle_audit(args):
    url = args.url
    audit_type = args.type.lower()
    output_dir = args.output or os.path.join(BASE_DIR, "docs", "reports")
    os.makedirs(output_dir, exist_ok=True)

    print(f"🚀 Starting Agentic SEO Audit: {url} [Mode: {audit_type.upper()}]")

    if audit_type == "full":
        runner_args = [
            url,
            "--json", os.path.join(output_dir, "audit-results.json"),
            "--markdown", os.path.join(output_dir, "FULL-AUDIT-REPORT.md"),
            "--action-plan", os.path.join(output_dir, "ACTION-PLAN.md"),
        ]
        if args.html:
            runner_args.extend(["--html", os.path.join(output_dir, args.html)])
        return run_script("audit_runner.py", runner_args)

    elif audit_type == "technical":
        print("  ▶ Running technical diagnostics (Robots, Security, Redirects, Canonical, Broken Links)...")
        run_script("robots_checker.py", [url])
        run_script("security_headers.py", [url])
        run_script("redirect_checker.py", [url])
        run_script("canonical_checker.py", [url])
        return run_script("broken_links.py", [url, "--workers", "5", "--timeout", "8"])

    elif audit_type in ("geo", "ai"):
        print("  ▶ Running Generative Engine Optimization (GEO) & AI bot diagnostics...")
        run_script("llms_txt_checker.py", [url])
        run_script("ai_crawler_policy_matrix.py", [url])
        return run_script("answer_block_scanner.py", [url])

    elif audit_type == "schema":
        print("  ▶ Validating Schema markup & Structured Data...")
        return run_script("validate_schema.py", [url])

    elif audit_type in ("speed", "perf"):
        print("  ▶ Running PageSpeed & Core Web Vitals checks...")
        run_script("pagespeed.py", [url, "--strategy", "mobile"])
        return run_script("critical_request_chain.py", [url])

    else:
        print(f"❌ Unknown audit type: {audit_type}. Available: full, technical, geo, schema, speed", file=sys.stderr)
        return 1


def handle_gsc(args):
    site_url = args.site
    credentials = args.credentials or os.getenv("GSC_CREDENTIALS_PATH")
    if not credentials or not os.path.isfile(credentials):
        print("⚠️ Warning: No valid GSC credentials file provided.", file=sys.stderr)
        print("Please supply --credentials path/to/creds.json or set GSC_CREDENTIALS_PATH.", file=sys.stderr)
        return 1

    gsc_args = [site_url, "--credentials", credentials, "--days", str(args.days)]
    if args.json:
        gsc_args.append("--json")
    if args.query:
        gsc_args.extend(["--query", args.query])

    print(f"📊 Connecting to Google Search Console for {site_url} (past {args.days} days)...")
    return run_script("gsc_checker.py", gsc_args)


def handle_repo(args):
    repo = args.repo
    print(f"🔍 Running GitHub Repository SEO & Discoverability Audit for: {repo}")
    lint_ret = run_script("github_readme_lint.py", ["README.md"])
    topics_ret = run_script("repo_topic_suggester.py", ["."])
    return lint_ret or topics_ret


def handle_serve(args):
    print(f"🌐 Launching Agentic SEO Cloud API Server on {args.host}:{args.port}...")
    try:
        import uvicorn
    except ImportError:
        print("❌ uvicorn is not installed. Install with: pip install uvicorn fastapi", file=sys.stderr)
        return 1

    server_module = "agentic_seo.server:app"
    uvicorn.run(server_module, host=args.host, port=args.port, reload=args.reload)
    return 0


def handle_search(args):
    from agentic_seo.scripts.search import search_anti_patterns, search_frameworks, search_rules

    if args.anti_patterns:
        print("Anti-patterns:", search_anti_patterns())
    elif args.framework:
        print(f"Framework [{args.framework}]:", search_frameworks(args.framework))
    elif args.industry:
        print(f"Industry [{args.industry}]:", search_rules(args.industry))
    else:
        print("All frameworks:", search_frameworks())
    return 0


def main():
    parser = argparse.ArgumentParser(
        prog="agentic-seo",
        description="Agentic SEO — Autonomous Technical Audit, GEO & Search Platform",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Subcommand: audit
    p_audit = subparsers.add_parser("audit", help="Run comprehensive or targeted SEO audits")
    p_audit.add_argument("url", help="Target URL to audit")
    p_audit.add_argument(
        "--type",
        choices=["full", "technical", "geo", "schema", "speed"],
        default="full",
        help="Audit category (default: full 360°)",
    )
    p_audit.add_argument("--output", help="Directory to save audit artifacts (default: docs/reports)")
    p_audit.add_argument("--html", help="Custom HTML report filename")
    p_audit.set_defaults(func=handle_audit)

    # Subcommand: gsc
    p_gsc = subparsers.add_parser("gsc", help="Google Search Console analytics and indexing inspect")
    p_gsc.add_argument("site", help="Verified GSC site URL (e.g., https://example.com/)")
    p_gsc.add_argument("--credentials", help="Path to Google Service Account JSON credentials")
    p_gsc.add_argument("--days", type=int, default=28, help="Trailing days to analyze (default: 28)")
    p_gsc.add_argument("--query", help="Filter by specific search query")
    p_gsc.add_argument("--json", action="store_true", help="Output results in JSON format")
    p_gsc.set_defaults(func=handle_gsc)

    # Subcommand: repo
    p_repo = subparsers.add_parser("repo", help="Audit GitHub repository for SEO, discoverability, and README health")
    p_repo.add_argument("repo", default=".", nargs="?", help="GitHub repository name or local path")
    p_repo.set_defaults(func=handle_repo)

    # Subcommand: serve
    p_serve = subparsers.add_parser("serve", help="Start cloud REST API and webhook server")
    p_serve.add_argument("--host", default="0.0.0.0", help="Host address (default: 0.0.0.0)")
    p_serve.add_argument("--port", type=int, default=8000, help="Port to listen on (default: 8000)")
    p_serve.add_argument("--reload", action="store_true", help="Enable live auto-reload for development")
    p_serve.set_defaults(func=handle_serve)

    # Subcommand: search
    p_search = subparsers.add_parser("search", help="Search built-in rules, frameworks, and anti-patterns")
    p_search.add_argument("--industry", help="Filter rules by industry")
    p_search.add_argument("--framework", help="Filter by framework")
    p_search.add_argument("--anti-patterns", action="store_true", help="List anti-patterns")
    p_search.set_defaults(func=handle_search)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main() or 0)
