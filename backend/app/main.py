from contextlib import asynccontextmanager
import logging
from time import perf_counter
from typing import AsyncIterator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.core.config import get_settings
from app.core.database import mongo_lifespan
from app.services.auth_service import ensure_user_indexes
from app.services.cart_service import ensure_cart_indexes
from app.services.enquiry_service import ensure_enquiry_indexes
from app.services.order_service import ensure_order_indexes
from app.services.product_service import ensure_product_indexes


logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s - %(message)s")
logger = logging.getLogger("smt.backend")


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    async with mongo_lifespan():
        logger.info("Initializing MongoDB indexes")
        await ensure_user_indexes()
        await ensure_product_indexes()
        await ensure_cart_indexes()
        await ensure_order_indexes()
        await ensure_enquiry_indexes()
        logger.info("Backend startup completed")
        yield


settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    debug=settings.app_debug,
    lifespan=lifespan,
)

# For production, replace with your deployed frontend origin(s).
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://smt-liart.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.middleware("http")
async def request_logging_middleware(request: Request, call_next):
    start = perf_counter()
    try:
        response = await call_next(request)
        duration_ms = round((perf_counter() - start) * 1000, 2)
        logger.info(
            "request_completed method=%s path=%s status=%s duration_ms=%s",
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
        )
        return response
    except Exception:
        duration_ms = round((perf_counter() - start) * 1000, 2)
        logger.exception(
            "request_failed method=%s path=%s duration_ms=%s",
            request.method,
            request.url.path,
            duration_ms,
        )
        return JSONResponse(status_code=500, content={"detail": "Internal server error"})


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": f"{settings.app_name} is running"}
