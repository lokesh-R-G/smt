from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import get_settings


class MongoDatabase:
    def __init__(self) -> None:
        self._client: AsyncIOMotorClient | None = None
        self._database: AsyncIOMotorDatabase | None = None

    async def connect(self) -> None:
        if self._client is not None:
            return

        settings = get_settings()
        self._client = AsyncIOMotorClient(settings.mongodb_uri)
        self._database = self._client[settings.mongodb_db_name]

    async def disconnect(self) -> None:
        if self._client is not None:
            self._client.close()

        self._client = None
        self._database = None

    @property
    def database(self) -> AsyncIOMotorDatabase:
        if self._database is None:
            raise RuntimeError("MongoDB is not initialized")
        return self._database


mongo_db = MongoDatabase()


@asynccontextmanager
async def mongo_lifespan() -> AsyncIterator[None]:
    await mongo_db.connect()
    try:
        yield
    finally:
        await mongo_db.disconnect()
