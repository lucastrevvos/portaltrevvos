from typing import Protocol

from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.couples.model import Couple


class CoupleRepository(Protocol):
    async def add(self, couple: Couple) -> Couple:
        pass


class SqlAlchemyCoupleRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def add(self, couple: Couple) -> Couple:
        self._session.add(couple)
        await self._session.flush()
        await self._session.refresh(couple)
        return couple
