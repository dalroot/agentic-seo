"""
Unit tests for Agentic SEO Architecture and Radical Simplicity CLI entrypoints.
"""

import json
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest
from agentic_seo.audit import (
    format_executive_summary,
    get_score_rating,
    normalize_url,
)
from agentic_seo.cli import build_parser, main
import generate_report

FIXTURES = Path(__file__).parent / "fixtures"


def load_report_data():
    return json.loads((FIXTURES / "report_data.json").read_text(encoding="utf-8"))


def test_normalize_url():
    assert normalize_url("example.com") == "https://example.com"
    assert normalize_url("http://example.com") == "http://example.com"
    assert normalize_url("  https://test.dev/path  ") == "https://test.dev/path"

    with pytest.raises(ValueError):
        normalize_url("")


def test_get_score_rating():
    rating, icon = get_score_rating(95)
    assert rating == "EXCELLENT" and icon == "🟢"

    rating, icon = get_score_rating(80)
    assert rating == "GOOD" and icon == "🟢"

    rating, icon = get_score_rating(65)
    assert rating == "NEEDS IMPROVEMENT" and icon == "🟡"

    rating, icon = get_score_rating(30)
    assert rating == "CRITICAL" and icon == "🔴"


def test_format_executive_summary():
    data = load_report_data()
    scores = generate_report.calculate_overall_score(data)
    payload = {
        "url": data["url"],
        "data": data,
        "scores": scores,
        "artifacts": {
            "JSON Results": "docs/reports/audit-results.json",
            "HTML Dashboard": "docs/reports/audit-report.html",
        },
    }

    summary = format_executive_summary(payload)
    assert "AGENTIC SEO — 360° EXECUTIVE AUDIT SUMMARY" in summary
    assert "Target URL:" in summary
    assert "Overall Score:" in summary
    assert "CATEGORY SCORECARD" in summary
    assert "TOP ACTION ITEMS & PRIORITIES" in summary
    assert "GENERATED AUDIT ARTIFACTS" in summary
    assert "docs/reports/audit-results.json" in summary


def test_cli_bare_url_rewrites_to_audit():
    with patch("agentic_seo.cli.handle_audit", return_value=0) as mock_audit:
        ret = main(["https://example.com"])
        assert ret == 0
        mock_audit.assert_called_once()
        args = mock_audit.call_args[0][0]
        assert args.command == "audit"
        assert args.url == "https://example.com"
        assert args.type == "full"


def test_cli_bare_domain_rewrites_to_audit():
    with patch("agentic_seo.cli.handle_audit", return_value=0) as mock_audit:
        ret = main(["example.com"])
        assert ret == 0
        mock_audit.assert_called_once()
        args = mock_audit.call_args[0][0]
        assert args.command == "audit"
        assert args.url == "example.com"


def test_cli_explicit_audit():
    with patch("agentic_seo.cli.handle_audit", return_value=0) as mock_audit:
        ret = main(["audit", "https://example.com", "--type", "technical"])
        assert ret == 0
        mock_audit.assert_called_once()
        args = mock_audit.call_args[0][0]
        assert args.command == "audit"
        assert args.url == "https://example.com"
        assert args.type == "technical"


def test_cli_empty_args_shows_help():
    with patch("argparse.ArgumentParser.print_help") as mock_help:
        ret = main([])
        assert ret == 0
        mock_help.assert_called_once()
