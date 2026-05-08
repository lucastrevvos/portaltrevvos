from __future__ import annotations

from typing import Any

from app.modules.ai_content.service import build_openai_strict_json_schema
from app.modules.content_radar.prompts import build_radar_prompt
from app.modules.content_radar.schemas import ContentRadarSuggestionsOutput


def test_content_radar_schema_is_strict_compatible() -> None:
    schema = build_openai_strict_json_schema(ContentRadarSuggestionsOutput)

    _assert_strict_object_contract(schema)

    suggestion_schema = schema["$defs"]["ContentRadarSuggestionItem"]
    assert suggestion_schema["required"] == [
        "title",
        "theme",
        "format",
        "objective",
        "cta",
        "briefing",
        "extra_instructions",
        "rationale",
        "content_angle",
        "estimated_difficulty",
        "risk_level",
    ]
    assert suggestion_schema["additionalProperties"] is False


def test_content_radar_prompt_includes_niche_rules_and_recent_requests() -> None:
    prompt = build_radar_prompt(
        tenant_context={
            "tenant": {
                "name": "KM One",
                "slug": "km-one",
                "business_name": "KM One",
                "niche": "driver_app",
            },
            "onboarding": {
                "professional_name": "Equipe KM",
                "target_audience": "Motoristas de app",
                "audience_pain_points": "Lucro real e meta diaria",
            },
            "brand_kit": None,
            "recent_requests": [{"title": "Lucro por km", "theme": "R$/km"}],
        },
        request_context={
            "count": 6,
            "format": "carousel",
            "objective": "authority",
            "additional_context": (
                "Quero temas para quem confunde faturamento com lucro."
            ),
            "avoid_repeating_recent_themes": True,
            "recent_requests": [{"title": "Lucro por km", "theme": "R$/km"}],
        },
    )

    assert "Nao prometer aumento garantido de renda." in prompt
    assert (
        "Focar em lucro liquido, custo por km, meta diaria e decisao consciente."
        in prompt
    )
    assert "Lucro por km" in prompt


def _assert_strict_object_contract(node: dict[str, Any]) -> None:
    properties = node.get("properties")
    if isinstance(properties, dict):
        assert node["required"] == list(properties.keys())
        assert node["additionalProperties"] is False
        for property_schema in properties.values():
            if isinstance(property_schema, dict):
                _assert_strict_object_contract(property_schema)

    items = node.get("items")
    if isinstance(items, dict):
        _assert_strict_object_contract(items)

    definitions = node.get("$defs")
    if isinstance(definitions, dict):
        for definition in definitions.values():
            if isinstance(definition, dict):
                _assert_strict_object_contract(definition)

    any_of = node.get("anyOf")
    if isinstance(any_of, list):
        for option in any_of:
            if isinstance(option, dict):
                _assert_strict_object_contract(option)
