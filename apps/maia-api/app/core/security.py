from app.core.config import Settings


def describe_auth_strategy(settings: Settings) -> dict[str, str]:
    return {
        "issuer": settings.trevvos_auth_issuer,
        "app_slug": settings.trevvos_auth_app_slug,
        "status": "JWT validation will be implemented later.",
    }
