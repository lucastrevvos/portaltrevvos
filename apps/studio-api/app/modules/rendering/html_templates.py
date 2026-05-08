from __future__ import annotations

from jinja2 import Template

HTML_TEMPLATE = Template(
    """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      :root {
        --background: {{ background }};
        --primary: {{ primary }};
        --secondary: {{ secondary }};
        --accent: {{ accent }};
        --title-font: {{ title_font }};
        --body-font: {{ body_font }};
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        width: {{ width }}px;
        height: {{ height }}px;
        overflow: hidden;
        background: var(--background);
        color: var(--primary);
        font-family: var(--body-font), Arial, sans-serif;
      }
      body.mode-ai_visual {
        background: #111318;
        color: #fbf7f2;
      }
      .frame {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 72px 72px 56px;
        display: flex;
        flex-direction: column;
        background:
          radial-gradient(
            circle at top right,
            rgba(181, 137, 90, 0.12),
            transparent 26%
          ),
          linear-gradient(180deg, rgba(255,255,255,0.48), rgba(255,255,255,0));
        overflow: hidden;
      }
      body.mode-ai_visual .frame {
        padding: 56px 56px 48px;
        background: none;
      }
      .background-image {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.36;
        filter: saturate(0.96) contrast(1.02);
      }
      body.mode-ai_visual .background-image {
        opacity: 1;
        filter: saturate(1.02) contrast(1.04);
      }
      .background-overlay {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(180deg, rgba(247,242,234,0.32), rgba(247,242,234,0.1)),
          radial-gradient(circle at 18% 18%, rgba(255,255,255,0.64), transparent 34%),
          linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.18));
        mix-blend-mode: screen;
        pointer-events: none;
      }
      body.mode-ai_visual .background-overlay {
        background:
          linear-gradient(
            90deg,
            rgba(10, 14, 20, 0.90) 0%,
            rgba(10, 14, 20, 0.70) 42%,
            rgba(10, 14, 20, 0.16) 70%,
            rgba(10, 14, 20, 0.06) 100%
          ),
          linear-gradient(
            180deg,
            rgba(10, 14, 20, 0.22),
            rgba(10, 14, 20, 0.08)
          );
        mix-blend-mode: normal;
      }
      .topbar {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 52px;
        z-index: 1;
      }
      body.mode-ai_visual .topbar {
        margin-bottom: 36px;
      }
      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        font-size: 24px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .eyebrow::before {
        content: "";
        display: block;
        width: 56px;
        height: 4px;
        border-radius: 999px;
        background: var(--accent);
      }
      .counter {
        padding: 10px 18px;
        border: 1px solid rgba(80, 96, 68, 0.2);
        border-radius: 999px;
        background: rgba(255,255,255,0.64);
        font-size: 24px;
      }
      body.mode-ai_visual .counter {
        background: rgba(10, 14, 20, 0.5);
        border-color: rgba(255, 255, 255, 0.18);
        color: #fff7f0;
      }
      .content {
        position: relative;
        display: grid;
        grid-template-columns: minmax(0, 1fr) 220px;
        gap: 40px;
        flex: 1;
        z-index: 1;
      }
      body.mode-ai_visual .content {
        grid-template-columns: minmax(0, 1.1fr) 300px;
        gap: 32px;
        align-items: end;
      }
      .main-copy {
        display: flex;
        flex-direction: column;
      }
      body.mode-ai_visual .main-copy {
        padding: 28px 30px 24px;
        border-radius: 34px;
        background:
          linear-gradient(180deg, rgba(10, 14, 20, 0.46), rgba(10, 14, 20, 0.12)),
          linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        box-shadow: 0 26px 64px rgba(0, 0, 0, 0.18);
      }
      .title {
        margin: 0 0 28px;
        font-family: var(--title-font), Georgia, serif;
        font-size: 78px;
        line-height: 0.95;
        letter-spacing: -0.04em;
      }
      body.mode-ai_visual .title {
        color: #fff8f2;
        font-size: 72px;
      }
      .body {
        margin: 0;
        font-size: 34px;
        line-height: 1.35;
        white-space: pre-wrap;
      }
      body.mode-ai_visual .body {
        max-width: 700px;
        color: rgba(255, 247, 240, 0.94);
      }
      .notes {
        margin-top: 28px;
        padding: 18px 20px;
        border-left: 4px solid var(--accent);
        background: rgba(255,255,255,0.56);
        font-size: 22px;
        line-height: 1.4;
      }
      body.mode-ai_visual .notes {
        display: none;
      }
      .sidebar {
        display: flex;
        flex-direction: column;
        gap: 18px;
        align-items: stretch;
      }
      body.mode-ai_visual .sidebar {
        gap: 14px;
      }
      .logo-box,
      .style-box {
        padding: 20px;
        border-radius: 28px;
        background: rgba(255,255,255,0.58);
        border: 1px solid rgba(80, 96, 68, 0.12);
      }
      .logo-box {
        min-height: 132px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      body.mode-ai_visual .logo-box {
        min-height: 172px;
        background: rgba(255, 255, 255, 0.82);
        border-color: rgba(255, 255, 255, 0.18);
      }
      .logo-box img {
        max-width: 100%;
        max-height: 92px;
        object-fit: contain;
        display: block;
      }
      body.mode-ai_visual .logo-box img {
        max-height: 112px;
      }
      .style-box-title {
        margin: 0 0 10px;
        font-size: 18px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
      }
      body.mode-ai_visual .style-box {
        display: none;
      }
      .style-box-text {
        margin: 0;
        font-size: 22px;
        line-height: 1.4;
      }
      .footer {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 24px;
        margin-top: 40px;
        z-index: 1;
      }
      .brand {
        font-family: var(--title-font), Georgia, serif;
        font-size: 30px;
      }
      .cta {
        max-width: 360px;
        font-size: 24px;
        text-align: right;
        line-height: 1.35;
      }
      body.mode-ai_visual .cta {
        max-width: 440px;
        padding: 18px 22px;
        text-align: left;
        color: #fff8f2;
        background: rgba(10, 14, 20, 0.42);
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 24px;
        backdrop-filter: blur(8px);
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
      }
      body.mode-ai_visual .brand {
        color: #fff8f2;
      }
      body.mode-ai_visual .footer {
        margin-top: 26px;
      }
      body.mode-ai_visual .eyebrow {
        color: rgba(255, 247, 240, 0.9);
      }
    </style>
  </head>
  <body
    data-slide-number="{{ slide_number or '' }}"
    data-total-slides="{{ total_slides or '' }}"
    data-tenant="{{ brand_name }}"
    data-template="{{ template_name }}"
    class="mode-{{ render_mode }}"
  >
    <main class="frame">
      {% if background_asset_url %}
      <img class="background-image" src="{{ background_asset_url }}" alt="" />
      {% endif %}
      <div class="background-overlay"></div>
      <div class="topbar">
        <div class="eyebrow">
          {% if render_mode == "ai_visual" %}
            {{ brand_name }}
          {% else %}
            {{ template_name }}
          {% endif %}
        </div>
        <div class="counter">{{ slide_label }}</div>
      </div>
      <section class="content">
        <div class="main-copy">
          <h1 class="title">{{ title }}</h1>
          {% if body %}
          <p class="body">{{ body }}</p>
          {% endif %}
          {% if visual_notes and render_mode != "ai_visual" %}
          <div class="notes">{{ visual_notes }}</div>
          {% endif %}
        </div>
        <aside class="sidebar">
          <div class="logo-box">
            {% if brand_logo_url %}
              <img src="{{ brand_logo_url }}" alt="{{ brand_name }} logo" />
            {% elif render_mode != "ai_visual" %}
              Sem logo enviado
            {% endif %}
          </div>
          {% if render_mode != "ai_visual" %}
          <div class="style-box">
            <p class="style-box-title">Direcao visual</p>
            <p class="style-box-text">{{ brand_visual_style or layout_rules }}</p>
          </div>
          {% endif %}
        </aside>
      </section>
      <footer class="footer">
        <div class="brand">{{ brand_name }}</div>
        <div class="cta">
          {{ cta or "Conteudo estrategico com clareza e consistencia." }}
        </div>
      </footer>
    </main>
  </body>
</html>"""
)


def render_html(context: dict[str, object]) -> str:
    return HTML_TEMPLATE.render(**context)
