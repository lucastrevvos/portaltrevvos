from __future__ import annotations

from collections.abc import Iterable

from app.modules.ai_content.schemas import (
    AIDraftOutput,
    DraftQualityCheckResponse,
    QualityCheckScore,
)

GLOBAL_RISK_PATTERNS = {
    "garantido": "Evite promessas garantidas no conteudo.",
    "resultado garantido": "Evite promessas garantidas no conteudo.",
    "emagreça em": "Evite promessas rapidas de emagrecimento.",
    "emagreca em": "Evite promessas rapidas de emagrecimento.",
    "cura": "Nao prometa cura em conteudo publico.",
    "milagre": "Evite linguagem milagrosa.",
    "sem esforço": "Evite promessas de resultado sem esforco.",
    "sem esforco": "Evite promessas de resultado sem esforco.",
    "100%": "Evite garantias absolutas.",
    "hipertrofia garantida": "Evite garantia de hipertrofia.",
    "diagnóstico": "Nao apresente diagnostico em conteudo publico.",
    "diagnostico": "Nao apresente diagnostico em conteudo publico.",
    "prescrição": "Nao apresente prescricao individual em conteudo publico.",
    "prescricao": "Nao apresente prescricao individual em conteudo publico.",
}

NUTRITION_RISK_PATTERNS = {
    "tome ": "Evite prescricao direta de suplemento ou conduta.",
    "coma exatamente": "Evite dieta individualizada em conteudo publico.",
    "dieta para você": "Evite prescricao individualizada.",
    "dieta para voce": "Evite prescricao individualizada.",
    "suplemento obrigatório": "Evite tratar suplemento como regra universal.",
    "suplemento obrigatorio": "Evite tratar suplemento como regra universal.",
}


def run_quality_check(
    *,
    niche: str,
    draft: AIDraftOutput,
    main_cta: str | None,
) -> DraftQualityCheckResponse:
    texts = list(_collect_texts(draft))
    normalized_text = "\n".join(texts).casefold()

    warnings: list[str] = []
    warnings.extend(_match_patterns(normalized_text, GLOBAL_RISK_PATTERNS))
    if niche.casefold() in {"nutrition", "nutricao", "nutrição"}:
        warnings.extend(_match_patterns(normalized_text, NUTRITION_RISK_PATTERNS))

    suggested_changes: list[str] = []
    if any(len((slide.body or "").strip()) > 240 for slide in draft.slides):
        suggested_changes.append(
            "Reduza corpos de slide muito extensos para melhorar legibilidade."
        )
    if any(len(slide.title.strip()) > 90 for slide in draft.slides):
        suggested_changes.append(
            "Encurte titulos muito longos para manter impacto visual."
        )
    if not (draft.caption or "").strip():
        suggested_changes.append("Adicione uma legenda com contexto e fechamento.")
    if not (draft.fixed_comment or "").strip():
        suggested_changes.append(
            "Adicione comentario fixado para abrir conversa com o publico."
        )
    if not main_cta and "cta" not in normalized_text:
        suggested_changes.append(
            "Considere reforcar uma chamada para acao leve e coerente."
        )

    risk_level = _resolve_risk_level(warnings)
    severity_penalty = {"low": 0, "medium": 2, "high": 4}[risk_level]
    suggestion_penalty = min(len(suggested_changes), 3)

    score = QualityCheckScore(
        clarity=max(4, 9 - suggestion_penalty),
        authority=max(3, 9 - severity_penalty),
        niche_fit=max(4, 9 - (2 if risk_level == "high" else 0)),
        brand_voice=max(4, 8 - (1 if not draft.stories_suggestion.strip() else 0)),
        conversion_potential=max(
            4,
            8
            - (2 if not main_cta else 0)
            - (1 if not draft.fixed_comment.strip() else 0),
        ),
    )

    return DraftQualityCheckResponse(
        approved=risk_level != "high",
        risk_level=risk_level,
        score=score,
        warnings=warnings,
        suggested_changes=suggested_changes,
    )


def _collect_texts(draft: AIDraftOutput) -> Iterable[str]:
    yield draft.title
    yield draft.caption
    yield draft.fixed_comment
    yield draft.stories_suggestion
    for slide in draft.slides:
        yield slide.title
        if slide.body:
            yield slide.body
        if slide.visual_notes:
            yield slide.visual_notes


def _match_patterns(text: str, patterns: dict[str, str]) -> list[str]:
    warnings: list[str] = []
    for pattern, message in patterns.items():
        if pattern in text and message not in warnings:
            warnings.append(message)
    return warnings


def _resolve_risk_level(warnings: list[str]) -> str:
    if len(warnings) >= 3:
        return "high"
    if warnings:
        return "medium"
    return "low"
