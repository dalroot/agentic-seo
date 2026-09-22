<div align="center">

# 🤖 مهارت سئوی ایجنتیک (Agentic SEO Skill)

**[🇮🇷 فارسی (Persian)](README.fa.md) | [🇺🇸 English](README.md)**

[![Release](https://img.shields.io/github/v/release/dalroot/agentic-seo?style=for-the-badge&color=blue)](https://github.com/dalroot/agentic-seo/releases)
[![GitHub Pages](https://img.shields.io/github/actions/workflow/status/dalroot/agentic-seo/deploy-pages.yml?branch=master&label=Live%20Site&style=for-the-badge&color=success)](https://dalroot.github.io/agentic-seo)
[![Python](https://img.shields.io/badge/Python-91%25-yellow?style=for-the-badge&logo=python)](https://github.com/dalroot/agentic-seo)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

> **اکوسیستم جامع سئو، بهینه‌سازی فنی و موتورهای هوش مصنوعی (GEO & AEO) ویژه دستیاران و ایجنت‌های کدنویسی** 🚀
</div>

<div dir="rtl">

**Agentic SEO** یک مهارت استاندارد و جعبه‌ابزار مهندسی برای دستیاران کدنویسی و ایجنت‌های هوش مصنوعی (نظیر Antigravity، Cursor، Claude Code و Windsurf) است. این پروژه به جای حدس‌وگمان‌های رایج هوش مصنوعی، با بهره‌گیری از ۸۹ اسکریپت خودکار پایتون و ۱۶ زیر‌مهارت تخصصی، فرآیند ممیزی، عیب‌یابی و بهینه‌سازی کدهای سئو را بر پایه داده‌های واقعی و بدون خطا (Deterministic & Evidence-Based) روی محیط لوکال اجرا می‌کند.

---

## ⚡ چرا هوش مصنوعی به این مهارت نیاز دارد؟

مدل‌های زبانی بزرگ (LLMs) به طور پیش‌فرض استانداردهای عمیق و متغیر سئوی تکنیکال را با جزئیات فنی دقیق نمی‌دانند و پیشنهادهای کلیشه‌ای ارائه می‌دهند:

| شاخص | هوش مصنوعی معمولی (بدون اسکیل) | هوش مصنوعی مجهز به Agentic SEO |
|---|---|---|
| **شیوه تحلیل** | حدس‌وگمان متنی و پیشنهادهای کلیشه‌ای | اجرای اسکریپت‌های پایتون و استخراج داده‌های مستند |
| **سئوی فنی و خزش** | ناتوان در بررسی هدرها و وضعیت ربات‌ها | بررسی دقیق `robots.txt`، امنیت هدرها و کراولرهای هوش مصنوعی |
| **هوش مصنوعی و GEO** | بی‌اطلاع از فرمت‌های مدرن AI Search | تولید خودکار `llms.txt` و بهینه‌سازی برای ChatGPT و Perplexity |
| **کیفیت کد و اسکیما** | ایجاد خطاهای رایج (مثل تداخل Canonical) | تولید کدهای معتبر Schema.org JSON-LD بدون ضدالگو |
| **خروجی نهایی** | متن‌های پراکنده داخل چت | تولید داشبورد گرافیکی HTML، گزارش مارک‌داون و اکشن‌پلن اجرایی |

---

## 🚀 روش‌های نصب و راه‌اندازی

### روش اول: نصب سریع و بدون نیاز به ترمینال (پیشنهادی 🌟)

ساده‌ترین روش فعال‌سازی، استفاده از چت هوش مصنوعی در محیط توسعه است. کافیست دستور زیر را کپی کرده و به دستیار کدنویسی خود (Antigravity، Cursor، Claude و...) ارسال کنید:

```text
دستورالعمل سیستم:
۱. مخزن https://github.com/dalroot/agentic-seo را در پوشه مناسب پروژه کلون کن.
۲. این ریپازیتوری را به عنوان جعبه‌ابزار مرجع مهارت‌های سئو (SEO Skills) خود قرار بده.
۳. فایل SKILL.md را بخوان تا بر قابلیت‌های جدید خود مسلط شوی.
۴. پیام نصب موفق را اعلام کن و با معرفی توانمندی‌هایت به عنوان متخصص سئو، منتظر دریافت آدرس سایت یا کدهای پروژه برای تحلیل بمان.
```

---

### روش دوم: نصب با یک دستور از طریق ترمینال (ویژه توسعه‌دهندگان)

این اسکریپت تنها پوشه مهارت‌های سئو را داخل پوشه تنظیمات ادیتور شما (مانند `.agent/skills/seo` یا `.cursor/skills/`) قرار می‌دهد و هیچ تغییری در فایل‌های روت سیستم ایجاد نمی‌کند:

#### لینوکس و مک (Linux & macOS):
<div dir="ltr">

```bash
# نصب مهارت روی محیط پیش‌فرض
curl -fsSL https://raw.githubusercontent.com/dalroot/agentic-seo/main/install.sh | bash -s -- --online

# یا نصب مستقیم برای یک ادیتور خاص (مانند Antigravity یا Cursor):
curl -fsSL https://raw.githubusercontent.com/dalroot/agentic-seo/main/install.sh | bash -s -- --target antigravity
```

</div>

#### ویندوز (Windows PowerShell):
<div dir="ltr">

```powershell
irm https://raw.githubusercontent.com/dalroot/agentic-seo/main/install.ps1 -OutFile install.ps1
powershell -ExecutionPolicy Bypass -File .\install.ps1 --online
```

</div>

---

## 💻 سازگاری بومی با محیط‌های توسعه (IDEs)

این پکیج به صورت خودکار با ساختار فایل‌های پیکربندی و فرمت بومی هر ادیتور منطبق می‌شود:

| ابزار / ادیتور | مسیر فایل مهارت | ساختار اجرایی |
|---|---|---|
| **Antigravity IDE** | `<project>/.agent/skills/seo` | Skill Directory |
| **Cursor** | `.cursor/rules/seo.mdc` + `.cursor/skills/seo/` | MDC Rule + Skills |
| **Claude Code** | `~/.claude/skills/seo` | Skill Directory |
| **Windsurf** | `.windsurf/rules/seo.md` + `.windsurf/skills/seo/` | Windsurf Rule |
| **Codex CLI** | `~/.codex/skills/seo` | Skill Directory |
| **GitHub Copilot** | `.github/copilot-instructions.md` | Repo Instructions |
| **Continue.dev** | `.continue/prompts/seo.prompt` | Slash Command |
| **Cline** | `.clinerules` | Project Rules |

---

## 🎯 پرامپت‌های آماده و کاربردی

پس از نصب، هر یک از دستورات مهندسی‌شده زیر را متناسب با نیاز خود در چت هوش مصنوعی کپی کنید:

### ۱. ممیزی جامع ۳۶۰ درجه وب‌سایت (Master Audit)
> *بررسی فنی، محتوایی، ساختاری و موتورهای هوش مصنوعی برای هر وب‌سایت فعال:*

```text
یک ممیزی جامع و ۳۶۰ درجه روی وب‌سایت https://example.com انجام بده.
بخش‌های زیر را به دقت تحلیل کن:
۱. سئوی فنی: بررسی robots.txt، نقشه سایت، زنجیره ریدایرکت‌ها، هدرهای امنیتی و ایندکس‌پذیری
۲. سرعت و کارایی: فاکتورهای حیاتی Core Web Vitals (شامل LCP و CLS) و ریسپانسیو بودن
۳. کیفیت محتوا و اعتبار E-E-A-T: خوانایی، یکپارچگی اطلاعات و نظم تگ‌های هدینگ (H1 تا H6)
۴. داده‌های ساختاریافته (Schema.org): اعتبارسنجی و ساخت کدهای استاندارد JSON-LD
۵. وضعیت لینک‌ها و رسانه‌ها: انکرتکست‌ها، لینک‌های شکسته و تگ‌های Alt تصاویر
۶. بهینه‌سازی هوش مصنوعی (GEO/AEO): بررسی فایل llms.txt و مجوزهای ربات‌های AI (نظیر GPTBot و ClaudeBot)

در پایان داشبورد گرافیکی audit-report.html، گزارش کامل FULL-AUDIT-REPORT.md و برنامه اقدام گام‌به‌گام ACTION-PLAN.md را تولید کن.
```

### ۲. سئوی سایت‌های فروشگاهی (E-Commerce SEO)
```text
صفحه محصول https://myshop.com/product/shoes را برای سئوی فروشگاهی تحلیل کن:
- کدهای ساختاریافته Product، AggregateOffer و Review را استخراج و اعتبارسنجی کن.
- ابعاد تصاویر، تگ‌های Alt و جلوگیری از پرش چیدمان (CLS) را بررسی کن.
- ساختار جذاب متاتگ‌ها و توضیحات محصول را برای ارتقای نرخ کلیک (CTR) بهینه‌سازی کن.
```

### ۳. ارزیابی مقالات و وبلاگ‌ها (Content & E-E-A-T)
```text
مقاله https://example.com/blog/seo-guide را با زیر‌مهارت‌های محتوایی بررسی کن:
- شاخص خوانایی و تطابق با معیارهای تجربه، تخصص و اعتبار (E-E-A-T) گوگل را ارزیابی کن.
- ساختار هدینگ‌ها و ریسک هم‌پوشانی و رقابت مخرب صفحات (Keyword Cannibalization) را مشخص کن.
- کدهای استاندارد Article و FAQPage را به صورت JSON-LD جهت درج در سایت تولید کن.
```

### ۴. بهینه‌سازی برای موتورهای هوش مصنوعی (GEO & AEO)
```text
وب‌سایت https://example.com را برای موتورهای جستجوی هوش مصنوعی (مانند ChatGPT Search، Perplexity و Google AI Overviews) بهینه‌سازی کن:
- سطح دسترسی ربات‌های شاخص هوش مصنوعی (GPTBot، ClaudeBot و PerplexityBot) را در robots.txt تنظیم کن.
- فایل استاندارد llms.txt و llms-full.txt را برای راهنمایی دقیق مدل‌های زبانی از ساختار سایت ایجاد کن.
- ساختار پاسخ‌های صریح و کلیدی را برای حضور در نتایج ویژه (Featured Snippets) مهیا کن.
```

### ۵. بهینه‌سازی سئوی مخازن گیت‌هاب (GitHub SEO)
```text
مخزن https://github.com/owner/repo را از نظر اصول سئوی گیت‌هاب تحلیل کن:
- تناسب کلمات کلیدی، تاپیک‌ها، تگ‌های About و ساختار ریدمی را با رقبای برتر بررسی کن.
- گزارش GITHUB-SEO-REPORT.md و برنامه اجرایی افزایش ورودی از سرچ گیت‌هاب و موتورهای جستجو را ارائه بده.
```

---

## 📦 ابزارها و اسکریپت‌های تحلیلی کلیدی

این اکوسیستم شامل **۸۹ اسکریپت پایتون** و **۱۶ زیر‌مهارت** است که بخش‌های مهم آن عبارتند از:

| نام اسکریپت | کاربرد تخصصی |
|---|---|
| `audit_runner.py` | اجرای یکپارچه ممیزی ۳۶۰ درجه و تولید خروجی‌های JSON، HTML و Markdown |
| `generate_report.py` | ساخت داشبورد مدرن و تعاملی وب برای ارائه به کارفرما |
| `robots_checker.py` | بررسی قوانین دسترسی ربات‌های سنتی و کراولرهای هوش مصنوعی |
| `llms_txt_checker.py` | اعتبارسنجی کیفی فایل‌های راهنمای هوش مصنوعی (`llms.txt` و `llms-full.txt`) |
| `validate_schema.py` | بررسی سلامت کدهای ساختاریافته JSON-LD و جلوگیری از اسکیماهای منسوخ |
| `pagespeed.py` | استخراج دقیق فاکتورهای سرعت و استانداردهای Core Web Vitals |
| `broken_links.py` | پایش پیوندهای شکسته، صفحات مسدود و زنجیره‌های ریدایرکت |
| `github_seo_report.py` | تحلیل سئوی صفحه گیت‌هاب و تدوین اکشن‌پلن رشد مخزن |

---

## 🤝 مشارکت در پروژه (Contributing)

ما از توسعه و بهبود مهارت‌ها، افزودن اسکریپت‌های تحلیلی و رفع ایرادات استقبال می‌کنیم. لطفاً پیش از ارسال پول‌ریکوئست، راهنمای [CONTRIBUTING.md](CONTRIBUTING.md) را مطالعه فرمایید.

## 📄 مجوز انتشار (License)

این پروژه به صورت کاملاً آزاد و رایگان تحت لایسنس [MIT](LICENSE) منتشر شده است و استفاده شخصی و تجاری از آن بلامانع است.

</div>
