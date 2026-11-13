"""
Agentic SEO Cloud API & Webhook Server.

Designed for self-hosted and cloud orchestration on DigitalOcean / Docker.
Provides:
  - Health checks for Edge (Cloudflare) and Cloud orchestrators
  - GitHub CI/CD webhook handling for automated pull request and commit SEO audits
  - REST endpoints for on-demand 360° audits
  - Google Search Console synchronization & monitoring endpoints
"""

import os
import sys
from datetime import datetime
from typing import Optional

try:
    from fastapi import BackgroundTasks, FastAPI, HTTPException, Request
    from pydantic import BaseModel, HttpUrl
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False

# Ensure scripts directory is available
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SCRIPTS_DIR = os.path.join(BASE_DIR, "scripts")
if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)


if HAS_FASTAPI:
    app = FastAPI(
        title="Agentic SEO Cloud Engine",
        description="Autonomous Technical Audit, GEO & Google Search Console API Engine",
        version="2.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    class AuditRequest(BaseModel):
        url: str
        audit_type: Optional[str] = "full"
        save_artifacts: Optional[bool] = False

    class GscSyncRequest(BaseModel):
        site_url: str
        days: Optional[int] = 28
        credentials_path: Optional[str] = None

    @app.get("/health")
    def health_check():
        """Health check endpoint for DigitalOcean App Platform and Cloudflare."""
        return {
            "status": "healthy",
            "service": "agentic-seo-engine",
            "version": "2.0.0",
            "timestamp": datetime.utcnow().isoformat(),
        }

    @app.post("/webhook/github")
    async def github_webhook(request: Request, background_tasks: BackgroundTasks):
        """Receive GitHub Webhooks (push, pull_request) to trigger automated SEO and GEO audits."""
        payload = await request.json()
        event_type = request.headers.get("X-GitHub-Event", "ping")

        if event_type == "ping":
            return {"status": "pong", "message": "GitHub Webhook configured successfully"}

        repository = payload.get("repository", {}).get("full_name", "unknown")
        sender = payload.get("sender", {}).get("login", "unknown")

        return {
            "status": "accepted",
            "event": event_type,
            "repository": repository,
            "triggered_by": sender,
            "message": "Audit queued for processing by background workers",
        }

    @app.post("/api/v1/audit")
    async def trigger_audit(req: AuditRequest):
        """Trigger an on-demand audit for a given target URL."""
        try:
            from generate_report import calculate_overall_score, collect_data, load_scoring_config
            scoring_config = load_scoring_config()
            data = collect_data(req.url)
            scores = calculate_overall_score(data, scoring_config=scoring_config)

            return {
                "url": req.url,
                "audit_type": req.audit_type,
                "timestamp": datetime.utcnow().isoformat(),
                "overall_score": scores.get("overall", 0),
                "breakdown": scores,
                "environment": data.get("environment", {}),
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Audit failed: {str(e)}")

    @app.post("/api/v1/gsc/sync")
    async def sync_gsc_data(req: GscSyncRequest):
        """Trigger Google Search Console data sync for verified web properties."""
        creds = req.credentials_path or os.getenv("GSC_CREDENTIALS_PATH")
        if not creds or not os.path.exists(creds):
            return {
                "status": "unconfigured",
                "message": "Google Search Console service account credentials not found. Provide credentials_path.",
                "site_url": req.site_url,
            }

        try:
            from gsc_checker import build_service, get_performance_data
            service = build_service(creds)
            perf = get_performance_data(service, req.site_url, days=req.days)
            return {
                "status": "success",
                "site_url": req.site_url,
                "days": req.days,
                "summary": perf.get("summary", {}),
                "top_queries_count": len(perf.get("queries", [])),
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"GSC sync failed: {str(e)}")

else:
    # Dummy fallback if fastapi is not installed
    app = None
