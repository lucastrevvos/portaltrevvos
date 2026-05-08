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
      .frame {
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
      }
      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 52px;
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
      .content {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 220px;
        gap: 40px;
        flex: 1;
      }
      .title {
        margin: 0 0 28px;
        font-family: var(--title-font), Georgia, serif;
        font-size: 78px;
        line-height: 0.95;
        letter-spacing: -0.04em;
      }
      .body {
        margin: 0;
        font-size: 34px;
        line-height: 1.35;
        white-space: pre-wrap;
      }
      .notes {
        margin-top: 28px;
        padding: 18px 20px;
        border-left: 4px solid var(--accent);
        background: rgba(255,255,255,0.56);
        font-size: 22px;
        line-height: 1.4;
      }
      .sidebar {
        display: flex;
        flex-direction: column;
        gap: 18px;
        align-items: stretch;
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
        font-size: 22px;
      }
      .style-box-title {
        margin: 0 0 10px;
        font-size: 18px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
      }
      .style-box-text {
        margin: 0;
        font-size: 22px;
        line-height: 1.4;
      }
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 24px;
        margin-top: 40px;
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
    </style>
  </head>
  <body
    data-slide-number="{{ slide_number or '' }}"
    data-total-slides="{{ total_slides or '' }}"
    data-tenant="{{ brand_name }}"
    data-template="{{ template_name }}"
  >
    <main class="frame">
      <div class="topbar">
        <div class="eyebrow">{{ template_name }}</div>
        <div class="counter">{{ slide_label }}</div>
      </div>
      <section class="content">
        <div>
          <h1 class="title">{{ title }}</h1>
          {% if body %}
          <p class="body">{{ body }}</p>
          {% endif %}
          {% if visual_notes %}
          <div class="notes">{{ visual_notes }}</div>
          {% endif %}
        </div>
        <aside class="sidebar">
          <div class="logo-box">
            {% if brand_logo_url %}
              Logo disponivel
            {% else %}
              Sem logo enviado
            {% endif %}
          </div>
          <div class="style-box">
            <p class="style-box-title">Direcao visual</p>
            <p class="style-box-text">{{ brand_visual_style or layout_rules }}</p>
          </div>
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
