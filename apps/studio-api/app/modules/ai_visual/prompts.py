from __future__ import annotations

import json
from typing import Any


def build_background_prompt(
    *,
    tenant_context: dict[str, Any],
    request_context: dict[str, Any],
    draft_context: dict[str, Any],
    slide_context: dict[str, Any],
    brand_assets: list[dict[str, Any]],
    style_mode: str,
) -> str:
    return (
        "Crie apenas um fundo visual para um post de social media. "
        "Nao inclua texto final, titulos, numeros, CTA ou logotipo desenhado. "
        "Deixe areas de respiro para o renderer aplicar o conteudo acima.\n\n"
        f"Modo visual: {style_mode}\n\n"
        f"Tenant:\n{json.dumps(tenant_context, ensure_ascii=False, indent=2)}\n\n"
        f"Pedido:\n{json.dumps(request_context, ensure_ascii=False, indent=2)}\n\n"
        f"Draft:\n{json.dumps(draft_context, ensure_ascii=False, indent=2)}\n\n"
        f"Slide:\n{json.dumps(slide_context, ensure_ascii=False, indent=2)}\n\n"
        "Brand assets de referencia:\n"
        f"{json.dumps(brand_assets, ensure_ascii=False, indent=2)}\n\n"
        "Resultado esperado: imagem editorial limpa, coerente com a marca, "
        "com areas seguras para sobrepor texto legivel depois."
    )
