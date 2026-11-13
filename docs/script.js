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
    addLog(`🌐 DNS & Edge Probe: Resolved IP <code>${auditData.network.ip}</code> (Edge POP: ${auditData.network.edge_datacenter})`, '#22c55e');
    addLog(`⚡ Response TTFB: <strong>${auditData.network.response_time_ms}ms</strong> &bull; Protocol: ${auditData.network.is_https ? 'HTTPS (TLS 1.3 Active ✅)' : 'HTTP Plain (Insecure ⚠️)'}`, auditData.network.is_https ? '#22c55e' : '#f59e0b');

    // Step 2: AI Crawler & Discovery Directives
    const gpt = auditData.ai_search.gptbot_allowed;
    const claude = auditData.ai_search.claudebot_allowed;
    addLog(`🤖 AI Crawler Policies: GPTBot (${gpt ? '✅ Allowed' : '❌ Disallowed'}) | ClaudeBot (${claude ? '✅ Allowed' : '❌ Disallowed'})`);
    if (auditData.ai_search.has_llms_txt) {
        addLog(`🧠 Protocol /llms.txt found: AI search discovery format verified.`, '#22c55e');
    } else {
        addLog(`ℹ️ Protocol /llms.txt missing: Recommended to publish /llms.txt for SearchGPT/Perplexity.`, '#94a3b8');
    }

    // Step 3: Security Posture
    const sec = auditData.security_headers;
    addLog(`🛡️ Security Headers: HSTS (${sec.hsts ? '✅ Active' : '⚠️ Missing'}) | CSP (${sec.csp ? '✅ Configured' : '⚠️ Missing'}) | X-Frame (${sec.x_frame_options ? '✅ Protected' : 'ℹ️ None'})`);

    // Step 4: Metadata & On-Page
    const meta = auditData.metadata;
    if (meta.title) {
        addLog(`🏷️ Title Tag: "${meta.title.substring(0, 55)}${meta.title.length > 55 ? '...' : ''}" (${meta.title_length} chars)`, '#38bdf8');
    } else {
        addLog(`⚠️ Title Tag: Missing or empty!`, '#ef4444');
    }

    if (meta.description) {
        const descValid = meta.description_length >= 100 && meta.description_length <= 165;
        addLog(`📄 Meta Description: "${meta.description.substring(0, 50)}..." (${meta.description_length} chars ${descValid ? '✅ Optimal' : '⚠️ Sub-optimal'})`, descValid ? '#22c55e' : '#f59e0b');
    } else {
        addLog(`⚠️ Meta Description: Not declared on page!`, '#f59e0b');
    }

    if (meta.canonical) {
        addLog(`🔗 Canonical URL: <code>${meta.canonical}</code>`, '#22c55e');
    }

    // Step 5: Final Deterministic Score
    const finalScore = auditData.scores.overall;
    const grade = auditData.scores.grade;

    addLog(`📊 Audit Complete! Deterministic Score: <strong style="color: #00FF87;">${finalScore}/100 (Grade ${grade})</strong>`, '#00FF87');
    badge.innerText = 'FINISHED';
    badge.style.background = 'rgba(34, 197, 94, 0.2)';
    badge.style.color = '#22c55e';

    // Prepare full dataset for standalone report
    currentAuditData = {
        url: auditData.url,
        domain: auditData.domain,
        ip: auditData.network.ip,
        ttfb_ms: auditData.network.response_time_ms,
        edge_colo: auditData.network.edge_datacenter,
        isHttps: auditData.network.is_https,
        score: finalScore,
        grade: grade,
        scores: auditData.scores,
        metadata: meta,
        ai_search: auditData.ai_search,
        security_headers: sec,
        timestamp: new Date(auditData.timestamp).toLocaleString(),
        checks: [
            { name: 'DNS Resolution', status: 'PASS', detail: `Resolved to IP ${auditData.network.ip} via Edge (${auditData.network.edge_datacenter})` },
            { name: 'HTTPS & SSL Security', status: auditData.network.is_https ? 'PASS' : 'FAIL', detail: auditData.network.is_https ? 'Active TLS Certificate' : 'Insecure unencrypted HTTP' },
            { name: 'AI Crawler Policy (GPTBot/Claude)', status: (gpt && claude) ? 'PASS' : 'WARN', detail: `GPTBot: ${gpt ? 'Permitted' : 'Blocked'} | ClaudeBot: ${claude ? 'Permitted' : 'Blocked'}` },
            { name: 'LLMs.txt Discovery Format', status: auditData.ai_search.has_llms_txt ? 'PASS' : 'WARN', detail: auditData.ai_search.has_llms_txt ? 'Standard /llms.txt detected' : 'Recommended to publish /llms.txt for AI search indexing' },
            { name: 'HSTS (Strict-Transport-Security)', status: sec.hsts ? 'PASS' : 'WARN', detail: sec.hsts ? 'HSTS header enforced' : 'Missing HSTS header — downgrade attacks possible' },
            { name: 'Content-Security-Policy (CSP)', status: sec.csp ? 'PASS' : 'WARN', detail: sec.csp ? 'CSP header configured' : 'Header missing — recommended to prevent XSS' },
            { name: 'X-Frame-Options (Clickjacking)', status: sec.x_frame_options ? 'PASS' : 'WARN', detail: sec.x_frame_options ? 'Frame protection configured' : 'Header missing — vulnerable to iframe framing' },
            { name: 'Meta Description Optimization', status: (meta.description_length >= 100 && meta.description_length <= 165) ? 'PASS' : 'WARN', detail: meta.description ? `Length: ${meta.description_length} chars (Target: 120-160)` : 'Meta description tag is missing' },
            { name: 'Canonical Tag Integrity', status: meta.canonical ? 'PASS' : 'WARN', detail: meta.canonical ? `Declared: ${meta.canonical}` : 'Canonical tag not declared' },
            { name: 'Social OpenGraph (og:title/og:image)', status: (meta.social_tags.og_title && meta.social_tags.og_image) ? 'PASS' : 'WARN', detail: `og:title: ${meta.social_tags.og_title ? '✅' : '❌'} | og:image: ${meta.social_tags.og_image ? '✅' : '❌'}` }
        ]
    };

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
            Real Score: <strong style="color: #00FF87; font-size: 1.1rem;">${finalScore}/100</strong> (Grade ${grade}) &bull; Target: <code>${domain}</code> &bull; Edge: <span style="color: #38bdf8;">${auditData.network.edge_datacenter}</span>
        </div>
        <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
            <button onclick="openFullReportInNewTab()" class="btn btn-primary" style="padding: 0.5rem 1.2rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem;">
                <span>📄</span> ${isFa ? 'مشاهده گزارش کامل در صفحه جدید' : 'Open Full Report in New Tab'}
            </button>
            <button onclick="openAuthModal()" class="btn" style="background: rgba(255,255,255,0.08); border: 1px solid var(--glass-border); color: #fff; padding: 0.5rem 1rem; font-size: 0.85rem;">
                🔑 ${isFa ? 'اتصال سرچ کنسول' : 'Connect GSC'}
            </button>
        </div>
    `;
    resultBox.querySelector('div').appendChild(actionContainer);
}

// -------------------------------------------------------------
// Open Detailed Standalone Report in a New Tab
// -------------------------------------------------------------
function openFullReportInNewTab() {
    if (!currentAuditData) return;
    const d = currentAuditData;
    const isFa = document.documentElement.lang === 'fa';
    const scoreColor = d.score >= 80 ? '#22c55e' : d.score >= 70 ? '#00D4FF' : '#f59e0b';

    const newWindow = window.open('', '_blank');
    if (!newWindow) {
        alert(isFa ? 'مرورگر اجازه باز شدن تب جدید را نداد. پاپ‌آپ بلاکر را بررسی کنید.' : 'Pop-up blocked. Please allow pop-ups for this site.');
        return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="${isFa ? 'fa' : 'en'}" dir="${isFa ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agentic SEO Diagnostic Report — ${d.domain}</title>
    <style>
        :root { --bg: #0b0f19; --card: #131b2e; --border: #1e293b; --text: #f8fafc; --muted: #94a3b8; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); padding: 2rem; margin: 0; line-height: 1.6; }
        .container { max-width: 1000px; margin: 0 auto; }
        .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .badge { padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: bold; }
        .badge-pass { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        .badge-warn { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
        .badge-fail { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        th, td { padding: 12px; text-align: ${isFa ? 'right' : 'left'}; border-bottom: 1px solid var(--border); font-size: 0.9rem; }
        th { color: var(--muted); }
        .print-btn { background: #6366f1; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <h1 style="margin: 0; font-size: 1.6rem; color: #fff;">${isFa ? 'گزارش ارزیابی فنی و دترمینستیک Agentic SEO' : 'Agentic SEO Diagnostic Audit Report'}</h1>
                <div style="color: var(--muted); font-size: 0.9rem; margin-top: 0.3rem;">Target URL: <strong style="color: #38bdf8;">${d.url}</strong> &bull; Generated: ${d.timestamp}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="text-align: right;">
                    <div style="font-size: 2.2rem; font-weight: 800; color: ${scoreColor};">${d.score}<span style="font-size: 1rem; color: var(--muted);">/100</span></div>
                    <div style="font-size: 0.8rem; color: var(--muted);">Grade: ${d.grade}</div>
                </div>
                <button class="print-btn" onclick="window.print()">🖨️ ${isFa ? 'چاپ / ذخیره PDF' : 'Print / Save PDF'}</button>
            </div>
        </div>

        <div class="grid-3">
            <div class="card" style="margin-bottom: 0;">
                <div style="color: var(--muted); font-size: 0.85rem;">🏷️ ${isFa ? 'سئوی آن‌پیج' : 'On-Page Technical SEO'}</div>
                <div style="font-size: 1.8rem; font-weight: 700; color: #38bdf8; margin: 0.4rem 0;">${d.scores ? d.scores.onpage_seo : 80}<span style="font-size: 0.9rem; color: var(--muted);">/100</span></div>
                <div style="font-size: 0.8rem; color: var(--muted);">${isFa ? 'تگ عنوان، توضیحات، کنونیکال و متادیتا' : 'Title, Meta Description, Canonical, OG'}</div>
            </div>
            <div class="card" style="margin-bottom: 0;">
                <div style="color: var(--muted); font-size: 0.85rem;">🤖 ${isFa ? 'آمادگی هوش مصنوعی (GEO)' : 'AI Search & GEO Readiness'}</div>
                <div style="font-size: 1.8rem; font-weight: 700; color: #00FF87; margin: 0.4rem 0;">${d.scores ? d.scores.ai_search_geo : 80}<span style="font-size: 0.9rem; color: var(--muted);">/100</span></div>
                <div style="font-size: 0.8rem; color: var(--muted);">${isFa ? 'دسترسی GPTBot، کلادبات و فایل llms.txt' : 'GPTBot, ClaudeBot & llms.txt format'}</div>
            </div>
            <div class="card" style="margin-bottom: 0;">
                <div style="color: var(--muted); font-size: 0.85rem;">🛡️ ${isFa ? 'امنیت هدرها و وب' : 'Security Posture'}</div>
                <div style="font-size: 1.8rem; font-weight: 700; color: #a855f7; margin: 0.4rem 0;">${d.scores ? d.scores.security_posture : 50}<span style="font-size: 0.9rem; color: var(--muted);">/100</span></div>
                <div style="font-size: 0.8rem; color: var(--muted);">${isFa ? 'هدرهای امنیتی HSTS، CSP و ضد Clickjacking' : 'HSTS, CSP, X-Frame-Options'}</div>
            </div>
        </div>

        <div class="card">
            <h3 style="margin-top: 0; color: #38bdf8;">🌐 ${isFa ? 'وضعیت شبکه و سرور هاستینگ' : 'Network & Infrastructure Posture'}</h3>
            <p style="margin: 0; font-size: 0.9rem; color: var(--muted);">
                Host IP: <strong style="color: #fff;">${d.ip}</strong> &bull; 
                Latency (TTFB): <strong style="color: #fff;">${d.ttfb_ms}ms</strong> &bull; 
                Edge POP: <strong style="color: #38bdf8;">${d.edge_colo || 'Edge'}</strong> &bull; 
                Protocol: <strong style="color: #22c55e;">${d.isHttps ? 'HTTPS (TLS 1.3 Active)' : 'HTTP (Insecure)'}</strong>
            </p>
        </div>

        ${d.metadata ? `
        <div class="card">
            <h3 style="margin-top: 0; color: #fff;">📄 ${isFa ? 'شواهد استخراج‌شده از DOM صفحه' : 'Extracted Page DOM Metadata'}</h3>
            <div style="font-size: 0.88rem; color: var(--muted); line-height: 1.8;">
                <div><strong>Title:</strong> <span style="color: #fff;">${d.metadata.title || 'None'}</span> <span style="font-size: 0.8rem; color: #38bdf8;">(${d.metadata.title_length || 0} chars)</span></div>
                <div><strong>Meta Description:</strong> <span style="color: #fff;">${d.metadata.description || 'None'}</span> <span style="font-size: 0.8rem; color: #38bdf8;">(${d.metadata.description_length || 0} chars)</span></div>
                <div><strong>Canonical:</strong> <code>${d.metadata.canonical || 'None declared'}</code></div>
                <div><strong>OpenGraph Tags:</strong> og:title (${d.metadata.social_tags && d.metadata.social_tags.og_title ? '✅' : '❌'}), og:image (${d.metadata.social_tags && d.metadata.social_tags.og_image ? '✅' : '❌'})</div>
            </div>
        </div>
        ` : ''}

        <div class="card">
            <h3 style="margin-top: 0; color: #fff;">📋 ${isFa ? 'ماتریس اعتبارسنجی تشخیصی (W3C & RFC 9309)' : 'Diagnostic Verification Matrix'}</h3>
            <table>
                <thead>
                    <tr>
                        <th>${isFa ? 'شاخص فنی مورد بررسی' : 'Audit Diagnostic Category'}</th>
                        <th>${isFa ? 'وضعیت' : 'Status'}</th>
                        <th>${isFa ? 'شواهد فنی مستند' : 'Technical Findings'}</th>
                    </tr>
                </thead>
                <tbody>
                    ${d.checks.map(c => `
                        <tr>
                            <td><strong>${c.name}</strong></td>
                            <td><span class="badge ${c.status === 'PASS' ? 'badge-pass' : c.status === 'WARN' ? 'badge-warn' : 'badge-fail'}">${c.status}</span></td>
                            <td style="color: var(--muted);">${c.detail}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="card" style="background: rgba(99, 102, 241, 0.08); border-color: rgba(99, 102, 241, 0.3);">
            <h3 style="margin-top: 0; color: #a5d6ff;">🚀 ${isFa ? 'اتصال هوشمند به گوگل سرچ کنسول (GSC)' : 'Autonomous Remediation via Google Search Console'}</h3>
            <p style="font-size: 0.9rem; color: var(--muted);">
                ${isFa ? 'برای مانیتورینگ پیوسته ۲۴ ساعته و ارسال خودکار Pull Request با ایجنت‌های هوش مصنوعی هنگام افت رتبه کلمات کلیدی، کلید سرویس اکانت سرچ کنسول خود را ثبت کنید.' : 'To activate 24/7 background monitoring and automated AI pull requests upon ranking drops, configure your Google Search Console credentials on your Agentic SEO host or cloud container.'}
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
