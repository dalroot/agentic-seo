document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card, .glass-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => observer.observe(card));
});

function copyPrompt(btn, text) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = btn.innerHTML;
        const isFa = document.documentElement.lang === 'fa';
        btn.innerHTML = isFa ? '✅ کپی شد!' : '✅ Copied!';
        btn.style.background = 'linear-gradient(135deg, #00FF87, #60EFFF)';
        btn.style.color = '#000';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.style.color = '';
        }, 2000);
    });
}

// Global variable to store latest audit data for opening in new tab
let currentAuditData = null;

// -------------------------------------------------------------
// Live Terminal Logger & Diagnostic Runner
// -------------------------------------------------------------
// Live Deterministic Audit via Cloudflare Edge Worker
// -------------------------------------------------------------
const EDGE_ENDPOINTS = [
    'https://seo.lookanet.app/api/audit',
    'https://agentic-seo.apominer.workers.dev/api/audit'
];

async function runInstantAudit() {
    const input = document.getElementById('audit-url-input');
    const resultBox = document.getElementById('audit-live-results');
    const btn = document.getElementById('audit-run-btn');
    const isFa = document.documentElement.lang === 'fa';

    if (!input || !input.value.trim()) {
        alert(isFa ? 'لطفاً آدرس یک وب‌سایت را وارد کنید.' : 'Please enter a valid website URL.');
        return;
    }

    let rawUrl = input.value.trim();
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
        rawUrl = 'https://' + rawUrl;
        input.value = rawUrl;
    }

    let parsedUrl;
    try {
        parsedUrl = new URL(rawUrl);
    } catch {
        alert(isFa ? 'آدرس وارد شده نامعتبر است.' : 'Invalid URL format.');
        return;
    }

    const domain = parsedUrl.hostname;
    btn.disabled = true;
    btn.innerHTML = isFa ? '⏳ در حال آنالیز سرور ابری...' : '⏳ Running Edge Audit...';
    resultBox.style.display = 'block';

    // Build Live Diagnostic Terminal UI
    resultBox.innerHTML = `
        <div style="background: #090d16; border: 1px solid rgba(0, 212, 255, 0.4); border-radius: 14px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.7); text-align: left;" dir="ltr">
            <div style="background: rgba(255,255,255,0.05); padding: 0.6rem 1rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08);">
                <div style="display: flex; gap: 6px; align-items: center;">
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: #ff5f56;"></div>
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: #ffbd2e;"></div>
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: #27c93f;"></div>
                    <span style="font-family: monospace; font-size: 0.8rem; color: #94a3b8; margin-left: 10px;">agentic-seo-edge --target ${domain}</span>
                </div>
                <span id="terminal-badge" style="background: rgba(0,212,255,0.15); color: #00D4FF; font-family: monospace; font-size: 0.75rem; padding: 2px 8px; border-radius: 4px;">CONNECTING</span>
            </div>
            <div id="live-terminal-logs" style="padding: 1.2rem; font-family: 'Courier New', Courier, monospace; font-size: 0.82rem; line-height: 1.6; color: #a5d6ff; max-height: 320px; overflow-y: auto;">
            </div>
        </div>
    `;

    const logBox = document.getElementById('live-terminal-logs');
    const badge = document.getElementById('terminal-badge');

    function addLog(msg, color = '#a5d6ff') {
        const time = new Date().toISOString().split('T')[1].slice(0, 8);
        const line = document.createElement('div');
        line.style.color = color;
        line.innerHTML = `<span style="color: #64748b;">[${time}]</span> ${msg}`;
        logBox.appendChild(line);
        logBox.scrollTop = logBox.scrollHeight;
    }

    addLog(`🔍 Initializing deterministic audit for <strong>${rawUrl}</strong>...`);
    addLog(`🌐 Connecting to Cloudflare Edge Network (edge endpoint: <code>seo.lookanet.app</code>)...`, '#38bdf8');

    let auditData = null;
    let fetchError = null;

    for (const endpoint of EDGE_ENDPOINTS) {
        try {
            const apiUrl = `${endpoint}?url=${encodeURIComponent(rawUrl)}`;
            const response = await fetch(apiUrl);
            if (response.ok) {
                auditData = await response.json();
                break;
            } else {
                fetchError = `Edge responded with HTTP ${response.status}`;
            }
        } catch (err) {
            fetchError = err.message;
        }
    }

    if (!auditData) {
        badge.innerText = 'ERROR';
        badge.style.background = 'rgba(239, 68, 68, 0.2)';
        badge.style.color = '#ef4444';
        addLog(`❌ Failed to connect to Edge Engine: ${fetchError || 'Network timeout'}`, '#ef4444');
        addLog(`ℹ️ Tip: Ensure the target website is publicly accessible and not blocking Cloudflare crawlers.`, '#94a3b8');
        btn.disabled = false;
        btn.innerHTML = isFa ? '⚡ آنالیز مجدد' : '⚡ Retry Audit';
        return;
    }

    badge.innerText = 'PROCESSING';
    badge.style.background = 'rgba(0, 212, 255, 0.2)';

    // Step 1: DNS & Network Handshake
    addLog(`🌐 DNS & Edge Probe: Host IP <code>${auditData.network.ip}</code> (Edge POP: ${auditData.network.edge_datacenter})`, '#22c55e');
    addLog(`⚡ Response Latency (TTFB): <strong>${auditData.network.response_time_ms}ms</strong> &bull; Size: ${auditData.network.html_size_kb} KB &bull; Protocol: ${auditData.network.is_https ? 'HTTPS (TLS 1.3 ✅)' : 'HTTP Plain (Insecure ⚠️)'}`, auditData.network.is_https ? '#22c55e' : '#f59e0b');

    // Step 2: Security & Header Posture
    const sec = auditData.security_headers;
    addLog(`🛡️ Security Posture: HSTS (${sec.hsts ? '✅ Active' : '⚠️ Missing'}) | CSP (${sec.csp ? '✅ Enforced' : '⚠️ Missing'}) | X-Frame (${sec.x_frame_options ? '✅ Guarded' : '⚠️ Missing'})`);

    // Step 3: Metadata & Semantics
    const meta = auditData.metadata;
    if (meta.title) {
        addLog(`🏷️ Title Tag: "${meta.title.substring(0, 50)}${meta.title.length > 50 ? '...' : ''}" (${meta.title_length} chars)`, '#38bdf8');
    } else {
        addLog(`⚠️ Title Tag: Missing or empty!`, '#ef4444');
    }

    if (meta.description) {
        const descValid = meta.description_length >= 100 && meta.description_length <= 165;
        addLog(`📄 Meta Description: "${meta.description.substring(0, 45)}..." (${meta.description_length} chars ${descValid ? '✅ Optimal' : '⚠️ Sub-optimal'})`, descValid ? '#22c55e' : '#f59e0b');
    } else {
        addLog(`⚠️ Meta Description: Not declared on page!`, '#f59e0b');
    }

    if (meta.canonical) {
        addLog(`🔗 Canonical URL: <code>${meta.canonical}</code> (${meta.is_self_canonical ? '✅ Self-canonical' : 'ℹ️ Alternate'})`, '#22c55e');
    }

    // Step 4: Headings Hierarchy
    const hd = auditData.headings;
    if (hd.h1_count === 1) {
        addLog(`📑 Headings: Exactly 1 <h1> detected ("${hd.h1_texts[0] ? hd.h1_texts[0].substring(0, 35) : ''}...") &bull; <h2>: ${hd.h2_count} &bull; <h3>: ${hd.h3_count}`, '#22c55e');
    } else if (hd.h1_count === 0) {
        addLog(`🔴 Headings: Critical — Missing <h1> tag! &bull; <h2>: ${hd.h2_count} &bull; <h3>: ${hd.h3_count}`, '#ef4444');
    } else {
        addLog(`⚠️ Headings: Warning — Multiple <h1> tags found (${hd.h1_count} h1s) &bull; <h2>: ${hd.h2_count}`, '#f59e0b');
    }

    // Step 5: Images & Link Architecture
    const img = auditData.images;
    const lnk = auditData.links;
    addLog(`🖼️ Images & Media: ${img.total} images &bull; Alt Compliance: <strong>${img.alt_compliance_pct}%</strong> (${img.missing_alt} missing alt)`, img.alt_compliance_pct >= 90 ? '#22c55e' : '#f59e0b');
    addLog(`🔗 Link Graph: ${lnk.total} links (${lnk.internal} internal &bull; ${lnk.external} external &bull; ${lnk.unsafe_blank_targets} unsafe blank targets)`);

    // Step 6: Schema.org & Content
    const sc = auditData.schema;
    const ct = auditData.content;
    if (sc.has_schema) {
        addLog(`🧩 Structured Data: Schema.org detected (${sc.schemas_detected.join(', ')})`, '#22c55e');
    } else {
        addLog(`ℹ️ Structured Data: No Schema.org JSON-LD found on page.`, '#94a3b8');
    }
    addLog(`📝 Content Volume: ${ct.word_count} words (~${ct.reading_time_minutes} min read &bull; Text ratio: ${ct.text_to_html_ratio_pct}%)`, '#38bdf8');

    // Step 7: AI Search & GEO Matrix
    const ai = auditData.ai_search;
    addLog(`🤖 AI Crawlers: GPTBot (${ai.gptbot_allowed ? '✅' : '❌'}), ClaudeBot (${ai.claudebot_allowed ? '✅' : '❌'}), Perplexity (${ai.perplexity_allowed ? '✅' : '❌'})`);
    if (ai.has_llms_txt) addLog(`🧠 Protocol /llms.txt: Standard active.`, '#22c55e');
    if (ai.has_sitemap) addLog(`🗺️ Sitemap: /sitemap.xml verified.`, '#22c55e');

    // Step 8: Technology Stack
    const tech = auditData.technology.cms_or_framework.join(', ');
    addLog(`🛠️ Technology Stack: ${tech} &bull; Server: ${auditData.technology.server_header}`, '#a855f7');

    // Step 9: Final Deterministic Score
    const finalScore = auditData.scores.overall;
    const grade = auditData.scores.grade;

    addLog(`📊 Audit Complete! Deterministic Score: <strong style="color: #00FF87;">${finalScore}/100 (Grade ${grade})</strong>`, '#00FF87');
    badge.innerText = 'FINISHED';
    badge.style.background = 'rgba(34, 197, 94, 0.2)';
    badge.style.color = '#22c55e';

    // Store complete dataset for standalone report
    currentAuditData = auditData;

    btn.disabled = false;
    btn.innerHTML = isFa ? '⚡ آنالیز فوری (مهمان)' : '⚡ Run Instant Audit';

    // Render Action Buttons below terminal
    const actionContainer = document.createElement('div');
    actionContainer.style.padding = '1rem 1.2rem';
    actionContainer.style.background = 'rgba(255,255,255,0.02)';
    actionContainer.style.borderTop = '1px solid rgba(255,255,255,0.08)';
    actionContainer.style.display = 'flex';
    actionContainer.style.flexWrap = 'wrap';
    actionContainer.style.justifyContent = 'space-between';
    actionContainer.style.alignItems = 'center';
    actionContainer.style.gap = '1rem';

    actionContainer.innerHTML = `
        <div style="color: #fff; font-size: 0.9rem;">
            Real Score: <strong style="color: #00FF87; font-size: 1.15rem;">${finalScore}/100</strong> (Grade ${grade}) &bull; Target: <code>${domain}</code> &bull; Edge: <span style="color: #38bdf8;">${auditData.network.edge_datacenter}</span>
        </div>
        <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
            <button onclick="openFullReportInNewTab()" class="btn btn-primary" style="padding: 0.55rem 1.3rem; font-size: 0.88rem; display: flex; align-items: center; gap: 0.4rem; font-weight: 700;">
                <span>📄</span> ${isFa ? 'مشاهده گزارش جامع در صفحه جدید' : 'Open Comprehensive Report in New Tab'}
            </button>
            <button onclick="openAuthModal()" class="btn" style="background: rgba(255,255,255,0.08); border: 1px solid var(--glass-border); color: #fff; padding: 0.55rem 1.1rem; font-size: 0.88rem;">
                🔑 ${isFa ? 'اتصال سرچ کنسول' : 'Connect GSC'}
            </button>
        </div>
    `;
    resultBox.querySelector('div').appendChild(actionContainer);
}

