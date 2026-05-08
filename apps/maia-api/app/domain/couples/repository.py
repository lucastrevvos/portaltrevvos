from typing import Protocol

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.couples.model import Couple


class CoupleRepository(Protocol):
    async def add(self, couple: Couple) -> Couple:
        pass

    async def get_by_user_id(self, user_id: str) -> Couple | None:
        pass


class SqlAlchemyCoupleRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def add(self, couple: Couple) -> Couple:
        self._session.add(couple)
        await self._session.flush()
        await self._session.refresh(couple)
        return couple

    async def get_by_user_id(self, user_id: str) -> Couple | None:
        statement = select(Couple).where(
            or_(
                Couple.partner_a_user_id == user_id,
                Couple.partner_b_user_id == user_id,
            ),
        )
        result = await self._session.execute(statement)
        return result.scalar_one_or_none()
