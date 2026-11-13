<div dir="rtl">

<div align="center" dir="ltr">

# 🤖 Agentic SEO

### موتور خودکار سئو و GEO — با ۱ دستور، همه چیز را بهینه‌سازی کنید.

**[🇺🇸 English](README.md) • [🇮🇷 فارسی (Persian)](README.fa.md)**

[![Release](https://img.shields.io/github/v/release/dalroot/agentic-seo?style=for-the-badge&color=blue)](https://github.com/dalroot/agentic-seo/releases)
[![PyPI version](https://img.shields.io/badge/PyPI-v2.0.0-informational?style=for-the-badge&logo=pypi)](https://pypi.org/project/agentic-seo/)
[![Live Demo](https://img.shields.io/badge/Live_Dashboard-Live-success?style=for-the-badge&logo=cloudflare)](https://dalroot.github.io/agentic-seo/fa.html)
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/dalroot/agentic-seo)
[![Deploy to DigitalOcean](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/dalroot/agentic-seo/tree/master)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

<br/>

**Agentic SEO** یک پلتفرم نسل جدید مهندسی سئو و موتور بهینه‌سازی برای جستجوی هوش مصنوعی (GEO) است که به طور اختصاصی برای تیم‌های توسعه محصول و ایجنت‌های هوش مصنوعی (نظیر Antigravity، Cursor، Claude Code و Windsurf) طراحی شده است.

این سامانه به جای اتکا به حدس‌وگمان‌های غیردقیق مدل‌های زبانی، با اجرای **ممیزی‌های ۱۰۰٪ قطعی (Deterministic)**، کدهای فرانت‌اند، هسته حیاتی وب (Core Web Vitals)، داده‌های ساختاریافته Schema.org، فایل‌های راهنمای هوش مصنوعی (`llms.txt`) و همگام‌سازی مداوم با سرچ کنسول گوگل را ارزیابی و بهینه‌سازی می‌کند.

---

## ⚡ شروع سریع: تجربه با یک دستور (The One-Command Experience)

تنها با اجرای یک دستور ساده در ترمینال، ممیزی جامع ۳۶۰ درجه را روی وب‌سایت خود اجرا کنید:

<div dir="ltr">

```bash
# اجرای فوری بدون نیاز به نصب (با npx)
npx agentic-seo https://example.com

# یا نصب از طریق pip / uv
pip install agentic-seo
agentic-seo https://example.com
```

</div>

### 📋 خروجی‌های چهارگانه اجرایی (Instant Deliverables)

بلافاصله پس از اجرا، خلاصه مدیریتی در ترمینال چاپ شده و ۴ خروجی آماده برای استقرار تولید می‌شوند:

| خروجی | فرمت | هدف و کاربرد |
| :--- | :--- | :--- |
| **داشبورد تعاملی مرورگر** | `audit-report.html` | گزارش تصویری با تفکیک نمرات، معیارهای لایت‌هاوس و نمودارهای عیب‌یابی |
| **اکشن‌پلن اجرایی مهندسی** | `ACTION-PLAN.md` | چک‌لیست اولویت‌بندی‌شده اصلاحات بر اساس نسبت تأثیرگذاری به دشواری (Impact/Effort) |
| **گزارش جامع ممیزی** | `FULL-AUDIT-REPORT.md` | گزارش مستند فنی با شواهد دقیق کد، ارجاعات لاگ و راهکارهای حل مسئله |
| **داده‌های ساختاریافته ماشین** | `audit-results.json` | خروجی استاندارد JSON برای اعتبارسنجی در پایپ‌لاین‌های CI/CD، گیت‌هاب اکشنز و وب‌هوک |

---

## 💎 چرا Agentic SEO؟ (ستون‌های اصلی محصول)

<div dir="ltr">

```text
       ┌─────────────────────────────────────────────────────────────┐
       │                   موتور پردازش Agentic SEO                  │
       └──────┬──────────────┬──────────────┬──────────────┬─────────┘
              │              │              │              │
              ▼              ▼              ▼              ▼
       [ ممیزی ۳۶۰ فنی ]      [ بهینه‌سازی GEO ]     [ کارایی و اسکیما ]     [ گیت‌آپز و GSC ]
       - خزش و کدهای وضعیت   - فایل LLMs.txt        - شاخص‌های CWV          - اتصال مستقیم سرچ‌کنسول
       - گراف کانونیکال      - دسترسی ربات‌های AI   - کدهای JSON-LD         - ارسال PRهای خودکار
       - پیوندهای شکسته      - رفرنس در چت‌بات‌ها    - ریسپانسیو موبایل      - اعلان‌های وب‌هوک
```

</div>

### ۱. 🔍 ممیزی فنی کاملاً قطعی (Deterministic SEO)
بدون خطای توهم هوش مصنوعی. ممیزی‌های عمیق HTTP برای شناسایی حلقه‌های ریدایرکت، تناقضات کانونیکال، وضعیت ربات‌ها در `robots.txt`، نقشه‌های سایت XML و هدرهای امنیتی (HSTS, CSP).

### ۲. 🤖 بهینه‌سازی برای موتورهای هوش مصنوعی (GEO & AEO)
تضمین دیده‌شدن برند شما در پاسخ‌های ChatGPT Search، Perplexity، Claude و Google AI Overviews با اعتبارسنجی خودکار `llms.txt`، تنظیم هدرها و بلوک‌های داده جهت ارجاع به عنوان منبع موثق.

### ۳. ⚡ هسته حیاتی وب (Core Web Vitals) و اسکیمای پیشرفته
تحلیل فاکتورهای واقعی عملکرد گوگل شامل LCP، CLS و معیار نوین INP. تولید و اعتبارسنجی کدهای Schema.org JSON-LD بدون ضدالگوهای منسوخ.

### ۴. 📈 همگام‌سازی مداوم با سرچ کنسول گوگل (GitOps & Search Console)
پایش خودکار عملکرد سایت، شناسایی افت رتبه کلیدواژه‌ها، بررسی خطاهای ایندکس و تولید خودکار پول‌ریکوئست‌های ترمیمی در گیت‌هاب.

---

## 🤖 پشتیبانی بومی از ادیتورها و ایجنت‌های هوش مصنوعی

پلتفرم Agentic SEO به صورت بومی و بدون واسطه در تمامی محیط‌های توسعه مدرن هوش مصنوعی پشتیبانی می‌شود:

| محیط توسعه / ایجنت | مسیر نصب بومی | فرمت اجرایی |
| :--- | :--- | :--- |
| **Antigravity IDE** | `.agent/skills/seo/` | پوشه مهارت (Skill Directory) |
| **Cursor** | `.cursor/rules/seo.mdc` | قانون MDC + زیر‌مهارت‌ها |
| **Claude Code** | `~/.claude/skills/seo/` | پوشه مهارت |
| **Windsurf** | `.windsurf/rules/seo.md` | قوانین Windsurf |
| **Codex CLI** | `~/.codex/skills/seo/` | پوشه مهارت |
| **GitHub Copilot** | `.github/copilot-instructions.md` | دستورالعمل‌های مخزن |
| **Cline** | `.clinerules` | قوانین پروژه |

<div dir="ltr">

```bash
# نصب با یک دستور برای تمامی ادیتورهای موجود روی سیستم:
curl -fsSL https://raw.githubusercontent.com/dalroot/agentic-seo/main/install.sh | bash -s -- --online
```

</div>

---

## ☁️ معماری هایبرید چندابری (Cloudflare Edge + DigitalOcean)

- **لایه لبه شبکه (Cloudflare Pages & Functions):** میزبانی داشبورد وب جهانی فوق‌سریع و دریافت وب‌هوک‌های گیت‌هاب در ۳۰۰ دیتاسنتر لبه شبکه با کمترین تاخیر (`wrangler.toml`).
- **لایه پردازش ابری (DigitalOcean / Docker):** اجرای خزشگرهای پس‌زمینه با مرورگرهای بدون‌سر (Playwright) و همگام‌سازی دسته‌ای سرچ کنسول گوگل (`docker-compose.yml`, `.do/app.yaml`).

<div dir="ltr">

```bash
# استقرار سریع با داکر کامپوز
docker compose up -d
```

</div>

---

## 🛠️ دستورات پیشرفته خط‌فرمان و تنظیمات سفارشی

<details>
<summary><b>▶ زیردستورها و فلگ‌های تخصصی CLI</b></summary>

اگرچه اجرای `agentic-seo <url>` ممیزی کامل ۳۶۰ درجه را انجام می‌دهد، می‌توانید بخش‌های خاص را به طور مجزا فراخوانی کنید:

<div dir="ltr">

```bash
# ۱. ممیزی‌های تخصصی تفکیک‌شده
agentic-seo audit https://example.com --type technical   # فایل Robots، هدرهای امنیتی، لینک‌های شکسته
agentic-seo audit https://example.com --type geo         # راهنمای LLMs.txt، سیاست‌های ربات‌های AI
agentic-seo audit https://example.com --type schema      # اعتبارسنجی کدهای Schema JSON-LD
agentic-seo audit https://example.com --type speed       # فاکتورهای سرعت و Core Web Vitals

# ۲. تحلیل داده‌ها و خطاهای ایندکس سرچ کنسول گوگل
agentic-seo gsc https://example.com --days 28 --credentials service_account.json

# ۳. ممیزی سئو و دیسکاوربیلیتی مخزن گیت‌هاب
agentic-seo repo dalroot/agentic-seo

# ۴. اجرای سرور ابری و وب‌هوک دائمی
agentic-seo serve --port 8000
```

</div>
</details>

<details>
<summary><b>▶ پرامپت‌های مهندسی‌شده و آماده برای هوش مصنوعی</b></summary>

کافیست پرامپت‌های آماده زیر را در چت ادیتورهای Antigravity، Cursor یا Claude Code ارسال نمایید:

- **ممیزی جامع ۳۶۰ درجه:**
  > "یک ممیزی جامع و ۳۶۰ درجه روی https://example.com انجام بده. بخش‌های سئوی فنی، کدهای وضعیت، Core Web Vitals، کدهای Schema.org و آمادگی GEO/AEO را بررسی کن و فایل‌های audit-report.html، FULL-AUDIT-REPORT.md و ACTION-PLAN.md را بساز."
- **بهینه‌سازی فروشگاه‌های اینترنتی:**
  > "صفحه محصول https://example.com/product را تحلیل کن: کدهای اسکیما Product و Review را اعتبارسنجی کرده، ابعاد و پرش تصویر (CLS) را اصلاح کن و متاتگ‌ها را برای ارتقای نرخ کلیک بهینه‌سازی نما."
- **بهینه‌سازی برای هوش مصنوعی (GEO):**
  > "سایت https://example.com را برای موتورهای هوش مصنوعی سئو کن: دسترسی GPTBot و ClaudeBot در robots.txt را کنترل کن، فایل llms.txt استاندارد بساز و بلوک‌های پاسخ مستقیم را برای ChatGPT و Perplexity تنظیم کن."
</details>

<details>
<summary><b>▶ استانداردهای سئو و جلوگیری از کدهای مخرب</b></summary>

پلتفرم Agentic SEO استانداردهای اجباری گوگل را بررسی و تضمین می‌کند:
- **معیار INP به جای FID:** سنجش تعامل‌پذیری بر اساس شاخص مدرن INP (شاخص FID منسوخ شده است).
- **فرمت استاندارد JSON-LD:** ممنوعیت استفاده از Microdata و RDFa و ممانعت از اسکیمای منسوخ HowTo.
- **شاخص Mobile-First کامل:** ممیزی ۱۰۰٪ مطابق با رفتار خزشگرهای موبایل گوگل.
- **سلامت کانونیکال:** جلوگیری از تله‌های خزش، حلقه‌های ریدایرکت ۳۰۱/۳۰۲ و تداخل تگ‌های Canonical.
</details>

<details>
<summary><b>▶ مستندات معماری داخلی و لیست اسکریپت‌ها</b></summary>

### 📦 اکوسیستم کامل
- زیر‌مهارت‌های تخصصی: ۱۶
- ایجنت‌های تخصصی: ۱۰
- اسکریپت‌های تحلیلی در پوشه `scripts/`: ۸۹ اسکریپت پایتون و شل

### 🧩 فهرست زیر‌مهارت‌ها (Sub-Skills)
| زیرمهارت | کاربرد |
| :--- | :--- |
| [seo audit](resources/skills/seo-audit.md) | ممیزی جامع و ۳۶۰ درجه کل وب‌سایت با ارزیابی مبتنی بر شواهد کد |
| [seo technical](resources/skills/seo-technical.md) | خزش‌پذیری، ایندکس‌پذیری، امنیت، هسته حیاتی وب و کراولرهای هوش مصنوعی |
| [seo geo](resources/skills/seo-geo.md) | بهینه‌سازی برای موتورهای هوش مصنوعی (ChatGPT, Perplexity, Claude) |
| [seo schema](resources/skills/seo-schema.md) | شناسایی، اعتبارسنجی و ساخت کدهای استاندارد Schema.org JSON-LD |
| [seo content](resources/skills/seo-content.md) | ارزیابی کیفیت محتوا و انطباق با دستورالعمل‌های E-E-A-T گوگل |
| [seo article](resources/skills/seo-article.md) | استخراج داده‌های مقالات و بهینه‌سازی هوشمند متون با مدل زبانی |
| [seo aeo](resources/skills/seo-aeo.md) | بهینه‌سازی موتورهای پاسخ (Featured Snippets, PAA, Knowledge Panel) |
| [seo page](resources/skills/seo-page.md) | ممیزی عمیق و تفکیک‌شده تک‌صفحه |
| [seo sitemap](resources/skills/seo-sitemap.md) | بررسی کیفی و تولید استاندارد نقشه‌های سایت XML |
| [seo images](resources/skills/seo-images.md) | ممیزی تصاویر، متون جایگزین Alt، فرمت‌های مدرن و رفع پرش چیدمان |
| [seo links](resources/skills/seo-links.md) | تحلیل پروفایل لینک‌ها، اتصالات داخلی، انکرتکست‌ها و صفحات یتیم |
| [seo programmatic](resources/skills/seo-programmatic.md) | فیلترهای کیفی و محافظت‌های سئوی برنامه‌نویسی‌شده (Programmatic SEO) |
| [seo competitor-pages](resources/skills/seo-competitor-pages.md) | تولید صفحات مقایسه رقبا و صفحات جایگزین محصولات |
| [seo hreflang](resources/skills/seo-hreflang.md) | اعتبارسنجی سئوی بین‌المللی و تگ‌های چندزبانه Hreflang |
| [seo plan](resources/skills/seo-plan.md) | برنامه‌ریزی استراتژیک سئو، خوشه‌های موضوعی و قالب‌های صنعتی |
| [seo github](resources/skills/seo-github.md) | سئوی مخازن گیت‌هاب، بهینه‌سازی تاپیک‌ها، سلامت کامیونیتی و ترافیک |

برای مشاهده توضیحات فنی و جزییات ۸۹ اسکریپت پایتون:
- **[ویکی و مستندات فنی پروژه](https://github.com/dalroot/agentic-seo/wiki)**
- **[داشبورد زنده آنلاین](https://dalroot.github.io/agentic-seo/fa.html)**
</details>

---

## 📄 مجوز و مشارکت (License & Community)

این پروژه تحت مجوز آزاد [MIT License](LICENSE) عرضه شده است. ارسال گزارش‌های اشکال، پیشنهادات و پول‌ریکوئست‌ها از طریق [گیت‌هاب](https://github.com/dalroot/agentic-seo) بسیار ارزشمند و مورد استقبال است.

</div>
