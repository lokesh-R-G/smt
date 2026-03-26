from pydantic import BaseModel, EmailStr


class AdminCustomerResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    company: str
    total_orders: int
    total_spent: float
