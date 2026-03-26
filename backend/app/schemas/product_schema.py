from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProductSpecification(BaseModel):
    key: str = Field(min_length=1, max_length=100)
    value: str = Field(min_length=1, max_length=300)


class ProductBase(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    category: str = Field(min_length=2, max_length=100)
    price: float = Field(gt=0)
    image: str = Field(min_length=4, max_length=500)
    description: str = Field(min_length=10, max_length=2000)
    specifications: list[ProductSpecification] = Field(default_factory=list)
    is_visible: bool = True


class ProductCreateRequest(ProductBase):
    pass


class ProductUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=200)
    category: str | None = Field(default=None, min_length=2, max_length=100)
    price: float | None = Field(default=None, gt=0)
    image: str | None = Field(default=None, min_length=4, max_length=500)
    description: str | None = Field(default=None, min_length=10, max_length=2000)
    specifications: list[ProductSpecification] | None = None
    is_visible: bool | None = None


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    category: str
    price: float
    image: str
    description: str
    specifications: list[ProductSpecification]
    is_visible: bool
    created_at: datetime
    updated_at: datetime