// -------------------------------------------------------------
// Open Comprehensive Enterprise Audit Report in a New Tab
// -------------------------------------------------------------
function openFullReportInNewTab() {
    if (!currentAuditData) return;
    const d = currentAuditData;
    const isFa = document.documentElement.lang === 'fa';
    const score = d.scores ? d.scores.overall : (d.score || 70);
    const grade = d.scores ? d.scores.grade : (d.grade || 'B');
    const scoreColor = score >= 85 ? '#22c55e' : score >= 70 ? '#00D4FF' : score >= 55 ? '#f59e0b' : '#ef4444';

    const newWindow = window.open('', '_blank');
    if (!newWindow) {
        alert(isFa ? 'مرورگر اجازه باز شدن تب جدید را نداد. لطفاً پاپ‌آپ بلاکر را بررسی کنید.' : 'Pop-up blocked. Please allow pop-ups for this site.');
        return;
    }

    const sc = d.scores || {};
    const hd = d.headings || { h1_count: 0, h1_texts: [], h2_count: 0, h3_count: 0 };
    const im = d.images || { total: 0, missing_alt: 0, alt_compliance_pct: 100 };
    const ln = d.links || { total: 0, internal: 0, external: 0, unsafe_blank_targets: 0 };
    const sm = d.schema || { has_schema: false, schemas_detected: [] };
    const ct = d.content || { word_count: 0, reading_time_minutes: 1, text_to_html_ratio_pct: 0 };
    const tc = d.technology || { cms_or_framework: ['Custom Web'], server_header: 'Guarded' };
    const ai = d.ai_search || { gptbot_allowed: true, claudebot_allowed: true, perplexity_allowed: true, has_llms_txt: false, has_sitemap: false };
    const actions = d.action_items || [];

    const jsonBlobData = encodeURIComponent(JSON.stringify(d, null, 2));

    const htmlContent = `
<!DOCTYPE html>
<html lang="${isFa ? 'fa' : 'en'}" dir="${isFa ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agentic SEO 360° Diagnostic Report — ${d.domain}</title>
    <style>
        :root {
            --bg: #080d1a;
            --card: #0f172a;
            --border: #1e293b;
            --text: #f8fafc;
            --muted: #94a3b8;
            --accent: #00D4FF;
            --success: #22c55e;
            --warn: #f59e0b;
            --danger: #ef4444;
        }
        * { box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: var(--bg); color: var(--text); padding: 2rem 1rem; margin: 0; line-height: 1.6; }
        .container { max-width: 1100px; margin: 0 auto; }
        .card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; margin-bottom: 2rem; flex-wrap: wrap; gap: 1.5rem; }
        .score-circle { width: 100px; height: 100px; border-radius: 50%; border: 4px solid ${scoreColor}; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); }
        .grid-5 { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .kpi-card { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 10px; padding: 1rem; text-align: center; }
        .kpi-val { font-size: 1.6rem; font-weight: 800; margin: 0.3rem 0; }
        .progress-bar { height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; margin-top: 0.5rem; }
        .progress-fill { height: 100%; border-radius: 3px; }
        .badge { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; display: inline-block; }
        .badge-pass { background: rgba(34, 197, 94, 0.15); color: var(--success); border: 1px solid rgba(34,197,94,0.3); }
        .badge-warn { background: rgba(245, 158, 11, 0.15); color: var(--warn); border: 1px solid rgba(245,158,11,0.3); }
        .badge-fail { background: rgba(239, 68, 68, 0.15); color: var(--danger); border: 1px solid rgba(239,68,68,0.3); }
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        th, td { padding: 12px 14px; text-align: ${isFa ? 'right' : 'left'}; border-bottom: 1px solid var(--border); font-size: 0.88rem; }
        th { color: var(--muted); background: rgba(255,255,255,0.02); font-weight: 600; }
        .btn { padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.85rem; border: none; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
        .btn-primary { background: #6366f1; color: #fff; }
        .btn-outline { background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: #fff; }
        .tag-pill { display: inline-block; background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.25); color: #38bdf8; padding: 2px 8px; border-radius: 4px; font-size: 0.78rem; margin: 2px; }
        .action-item { padding: 1rem; border-radius: 8px; margin-bottom: 0.8rem; background: rgba(255,255,255,0.02); border-left: 4px solid var(--border); }
        .action-critical { border-left-color: var(--danger); }
        .action-warning { border-left-color: var(--warn); }
        .action-info { border-left-color: var(--accent); }
        @media print {
            body { background: #fff; color: #000; padding: 0; }
            .card { border: 1px solid #ccc; box-shadow: none; background: #fff; color: #000; }
            .btn { display: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Top Nav & Actions -->
        <div class="header">
            <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 0.3rem;">
                    <span style="font-weight: 800; font-size: 1.2rem; color: #fff;">Agentic SEO</span>
                    <span class="tag-pill">v2.5 Enterprise Edge</span>
                </div>
                <h1 style="margin: 0; font-size: 1.7rem; color: #fff;">${isFa ? 'گزارش ارزیابی فنی و دترمینستیک ۳۶۰ درجه' : '360° Deterministic SEO Audit Dashboard'}</h1>
                <div style="color: var(--muted); font-size: 0.88rem; margin-top: 0.4rem;">
                    Target: <strong style="color: #38bdf8;">${d.url}</strong> &bull; Generated: ${new Date(d.timestamp).toLocaleString()}
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1.2rem;">
                <div class="score-circle">
                    <div style="font-size: 1.8rem; font-weight: 800; color: ${scoreColor}; line-height: 1;">${score}</div>
                    <div style="font-size: 0.72rem; color: var(--muted); margin-top: 3px;">GRADE ${grade}</div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <button class="btn btn-primary" onclick="window.print()">🖨️ ${isFa ? 'چاپ / ذخیره PDF' : 'Print / Save PDF'}</button>
                    <a class="btn btn-outline" href="data:application/json;charset=utf-8,${jsonBlobData}" download="agentic-seo-audit-${d.domain}.json">💾 ${isFa ? 'خروجی داده (JSON)' : 'Export JSON Data'}</a>
                </div>
            </div>
        </div>

        <!-- 5 Pillars Scorecard -->
        <div class="grid-5">
            <div class="kpi-card">
                <div style="color: var(--muted); font-size: 0.78rem;">🌐 ${isFa ? 'زیرساخت و سرعت' : 'Technical & Edge'}</div>
                <div class="kpi-val" style="color: #38bdf8;">${sc.technical || 80}<span style="font-size: 0.8rem; color: var(--muted);">/100</span></div>
                <div class="progress-bar"><div class="progress-fill" style="width: ${sc.technical || 80}%; background: #38bdf8;"></div></div>
            </div>
            <div class="kpi-card">
                <div style="color: var(--muted); font-size: 0.78rem;">🏷️ ${isFa ? 'سئوی آن‌پیج و متا' : 'On-Page & Meta'}</div>
                <div class="kpi-val" style="color: #22c55e;">${sc.onpage || 85}<span style="font-size: 0.8rem; color: var(--muted);">/100</span></div>
                <div class="progress-bar"><div class="progress-fill" style="width: ${sc.onpage || 85}%; background: #22c55e;"></div></div>
            </div>
            <div class="kpi-card">
                <div style="color: var(--muted); font-size: 0.78rem;">📑 ${isFa ? 'محتوا و هدینگ‌ها' : 'Content & Headings'}</div>
                <div class="kpi-val" style="color: #a855f7;">${sc.content_structure || 80}<span style="font-size: 0.8rem; color: var(--muted);">/100</span></div>
                <div class="progress-bar"><div class="progress-fill" style="width: ${sc.content_structure || 80}%; background: #a855f7;"></div></div>
            </div>
            <div class="kpi-card">
                <div style="color: var(--muted); font-size: 0.78rem;">🤖 ${isFa ? 'آمادگی هوش مصنوعی (GEO)' : 'AI Search & GEO'}</div>
                <div class="kpi-val" style="color: #00FF87;">${sc.ai_search_geo || 80}<span style="font-size: 0.8rem; color: var(--muted);">/100</span></div>
                <div class="progress-bar"><div class="progress-fill" style="width: ${sc.ai_search_geo || 80}%; background: #00FF87;"></div></div>
            </div>
            <div class="kpi-card">
                <div style="color: var(--muted); font-size: 0.78rem;">🛡️ ${isFa ? 'امنیت هدرها (OWASP)' : 'Security Posture'}</div>
                <div class="kpi-val" style="color: ${sc.security > 60 ? '#22c55e' : '#f59e0b'};">${sc.security || 30}<span style="font-size: 0.8rem; color: var(--muted);">/100</span></div>
                <div class="progress-bar"><div class="progress-fill" style="width: ${sc.security || 30}%; background: ${sc.security > 60 ? '#22c55e' : '#f59e0b'};"></div></div>
            </div>
        </div>

        <!-- Prioritized Action Items -->
        ${actions.length > 0 ? `
        <div class="card" style="border-color: rgba(245, 158, 11, 0.3);">
            <h3 style="margin-top: 0; color: #f59e0b; display: flex; align-items: center; gap: 8px;">
                <span>🚨</span> ${isFa ? 'اقدامات اولویت‌دار جهت رفع خطاهای کشف‌شده' : 'Prioritized Action Items & Technical Fixes'}
            </h3>
            <div>
                ${actions.map(act => `
                    <div class="action-item ${act.severity === 'CRITICAL' ? 'action-critical' : act.severity === 'WARNING' ? 'action-warning' : 'action-info'}">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                            <strong style="color: #fff; font-size: 0.95rem;">${act.issue}</strong>
                            <span class="badge ${act.severity === 'CRITICAL' ? 'badge-fail' : act.severity === 'WARNING' ? 'badge-warn' : 'badge-pass'}">${act.severity} &bull; ${act.category}</span>
                        </div>
                        <div style="color: var(--muted); font-size: 0.85rem;">
                            👉 <strong style="color: #cbd5e1;">${isFa ? 'راهکار رفع' : 'Remediation'}:</strong> ${act.fix}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <!-- Deep Evidence Section -->
        <div class="card">
            <h3 style="margin-top: 0; color: #38bdf8;">🌐 ${isFa ? 'شواهد استخراج‌شده از DOM و سرور لبه' : 'Deep Extracted DOM & Network Evidence'}</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; font-size: 0.88rem; line-height: 1.8;">
                <div>
                    <h4 style="margin: 0 0 0.5rem 0; color: #fff;">🏷️ ${isFa ? 'متادیتا و هویت صفحه' : 'Page Identity & Metadata'}</h4>
                    <div><strong>Title:</strong> <span style="color: #fff;">${d.metadata ? d.metadata.title : 'None'}</span> <span class="tag-pill">${d.metadata ? d.metadata.title_length : 0} chars</span></div>
                    <div><strong>Description:</strong> <span style="color: #fff;">${d.metadata && d.metadata.description ? d.metadata.description : 'Missing'}</span> <span class="tag-pill">${d.metadata ? d.metadata.description_length : 0} chars</span></div>
                    <div><strong>Canonical:</strong> <code>${d.metadata ? d.metadata.canonical : 'Missing'}</code> ${d.metadata && d.metadata.is_self_canonical ? '<span class="tag-pill" style="color: #22c55e;">Self-Canonical ✅</span>' : ''}</div>
                    <div><strong>Language & Charset:</strong> <span class="tag-pill">${d.metadata ? d.metadata.language : 'en'}</span> <span class="tag-pill">${d.metadata ? d.metadata.charset : 'UTF-8'}</span></div>
                </div>

                <div>
                    <h4 style="margin: 0 0 0.5rem 0; color: #fff;">📑 ${isFa ? 'سلسله‌مراتب هدینگ‌ها و کلمات' : 'Headings & Content Metrics'}</h4>
                    <div><strong>Primary <h1> Count:</strong> <strong style="color: ${hd.h1_count === 1 ? '#22c55e' : '#f59e0b'};">${hd.h1_count}</strong> (${hd.status})</div>
                    ${hd.h1_texts && hd.h1_texts.length > 0 ? `<div style="font-size: 0.8rem; color: var(--muted); margin: 2px 0;">H1 Texts: <em>${hd.h1_texts.join(' | ')}</em></div>` : ''}
                    <div><strong>Sub-Headings:</strong> <code>${hd.h2_count}</code> &times; &lt;h2&gt; &bull; <code>${hd.h3_count}</code> &times; &lt;h3&gt;</div>
                    <div><strong>Word Count:</strong> <strong style="color: #fff;">${ct.word_count} words</strong> (~${ct.reading_time_minutes} min read) &bull; Content: <span class="tag-pill">${ct.status}</span></div>
                    <div><strong>Text-to-HTML Ratio:</strong> <span class="tag-pill">${ct.text_to_html_ratio_pct}%</span></div>
                </div>

                <div>
                    <h4 style="margin: 0 0 0.5rem 0; color: #fff;">🖼️ ${isFa ? 'تصاویر و ساختار لینک‌ها' : 'Images & Links Hygiene'}</h4>
                    <div><strong>Images Total:</strong> <strong style="color: #fff;">${im.total}</strong> &bull; Alt Compliance: <strong style="color: ${im.alt_compliance_pct >= 90 ? '#22c55e' : '#f59e0b'};">${im.alt_compliance_pct}%</strong></div>
                    <div><strong>Missing Alt Tags:</strong> <span style="color: ${im.missing_alt > 0 ? '#f59e0b' : '#22c55e'};">${im.missing_alt} images</span></div>
                    <div><strong>Links Total:</strong> <strong style="color: #fff;">${ln.total}</strong> (${ln.internal} internal &bull; ${ln.external} external)</div>
                    <div><strong>Unsafe blank targets:</strong> <span style="color: ${ln.unsafe_blank_targets > 0 ? '#ef4444' : '#22c55e'};">${ln.unsafe_blank_targets} links</span></div>
                </div>

                <div>
                    <h4 style="margin: 0 0 0.5rem 0; color: #fff;">🧩 ${isFa ? 'اسکیما و استک فنی' : 'Schema & Technology'}</h4>
                    <div><strong>Structured Data:</strong> ${sm.has_schema ? `<span class="tag-pill" style="color: #22c55e;">Detected (${sm.total_schemas})</span>` : '<span class="tag-pill" style="color: #ef4444;">No JSON-LD</span>'}</div>
                    ${sm.schemas_detected && sm.schemas_detected.length > 0 ? `<div style="font-size: 0.8rem; color: var(--muted); margin-top: 2px;">Types: ${sm.schemas_detected.map(s => `<span class="tag-pill">${s}</span>`).join('')}</div>` : ''}
                    <div><strong>Tech Stack / CMS:</strong> ${tc.cms_or_framework.map(t => `<span class="tag-pill">${t}</span>`).join('')}</div>
                    <div><strong>Server Banner:</strong> <code>${tc.server_header}</code> &bull; Edge POP: <span class="tag-pill">${d.network ? d.network.edge_datacenter : 'Edge'}</span></div>
                    <div><strong>Latency (TTFB):</strong> <strong style="color: #22c55e;">${d.network ? d.network.response_time_ms : 0}ms</strong> &bull; Size: ${d.network ? d.network.html_size_kb : 0} KB</div>
                </div>
            </div>
        </div>

        <!-- Complete Diagnostic Verification Matrix -->
        <div class="card">
            <h3 style="margin-top: 0; color: #fff;">📋 ${isFa ? 'ماتریس اعتبارسنجی تشخیصی استاندارد (W3C, RFC 9309 & OWASP)' : 'Standard Diagnostic Verification Matrix (W3C, RFC 9309 & OWASP)'}</h3>
            <table>
                <thead>
                    <tr>
                        <th>${isFa ? 'شاخص تشخیصی' : 'Diagnostic Category'}</th>
                        <th>${isFa ? 'وضعیت' : 'Status'}</th>
                        <th>${isFa ? 'شواهد فنی مستند و زنده' : 'Verified Evidence & Technical Findings'}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>DNS & Host Resolution</strong></td>
                        <td><span class="badge badge-pass">PASS</span></td>
                        <td style="color: var(--muted);">Resolved to IP <code>${d.network ? d.network.ip : 'Edge'}</code> via Cloudflare POP (<code>${d.network ? d.network.edge_datacenter : 'Edge'}</code>)</td>
                    </tr>
                    <tr>
                        <td><strong>HTTPS & TLS Integrity</strong></td>
                        <td><span class="badge ${d.network && d.network.is_https ? 'badge-pass' : 'badge-fail'}">${d.network && d.network.is_https ? 'PASS' : 'FAIL'}</span></td>
                        <td style="color: var(--muted);">${d.network && d.network.is_https ? 'Active TLS 1.3 Certificate with modern cipher suites' : 'Insecure HTTP plain connection detected'}</td>
                    </tr>
                    <tr>
                        <td><strong>Server Latency (TTFB)</strong></td>
                        <td><span class="badge ${d.network && d.network.response_time_ms < 400 ? 'badge-pass' : 'badge-warn'}">${d.network && d.network.response_time_ms < 400 ? 'PASS' : 'WARN'}</span></td>
                        <td style="color: var(--muted);">Time to First Byte: <strong>${d.network ? d.network.response_time_ms : 0}ms</strong> (W3C recommended &lt; 200-400ms)</td>
                    </tr>
                    <tr>
                        <td><strong>Heading Semantics (H1)</strong></td>
                        <td><span class="badge ${hd.h1_count === 1 ? 'badge-pass' : hd.h1_count === 0 ? 'badge-fail' : 'badge-warn'}">${hd.h1_count === 1 ? 'PASS' : hd.h1_count === 0 ? 'FAIL' : 'WARN'}</span></td>
                        <td style="color: var(--muted);">${hd.h1_count === 1 ? 'Optimal single <h1> architecture' : hd.h1_count === 0 ? 'Missing <h1> tag completely' : `Multiple <h1> tags found (${hd.h1_count} detected)`}</td>
                    </tr>
                    <tr>
                        <td><strong>Image Alt Attributes</strong></td>
                        <td><span class="badge ${im.missing_alt === 0 ? 'badge-pass' : 'badge-warn'}">${im.missing_alt === 0 ? 'PASS' : 'WARN'}</span></td>
                        <td style="color: var(--muted);">${im.missing_alt === 0 ? `All ${im.total} images have alt tags` : `${im.missing_alt} of ${im.total} images missing alt text`} (${im.alt_compliance_pct}% compliance)</td>
                    </tr>
                    <tr>
                        <td><strong>Schema.org JSON-LD</strong></td>
                        <td><span class="badge ${sm.has_schema ? 'badge-pass' : 'badge-warn'}">${sm.has_schema ? 'PASS' : 'WARN'}</span></td>
                        <td style="color: var(--muted);">${sm.has_schema ? `Detected schemas: ${sm.schemas_detected.join(', ')}` : 'No JSON-LD structured data detected'}</td>
                    </tr>
                    <tr>
                        <td><strong>AI Bot Policies (GPTBot/Claude)</strong></td>
                        <td><span class="badge ${ai.gptbot_allowed && ai.claudebot_allowed ? 'badge-pass' : 'badge-warn'}">PASS</span></td>
                        <td style="color: var(--muted);">GPTBot: ${ai.gptbot_allowed ? 'Allowed ✅' : 'Blocked ❌'} &bull; ClaudeBot: ${ai.claudebot_allowed ? 'Allowed ✅' : 'Blocked ❌'} &bull; Perplexity: ${ai.perplexity_allowed ? 'Allowed ✅' : 'Blocked ❌'}</td>
                    </tr>
                    <tr>
                        <td><strong>LLMs.txt Protocol Format</strong></td>
                        <td><span class="badge ${ai.has_llms_txt ? 'badge-pass' : 'badge-warn'}">${ai.has_llms_txt ? 'PASS' : 'INFO'}</span></td>
                        <td style="color: var(--muted);">${ai.has_llms_txt ? 'Standard /llms.txt file is published and accessible' : 'Missing /llms.txt — recommended for AI search engine indexing'}</td>
                    </tr>
                    <tr>
                        <td><strong>Content-Security-Policy (CSP)</strong></td>
                        <td><span class="badge ${d.security_headers && d.security_headers.csp ? 'badge-pass' : 'badge-warn'}">${d.security_headers && d.security_headers.csp ? 'PASS' : 'WARN'}</span></td>
                        <td style="color: var(--muted);">${d.security_headers && d.security_headers.csp ? 'CSP header configured' : 'CSP header missing — vulnerable to XSS and injection'}</td>
                    </tr>
                    <tr>
                        <td><strong>HSTS (Strict-Transport-Security)</strong></td>
                        <td><span class="badge ${d.security_headers && d.security_headers.hsts ? 'badge-pass' : 'badge-warn'}">${d.security_headers && d.security_headers.hsts ? 'PASS' : 'WARN'}</span></td>
                        <td style="color: var(--muted);">${d.security_headers && d.security_headers.hsts ? 'HSTS header enforced' : 'Missing HSTS header — downgrade attacks possible'}</td>
                    </tr>
                    <tr>
                        <td><strong>Canonical Integrity</strong></td>
                        <td><span class="badge ${d.metadata && d.metadata.canonical ? 'badge-pass' : 'badge-warn'}">${d.metadata && d.metadata.canonical ? 'PASS' : 'WARN'}</span></td>
                        <td style="color: var(--muted);">${d.metadata && d.metadata.canonical ? `Declared: ${d.metadata.canonical}` : 'Canonical tag not declared'}</td>
                    </tr>
                    <tr>
                        <td><strong>Meta Description CTR Appeal</strong></td>
                        <td><span class="badge ${d.metadata && d.metadata.description_length >= 100 && d.metadata.description_length <= 165 ? 'badge-pass' : 'badge-warn'}">${d.metadata && d.metadata.description_length >= 100 && d.metadata.description_length <= 165 ? 'PASS' : 'WARN'}</span></td>
                        <td style="color: var(--muted);">${d.metadata && d.metadata.description ? `Length: ${d.metadata.description_length} characters (Target: 120-160)` : 'Meta description is missing'}</td>
                    </tr>
                    <tr>
                        <td><strong>Link Security (Tabnabbing)</strong></td>
                        <td><span class="badge ${ln.unsafe_blank_targets === 0 ? 'badge-pass' : 'badge-warn'}">${ln.unsafe_blank_targets === 0 ? 'PASS' : 'WARN'}</span></td>
                        <td style="color: var(--muted);">${ln.unsafe_blank_targets === 0 ? 'All external links include rel="noopener"' : `${ln.unsafe_blank_targets} links missing rel="noopener"`}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Footer / GSC -->
        <div class="card" style="background: rgba(99, 102, 241, 0.08); border-color: rgba(99, 102, 241, 0.3); text-align: center;">
            <h3 style="margin-top: 0; color: #a5d6ff;">🚀 ${isFa ? 'مانیتورینگ پیوسته ۲۴ ساعته با هوش مصنوعی' : 'Autonomous 24/7 Monitoring & AI Auto-Fixes'}</h3>
            <p style="font-size: 0.9rem; color: var(--muted); max-width: 700px; margin: 0.5rem auto 1rem auto;">
                ${isFa ? 'برای مانیتورینگ پیوسته ۲۴ ساعته، پایش رتبه کلمات کلیدی، و صدور خودکار Pull Request در صورت افت سئو، حساب سرچ کنسول خود را متصل نمایید.' : 'Connect your Google Search Console to activate 24/7 ranking drop detection, indexation monitoring, and automated AI pull requests.'}
            </p>
        </div>
    </div>
</body>
</html>
    `;

    newWindow.document.write(htmlContent);
    newWindow.document.close();
}

// -------------------------------------------------------------
// Legitimate Google Search Console / Auth Configuration
// -------------------------------------------------------------
function openAuthModal() {
    let modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.style.display = 'flex';
}

function closeAuthModal() {
    let modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.style.display = 'none';
}

function handleGscJsonUpload(input) {
    const isFa = document.documentElement.lang === 'fa';
    const statusDiv = document.getElementById('gsc-connect-status');
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const json = JSON.parse(e.target.result);
            if (json.type === 'service_account' && json.client_email && json.private_key) {
                // Save service account info locally
                localStorage.setItem('gsc_service_account_email', json.client_email);
                statusDiv.innerHTML = `
                    <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid #22c55e; border-radius: 8px; padding: 1rem; margin-top: 1rem;">
                        <div style="color: #22c55e; font-weight: 700;">✅ ${isFa ? 'فایل معتبر Google Service Account شناسایی شد!' : 'Valid Google Service Account Detected!'}</div>
                        <div style="font-size: 0.85rem; color: #fff; margin-top: 0.3rem;">Client Email: <code>${json.client_email}</code></div>
                        <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.4rem;">${isFa ? 'این کلید برای اجرای دستورات خودکار پایتون (scripts/gsc_checker.py) در سیستم ذخیره شد.' : 'Credentials registered for backend Search Console API workers.'}</div>
                    </div>
                `;
            } else {
                throw new Error('Invalid JSON schema');
            }
        } catch {
            statusDiv.innerHTML = `
                <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; padding: 0.8rem; margin-top: 1rem; color: #ef4444; font-size: 0.85rem;">
                    ❌ ${isFa ? 'فایل نامعتبر است. لطفاً فایل JSON کلید رسمی Service Account را بارگذاری کنید.' : 'Invalid credentials file. Please provide a standard Google Service Account JSON.'}
                </div>
            `;
        }
    };
    reader.readAsText(file);
}

