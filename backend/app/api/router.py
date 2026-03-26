from fastapi import APIRouter

from app.api.routes.health import router as health_router
from app.routes.auth_routes import router as auth_router
from app.routes.cart_routes import router as cart_router
from app.routes.customer_routes import router as customer_router
from app.routes.enquiry_routes import admin_router as admin_enquiry_router
from app.routes.enquiry_routes import router as enquiry_router
from app.routes.order_routes import admin_router as admin_order_router
from app.routes.order_routes import router as order_router
from app.routes.product_routes import router as product_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(product_router)
api_router.include_router(cart_router)
api_router.include_router(order_router)
api_router.include_router(admin_order_router)
api_router.include_router(enquiry_router)
api_router.include_router(admin_enquiry_router)
api_router.include_router(customer_router)
