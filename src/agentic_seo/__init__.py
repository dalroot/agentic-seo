"""
Agentic SEO - The Autonomous Technical Audit, GEO & Search Platform.
"""

from agentic_seo.audit import (
    format_executive_summary,
    normalize_url,
    run_audit,
)

__version__ = "2.0.0"
__all__ = [
    "run_audit",
    "normalize_url",
    "format_executive_summary",
    "__version__",
]
