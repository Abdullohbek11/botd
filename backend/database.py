from datetime import datetime
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import DeclarativeBase

# Create async engine
engine = create_async_engine(
    "sqlite+aiosqlite:///database.db",
    echo=True,
)

# Base class for models
class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    telegram_id = Column(Integer, unique=True)
    username = Column(String(100))
    full_name = Column(String(100))
    phone = Column(String(20))
    address = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_admin = Column(Boolean, default=False)
    
    orders = relationship("Order", back_populates="user")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True)
    description = Column(Text)
    image = Column(String(255))
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    products = relationship("Product", back_populates="category")
    subcategories = relationship("Category")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String(200))
    description = Column(Text)
    price = Column(Float)
    original_price = Column(Float)
    discount = Column(Integer)
    image = Column(String(255))
    category_id = Column(Integer, ForeignKey("categories.id"))
    in_stock = Column(Boolean, default=True)
    rating = Column(Float, default=0)
    reviews_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String(50), default="pending")  # pending, confirmed, delivered, cancelled
    total_amount = Column(Float)
    address = Column(Text)
    location = Column(String(100))  # Coordinates
    phone = Column(String(20))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    price = Column(Float)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")

# Create tables
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Session factory
async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# Dependency
async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session 