from app.infra.ai.provider import AiProvider


class NoopAiProvider(AiProvider):
    def suggest(self, prompt: str) -> str:
        return "AI provider will be implemented later."
