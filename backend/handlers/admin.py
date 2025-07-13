from aiogram import Router, types, F
from aiogram.filters import Command
from aiogram.types import Message, CallbackQuery
from aiogram.utils.markdown import hbold
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
import json

from database import async_session, User, Product, Category, Order

admin_router = Router()

class ProductStates(StatesGroup):
    waiting_for_name = State()
    waiting_for_description = State()
    waiting_for_price = State()
    waiting_for_image = State()
    waiting_for_category = State()

@admin_router.message(Command("admin"))
async def admin_menu(message: Message):
    """Show admin menu"""
    async with async_session() as session:
        user = await session.query(User).filter(User.telegram_id == message.from_user.id).first()
        
        if not user or not user.is_admin:
            await message.answer("Bu buyruq faqat adminlar uchun!")
            return
        
        kb = [
            [types.InlineKeyboardButton(
                text="➕ Mahsulot qo'shish",
                callback_data="add_product"
            )],
            [types.InlineKeyboardButton(
                text="📊 Buyurtmalar",
                callback_data="orders"
            )],
            [types.InlineKeyboardButton(
                text="👥 Foydalanuvchilar",
                callback_data="users"
            )]
        ]
        keyboard = types.InlineKeyboardMarkup(inline_keyboard=kb)
        
        await message.answer(
            "Admin panel:",
            reply_markup=keyboard
        )

@admin_router.callback_query(F.data == "add_product")
async def start_add_product(callback: CallbackQuery, state: FSMContext):
    """Start adding new product"""
    await state.set_state(ProductStates.waiting_for_name)
    await callback.message.answer("Mahsulot nomini kiriting:")
    await callback.answer()

@admin_router.message(ProductStates.waiting_for_name)
async def process_name(message: Message, state: FSMContext):
    """Process product name"""
    await state.update_data(name=message.text)
    await state.set_state(ProductStates.waiting_for_description)
    await message.answer("Mahsulot haqida ma'lumot kiriting:")

@admin_router.message(ProductStates.waiting_for_description)
async def process_description(message: Message, state: FSMContext):
    """Process product description"""
    await state.update_data(description=message.text)
    await state.set_state(ProductStates.waiting_for_price)
    await message.answer("Mahsulot narxini kiriting (so'mda):")

@admin_router.message(ProductStates.waiting_for_price)
async def process_price(message: Message, state: FSMContext):
    """Process product price"""
    try:
        price = float(message.text)
        await state.update_data(price=price)
        await state.set_state(ProductStates.waiting_for_image)
        await message.answer("Mahsulot rasmini yuboring:")
    except ValueError:
        await message.answer("Iltimos, to'g'ri narx kiriting!")

@admin_router.message(ProductStates.waiting_for_image)
async def process_image(message: Message, state: FSMContext):
    """Process product image"""
    if not message.photo:
        await message.answer("Iltimos, rasm yuboring!")
        return
    
    photo = message.photo[-1]
    await state.update_data(image=photo.file_id)
    
    async with async_session() as session:
        categories = await session.query(Category).all()
        
        kb = []
        for category in categories:
            kb.append([types.InlineKeyboardButton(
                text=category.name,
                callback_data=f"category_{category.id}"
            )])
        
        keyboard = types.InlineKeyboardMarkup(inline_keyboard=kb)
        
        await state.set_state(ProductStates.waiting_for_category)
        await message.answer(
            "Mahsulot kategoriyasini tanlang:",
            reply_markup=keyboard
        )

@admin_router.callback_query(ProductStates.waiting_for_category)
async def process_category(callback: CallbackQuery, state: FSMContext):
    """Process product category and save product"""
    category_id = int(callback.data.split("_")[1])
    data = await state.get_data()
    
    async with async_session() as session:
        product = Product(
            name=data["name"],
            description=data["description"],
            price=data["price"],
            image=data["image"],
            category_id=category_id
        )
        session.add(product)
        await session.commit()
        
        await callback.message.answer("Mahsulot muvaffaqiyatli qo'shildi!")
        await callback.answer()
    
    await state.clear()

@admin_router.callback_query(F.data == "orders")
async def show_orders(callback: CallbackQuery):
    """Show all orders"""
    async with async_session() as session:
        orders = await session.query(Order).filter(Order.status != "pending").all()
        
        if not orders:
            await callback.message.answer("Buyurtmalar yo'q!")
            await callback.answer()
            return
        
        for order in orders:
            text = f"Buyurtma #{order.id}\n"
            text += f"Status: {order.status}\n"
            text += f"Mijoz: {order.user.full_name}\n"
            text += f"Telefon: {order.phone}\n"
            text += f"Lokatsiya: {order.location}\n\n"
            
            total = 0
            for item in order.items:
                product = item.product
                subtotal = item.quantity * item.price
                total += subtotal
                
                text += f"{product.name}\n"
                text += f"{item.quantity} x {item.price:,.0f} = {subtotal:,.0f} so'm\n\n"
            
            text += f"\nUmumiy summa: {total:,.0f} so'm"
            
            kb = [
                [types.InlineKeyboardButton(
                    text="✅ Yetkazildi",
                    callback_data=f"deliver_{order.id}"
                )],
                [types.InlineKeyboardButton(
                    text="❌ Bekor qilish",
                    callback_data=f"cancel_{order.id}"
                )]
            ]
            keyboard = types.InlineKeyboardMarkup(inline_keyboard=kb)
            
            await callback.message.answer(text, reply_markup=keyboard)
        
        await callback.answer()

@admin_router.callback_query(F.data.startswith("deliver_"))
async def deliver_order(callback: CallbackQuery):
    """Mark order as delivered"""
    order_id = int(callback.data.split("_")[1])
    
    async with async_session() as session:
        order = await session.get(Order, order_id)
        if order:
            order.status = "delivered"
            await session.commit()
            
            await callback.message.edit_text(
                callback.message.text + "\n\n✅ Yetkazildi"
            )
        
        await callback.answer()

@admin_router.callback_query(F.data.startswith("cancel_"))
async def cancel_order(callback: CallbackQuery):
    """Cancel order"""
    order_id = int(callback.data.split("_")[1])
    
    async with async_session() as session:
        order = await session.get(Order, order_id)
        if order:
            order.status = "cancelled"
            await session.commit()
            
            await callback.message.edit_text(
                callback.message.text + "\n\n❌ Bekor qilindi"
            )
        
        await callback.answer()

@admin_router.callback_query(F.data == "users")
async def show_users(callback: CallbackQuery):
    """Show all users"""
    async with async_session() as session:
        users = await session.query(User).all()
        
        if not users:
            await callback.message.answer("Foydalanuvchilar yo'q!")
            await callback.answer()
            return
        
        text = "Foydalanuvchilar:\n\n"
        for user in users:
            text += f"{user.full_name} - {user.phone}\n"
        
        await callback.message.answer(text)
        await callback.answer() 