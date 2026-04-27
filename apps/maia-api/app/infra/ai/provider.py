from typing import Protocol


class AiProvider(Protocol):
    def suggest(self, prompt: str) -> str:
        """Return a suggestion for a prompt."""
