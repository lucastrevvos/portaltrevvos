from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ValidationError
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_maia_user, get_db_session
from app.domain.couples.repository import SqlAlchemyCoupleRepository
from app.domain.couples.schemas import CoupleCreate, CoupleRead
from app.domain.couples.service import CreateCoupleService
from app.infra.auth.jwt import CurrentUser

router = APIRouter(prefix="/couples", tags=["couples"])
MaiaUser = Annotated[CurrentUser, Depends(get_current_maia_user)]
DbSession = Annotated[AsyncSession, Depends(get_db_session)]


class CreateCoupleRequest(BaseModel):
    partner_user_id: str


def get_create_couple_service(
    session: DbSession,
) -> CreateCoupleService:
    repository = SqlAlchemyCoupleRepository(session)
    return CreateCoupleService(repository)


CreateCoupleDependency = Annotated[
    CreateCoupleService,
    Depends(get_create_couple_service),
]


@router.post(
    "",
    response_model=CoupleRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_couple(
    payload: CreateCoupleRequest,
    current_user: MaiaUser,
    session: DbSession,
    service: CreateCoupleDependency,
) -> CoupleRead:
    try:
        couple = await service.execute(
            CoupleCreate(
                partner_a_user_id=current_user.id,
                partner_b_user_id=payload.partner_user_id,
            ),
        )
        await session.commit()
    except ValidationError as exc:
        await session.rollback()
        detail = exc.errors()[0]["msg"] if exc.errors() else "Invalid payload."
        if detail.startswith("Value error, "):
            detail = detail.removeprefix("Value error, ")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
        ) from exc
    except ValueError as exc:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except IntegrityError as exc:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Couple already exists.",
        ) from exc

    return CoupleRead.model_validate(couple)
