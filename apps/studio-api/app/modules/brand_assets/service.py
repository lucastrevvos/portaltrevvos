from __future__ import annotations

from pathlib import Path
from uuid import UUID

from fastapi import UploadFile
from PIL import Image
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.modules.brand_assets.models import BrandAsset
from app.modules.brand_assets.schemas import BrandAssetUpdate
from app.modules.tenants.service import TenantService
from app.shared.enums import BrandAssetType
from app.shared.errors import BadRequestError, NotFoundError
from app.shared.storage import build_public_url, build_safe_file_name


class BrandAssetService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.tenant_service = TenantService(session)
        self.settings = get_settings()
        self.project_root = Path(__file__).resolve().parents[3]
        uploads_base = Path(self.settings.uploads_dir)
        self.upload_root = (
            uploads_base
            if uploads_base.is_absolute()
            else self.project_root / uploads_base
        )

    async def list_for_tenant(self, tenant_id: UUID) -> list[BrandAsset]:
        await self.tenant_service.get_or_404(tenant_id)
        result = await self.session.execute(
            select(BrandAsset)
            .where(BrandAsset.tenant_id == tenant_id)
            .order_by(BrandAsset.is_primary.desc(), BrandAsset.created_at.desc())
        )
        return list(result.scalars().all())

    async def create(
        self,
        tenant_id: UUID,
        file: UploadFile,
        asset_type: BrandAssetType,
        label: str | None,
        is_primary: bool,
    ) -> BrandAsset:
        tenant = await self.tenant_service.get_or_404(tenant_id)
        contents = await file.read()
        if not contents:
            raise BadRequestError("Uploaded brand asset file is empty.")

        extension = Path(file.filename or "").suffix or ".bin"
        file_name = build_safe_file_name(
            file.filename or asset_type.value,
            fallback_stem=asset_type.value,
            extension=extension,
        )
        storage_key = Path("uploads") / "brand-assets" / tenant.slug / asset_type.value
        storage_dir = self.upload_root / "brand-assets" / tenant.slug / asset_type.value
        storage_dir.mkdir(parents=True, exist_ok=True)
        storage_path = storage_dir / file_name
        storage_path.write_bytes(contents)

        width, height = self._read_image_size(contents)
        storage_record = (storage_key / file_name).as_posix()
        public_url = build_public_url(
            storage_record,
        )

        brand_asset = BrandAsset(
            tenant_id=tenant_id,
            asset_type=asset_type,
            label=label.strip() if label and label.strip() else None,
            file_name=file_name,
            mime_type=file.content_type or "application/octet-stream",
            storage_path=storage_record,
            public_url=public_url,
            width=width,
            height=height,
            is_primary=is_primary,
        )
        self.session.add(brand_asset)
        await self.session.flush()
        if is_primary:
            await self._clear_primary_for_type(
                tenant_id=tenant_id,
                asset_type=asset_type,
                keep_asset_id=brand_asset.id,
            )
        await self.session.commit()
        return await self.get_or_404(tenant_id, brand_asset.id)

    async def get_or_404(self, tenant_id: UUID, asset_id: UUID) -> BrandAsset:
        await self.tenant_service.get_or_404(tenant_id)
        result = await self.session.execute(
            select(BrandAsset).where(
                BrandAsset.id == asset_id,
                BrandAsset.tenant_id == tenant_id,
            )
        )
        asset = result.scalar_one_or_none()
        if asset is None:
            raise NotFoundError("Brand asset not found.")
        return asset

    async def update(
        self,
        tenant_id: UUID,
        asset_id: UUID,
        payload: BrandAssetUpdate,
    ) -> BrandAsset:
        asset = await self.get_or_404(tenant_id, asset_id)
        asset.label = (
            payload.label.strip()
            if payload.label and payload.label.strip()
            else None
        )
        asset.asset_type = payload.asset_type
        asset.is_primary = payload.is_primary
        if payload.is_primary:
            await self._clear_primary_for_type(
                tenant_id=tenant_id,
                asset_type=payload.asset_type,
                keep_asset_id=asset.id,
            )
        await self.session.commit()
        return await self.get_or_404(tenant_id, asset_id)

    async def delete(self, tenant_id: UUID, asset_id: UUID) -> None:
        asset = await self.get_or_404(tenant_id, asset_id)
        storage_path = self._resolve_storage_path(asset.storage_path)
        if storage_path.exists():
            storage_path.unlink()
        await self.session.delete(asset)
        await self.session.commit()

    async def get_primary(
        self,
        tenant_id: UUID,
        asset_type: BrandAssetType,
    ) -> BrandAsset | None:
        await self.tenant_service.get_or_404(tenant_id)
        result = await self.session.execute(
            select(BrandAsset)
            .where(
                BrandAsset.tenant_id == tenant_id,
                BrandAsset.asset_type == asset_type,
                BrandAsset.is_primary.is_(True),
            )
            .order_by(BrandAsset.created_at.desc())
        )
        return result.scalar_one_or_none()

    async def count_for_tenant(
        self,
        tenant_id: UUID,
        asset_type: BrandAssetType | None = None,
    ) -> int:
        statement = select(BrandAsset).where(BrandAsset.tenant_id == tenant_id)
        if asset_type is not None:
            statement = statement.where(BrandAsset.asset_type == asset_type)
        result = await self.session.execute(statement)
        return len(result.scalars().all())

    async def _clear_primary_for_type(
        self,
        *,
        tenant_id: UUID,
        asset_type: BrandAssetType,
        keep_asset_id: UUID,
    ) -> None:
        result = await self.session.execute(
            select(BrandAsset).where(
                BrandAsset.tenant_id == tenant_id,
                BrandAsset.asset_type == asset_type,
                BrandAsset.id != keep_asset_id,
                BrandAsset.is_primary.is_(True),
            )
        )
        for other_asset in result.scalars().all():
            other_asset.is_primary = False

    def _read_image_size(self, contents: bytes) -> tuple[int | None, int | None]:
        try:
            from io import BytesIO

            with Image.open(BytesIO(contents)) as image:
                return image.width, image.height
        except Exception:
            return None, None

    def _resolve_storage_path(self, storage_path: str) -> Path:
        path = Path(storage_path)
        if path.is_absolute():
            return path
        if path.parts and path.parts[0] == "uploads":
            return self.upload_root / Path(*path.parts[1:])
        return self.project_root / path
