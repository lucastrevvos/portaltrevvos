from __future__ import annotations

import json
from typing import Any

from app.shared.enums import ContentFormat

GLOBAL_RULES = [
    "Nao prometer resultado garantido.",
    (
        "Nao inventar credenciais, registros profissionais, precos, "
        "depoimentos ou numeros nao informados."
    ),
    (
        "Nao fazer diagnostico, prescricao individual ou substituicao "
        "de consulta profissional."
    ),
    (
        "Nao usar sensacionalismo, milagre, 100% de garantia ou ataques "
        "a concorrentes."
    ),
    "Nao gerar conteudo discriminatorio, humilhante ou anti-etico.",
    "Preservar portugues natural com acentos e pontuacao corretos.",
]

NICHE_RULES: dict[str, list[str]] = {
    "nutrition": [
        "Nao prescrever dieta individualizada em conteudo publico.",
        "Nao prometer emagrecimento, hipertrofia, cura ou desempenho garantido.",
        "Nao demonizar alimentos ou sugerir suplemento como regra universal.",
        "Usar linguagem educativa, contextual e responsavel.",
        "Quando apropriado, reforcar que condutas dependem de contexto individual.",
    ],
}


def resolve_niche_rules(niche: str | None) -> list[str]:
    normalized = (niche or "").strip().casefold()
    if normalized in {"nutrition", "nutricao", "nutrição"}:
        return NICHE_RULES["nutrition"]
    return [
        "Aplicar as regras globais com linguagem educativa, prudente e profissional."
    ]


def build_generation_system_prompt() -> str:
    return (
        "Voce e o motor textual do Trevvos Studio. "
        "Gere conteudo premium, claro, util e comercialmente relevante "
        "para social media. "
        "Respeite estritamente o contexto recebido, preserve UTF-8 e "
        "nunca remova acentos. "
        "Responda apenas com o JSON solicitado pelo schema, sem markdown."
    )


def build_ideas_prompt(
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
        "Gere ideias de conteudo alinhadas ao contexto abaixo.\n\n"
        f"Contexto estruturado:\n{tenant_json}\n\n"
        f"Pedido da operacao:\n{request_json}\n\n"
        f"Regras globais:\n{_render_rules(GLOBAL_RULES)}\n\n"
        f"Regras do nicho:\n{niche_rules}\n\n"
        "Cada ideia deve ser especifica, plausivel para o publico do "
        "cliente, sem clickbait barato, com angulo claro e CTA coerente."
    )


def build_draft_prompt(
    *,
    tenant_context: dict[str, Any],
    request_context: dict[str, Any],
    slide_count: int,
    extra_instructions: str | None,
) -> str:
    tenant_json = json.dumps(tenant_context, ensure_ascii=False, indent=2)
    request_json = json.dumps(request_context, ensure_ascii=False, indent=2)
    niche_rules = _render_rules(
        resolve_niche_rules(tenant_context.get("tenant", {}).get("niche"))
    )
    format_value = request_context["content_request"]["format"]
    slide_instruction = (
        f"Retorne exatamente {slide_count} slides ordenados de 1 a {slide_count}."
        if format_value == ContentFormat.CAROUSEL.value
        else "Retorne a lista slides vazia."
    )
    extra_block = (
        f"Instrucoes adicionais do operador:\n{extra_instructions.strip()}\n\n"
        if extra_instructions and extra_instructions.strip()
        else ""
    )

    return (
        "Crie um draft textual completo para o pedido abaixo.\n\n"
        f"Contexto do tenant:\n{tenant_json}\n\n"
        f"Contexto do pedido:\n{request_json}\n\n"
        f"Regras globais:\n{_render_rules(GLOBAL_RULES)}\n\n"
        f"Regras do nicho:\n{niche_rules}\n\n"
        f"{extra_block}"
        "Saida esperada:\n"
        "- Titulo forte, claro e fiel ao tema.\n"
        "- Legenda util, sem hashtags por padrao.\n"
        "- Comentario fixado curto e coerente.\n"
        "- Sugestao de stories acionavel.\n"
        f"- {slide_instruction}\n"
        "- Nao usar emojis se o tom for tecnico, premium, cientifico "
        "ou editorial, salvo pedido explicito.\n"
        "- Evitar textos longos demais em cada slide.\n"
        "- Nunca remova acentos do conteudo."
    )


def _render_rules(rules: list[str]) -> str:
    return "\n".join(f"- {rule}" for rule in rules)
