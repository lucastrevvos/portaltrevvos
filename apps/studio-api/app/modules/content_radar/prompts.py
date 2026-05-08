from __future__ import annotations

import json
from typing import Any

from app.modules.ai_content.prompts import GLOBAL_RULES, _render_rules

NICHE_RULES: dict[str, list[str]] = {
    "nutrition": [
        "Nao prescrever dieta individualizada em conteudo publico.",
        "Nao prometer emagrecimento, hipertrofia, cura ou desempenho garantido.",
        "Nao demonizar alimentos ou sugerir suplemento como regra universal.",
        "Usar linguagem educativa, contextual e responsavel.",
        "Quando apropriado, reforcar que condutas dependem de contexto individual.",
    ],
    "driver_app": [
        "Nao prometer aumento garantido de renda.",
        "Nao inventar ganhos medios ou resultados sem fonte real.",
        "Nao incentivar direcao perigosa ou burlar regras de apps.",
        "Focar em lucro liquido, custo por km, meta diaria e decisao consciente.",
    ],
    "mobility": [
        "Nao prometer aumento garantido de renda.",
        "Nao sugerir atalhos perigosos ou anti-eticos.",
        "Focar em planejamento financeiro, operacao e eficiencia.",
    ],
    "finance": [
        "Nao prometer retorno garantido.",
        "Nao inventar numeros, ganhos ou estatisticas.",
        "Focar em clareza, educacao e contexto de risco.",
    ],
    "app": [
        "Nao prometer resultado garantido.",
        "Nao fingir pesquisa em trends sem dados reais.",
        "Focar em clareza de dor, valor e uso pratico do produto.",
    ],
    "saas": [
        "Nao prometer crescimento garantido.",
        "Nao inventar dados de desempenho ou case sem base.",
        "Focar em problema, processo e utilidade do software.",
    ],
}


def resolve_niche_rules(niche: str | None) -> list[str]:
    normalized = (niche or "").strip().casefold()
    if normalized in {"nutrition", "nutricao", "nutrição"}:
        return NICHE_RULES["nutrition"]
    if normalized in {"driver_app", "mobility", "finance", "app", "saas"}:
        return NICHE_RULES[normalized]
    return [
        (
            "Aplicar as regras globais com linguagem educativa, prudente e "
            "comercialmente relevante."
        ),
    ]


def build_radar_system_prompt() -> str:
    return (
        "Voce e o Radar de Conteudo do Trevvos Studio. "
        "Gere sugestoes estrategicas de posts com foco em utilidade, "
        "posicionamento e conversao. "
        "Nao afirme pesquisa web, trends reais ou dados recentes sem fonte. "
        "Preserve UTF-8 e responda apenas com JSON estruturado."
    )


def build_radar_prompt(
    *,
    tenant_context: dict[str, Any],
    request_context: dict[str, Any],
) -> str:
    tenant_json = json.dumps(tenant_context, ensure_ascii=False, indent=2)
    request_json = json.dumps(request_context, ensure_ascii=False, indent=2)
    niche_rules = _render_rules(
        resolve_niche_rules(tenant_context.get("tenant", {}).get("niche"))
    )

    return (
        "Gere sugestoes de conteudo prontas para virar ContentRequest.\n\n"
        f"Contexto do tenant:\n{tenant_json}\n\n"
        f"Contexto do radar:\n{request_json}\n\n"
        f"Regras globais:\n{_render_rules(GLOBAL_RULES)}\n\n"
        f"Regras do nicho:\n{niche_rules}\n\n"
        "As sugestoes devem evitar repetir temas recentes quando o operador "
        "pedir isso. Cada item deve trazer titulo, tema, formato, objetivo, "
        "CTA, briefing, instrucoes extras, rationale, content_angle, "
        "estimated_difficulty e risk_level.\n"
        "Nao usar claims de tendencias reais ou pesquisa recente sem fonte."
    )