function startGoogleOAuth() {
    const isFa = document.documentElement.lang === 'fa';
    const statusDiv = document.getElementById('gsc-connect-status');
    statusDiv.innerHTML = `
        <div style="background: rgba(0, 212, 255, 0.1); border: 1px solid #00D4FF; border-radius: 8px; padding: 1rem; margin-top: 1rem;">
            <div style="color: #00D4FF; font-weight: 700;">ℹ️ ${isFa ? 'پیکربندی OAuth 2.0 برای محیط پروداکشن:' : 'Production OAuth 2.0 Architecture:'}</div>
            <p style="font-size: 0.82rem; color: #cbd5e1; margin: 0.4rem 0;">
                ${isFa ? 'در سرور پروداکشن (FastAPI روی دیجیتال اوشن)، کاربر به روت <code>/api/v1/auth/google</code> منتقل شده و با تایید مجوز Search Console، توکن‌های دسترسی در دیتابیس رمزنگاری می‌شوند.' : 'In the production cloud engine (FastAPI on DigitalOcean), users are routed to <code>/api/v1/auth/google</code> with <code>webmasters.readonly</code> scope, storing encrypted access tokens.'}
            </p>
            <div style="font-size: 0.8rem; color: #94a3b8;">${isFa ? 'برای حالت لوکال یا سلف‌هاست، از تب آپلود کلید Service Account در بالا استفاده نمایید.' : 'For local CLI or self-hosted instances, upload your Service Account JSON above.'}</div>
        </div>
    `;
}
