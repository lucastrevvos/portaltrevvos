import asyncio
from types import TracebackType

from pytest import MonkeyPatch

from app.api import deps


class FakeSession:
    pass


class FakeSessionContext:
    def __init__(self) -> None:
        self.session = FakeSession()
        self.was_entered = False
        self.was_exited = False

    async def __aenter__(self) -> FakeSession:
        self.was_entered = True
        return self.session

    async def __aexit__(
        self,
        exc_type: type[BaseException] | None,
        exc_value: BaseException | None,
        traceback: TracebackType | None,
    ) -> None:
        self.was_exited = True


class FakeSessionFactory:
    def __init__(self) -> None:
        self.context = FakeSessionContext()

    def __call__(self) -> FakeSessionContext:
        return self.context


def test_get_db_session_yields_session_from_factory(
    monkeypatch: MonkeyPatch,
) -> None:
    session_factory = FakeSessionFactory()
    monkeypatch.setattr(deps, "AsyncSessionLocal", session_factory)

    async def consume() -> FakeSession:
        generator = deps.get_db_session()
        session = await anext(generator)
        try:
            await anext(generator)
        except StopAsyncIteration:
            pass
        return session

    session = asyncio.run(consume())

    assert session is session_factory.context.session
    assert session_factory.context.was_entered is True
    assert session_factory.context.was_exited is True
