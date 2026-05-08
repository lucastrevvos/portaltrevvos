from __future__ import annotations

from typing import Any

from app.modules.ai_content.schemas import AIDraftOutput, AIIdeasOutput
from app.modules.ai_content.service import build_openai_strict_json_schema


def test_openai_draft_schema_is_strict_compatible() -> None:
    schema = build_openai_strict_json_schema(AIDraftOutput)

    _assert_strict_object_contract(schema)

    slide_schema = schema["$defs"]["GeneratedSlidePayload"]
    assert slide_schema["required"] == [
        "slide_number",
        "title",
        "body",
        "visual_notes",
    ]
    assert slide_schema["properties"]["body"]["anyOf"] == [
        {"type": "string"},
        {"type": "null"},
    ]
    assert slide_schema["properties"]["visual_notes"]["anyOf"] == [
        {"type": "string"},
        {"type": "null"},
    ]


def test_openai_ideas_schema_is_strict_compatible() -> None:
    schema = build_openai_strict_json_schema(AIIdeasOutput)

    _assert_strict_object_contract(schema)


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
