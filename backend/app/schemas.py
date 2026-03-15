from datetime import datetime
from typing import List

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    token: str
    name: str
    role: str
    email: EmailStr


class GameBase(BaseModel):
    title: str = Field(min_length=2, max_length=180)
    description: str = Field(min_length=10)
    price: float = Field(gt=0)
    stock: int = Field(ge=0)
    category: str = Field(min_length=2, max_length=120)
    image_url: str = Field(alias="imageURL", min_length=5)

    @field_validator("image_url")
    @classmethod
    def validate_url(cls, value: str) -> str:
        if not value.startswith(("http://", "https://")):
            raise ValueError("imageURL must start with http:// or https://")
        return value


class GameCreate(GameBase):
    pass


class GameUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    price: float | None = Field(default=None, gt=0)
    stock: int | None = Field(default=None, ge=0)
    category: str | None = None
    image_url: str | None = Field(default=None, alias="imageURL")


class GameResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    title: str
    description: str
    price: float
    stock: int
    category: str
    image_url: str = Field(alias="imageURL")


class CartItem(BaseModel):
    game_id: int = Field(alias="gameId")
    quantity: int = Field(gt=0)


class CheckoutPayload(BaseModel):
    full_name: str = Field(alias="fullName", min_length=2)
    address: str = Field(min_length=5)
    card_number: str = Field(alias="cardNumber", min_length=13, max_length=19)
    card_holder: str = Field(alias="cardHolder", min_length=2)
    expiry: str = Field(min_length=4, max_length=5)
    cvv: str = Field(min_length=3, max_length=4)
    items: List[CartItem]


class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    total: float
    items: list
    created_at: datetime


class SalesReport(BaseModel):
    total_orders: int
    total_revenue: float
