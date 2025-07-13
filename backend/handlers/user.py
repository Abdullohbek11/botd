from aiogram import Router, types, F
from aiogram.filters import CommandStart
from aiogram.types import Message, CallbackQuery
from aiogram.utils.markdown import hbold
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from database import async_session, User, Product, Category, Order, OrderItem

user_router = Router()

class OrderStates(StatesGroup):
    waiting_for_location = State()
    waiting_for_phone = State()
    waiting_for_confirmation = State()

@user_router.message(CommandStart())
async def command_start_handler(message: Message) -> None:
    """
    This handler receives messages with `/start` command
    """
    kb = [
        [
            types.KeyboardButton(text="🛍 Katalog"),
            types.KeyboardButton(text="🛒 Savat"),
        ],
        [
            types.KeyboardButton(text="📱 Kontakt", request_contact=True),
            types.KeyboardButton(text="📍 Lokatsiya", request_location=True),
        ],
    ]
    keyboard = types.ReplyKeyboardMarkup(
        keyboard=kb,
        resize_keyboard=True,
    )
    
    # Save user to database if not exists
    async with async_session() as session:
        user = await session.get(User, message.from_user.id)
        if not user:
            user = User(
                telegram_id=message.from_user.id,
                username=message.from_user.username,
                full_name=message.from_user.full_name,
            )
            session.add(user)
            await session.commit()
    
    await message.answer(
        f"Salom, {hbold(message.from_user.full_name)}!\n"
        f"Beauty Shop botiga xush kelibsiz!",
        reply_markup=keyboard,
    )

@user_router.message(F.text == "🛍 Katalog")
async def show_catalog(message: Message):
    """Show product categories"""
    async with async_session() as session:
        categories = await session.query(Category).all()
        
        kb = []
        for category in categories:
            kb.append([types.InlineKeyboardButton(
                text=category.name,
                callback_data=f"category_{category.id}"
            )])
        
        keyboard = types.InlineKeyboardMarkup(inline_keyboard=kb)
        
        await message.answer(
            "Kategoriyani tanlang:",
            reply_markup=keyboard
        )

@user_router.callback_query(F.data.startswith("category_"))
async def show_products(callback: CallbackQuery):
    """Show products in selected category"""
    category_id = int(callback.data.split("_")[1])
    
    async with async_session() as session:
        products = await session.query(Product).filter(Product.category_id == category_id).all()
        
        kb = []
        for product in products:
            kb.append([types.InlineKeyboardButton(
                text=f"{product.name} - {product.price:,.0f} so'm",
                callback_data=f"product_{product.id}"
            )])
        
        keyboard = types.InlineKeyboardMarkup(inline_keyboard=kb)
        
        await callback.message.answer(
            "Mahsulotni tanlang:",
            reply_markup=keyboard
        )
        await callback.answer()

@user_router.callback_query(F.data.startswith("product_"))
async def show_product(callback: CallbackQuery):
    """Show product details"""
    product_id = int(callback.data.split("_")[1])
    
    async with async_session() as session:
        product = await session.get(Product, product_id)
        
        kb = [
            [types.InlineKeyboardButton(
                text="🛒 Savatga qo'shish",
                callback_data=f"add_to_cart_{product.id}"
            )],
            [types.InlineKeyboardButton(
                text="⬅️ Orqaga",
                callback_data=f"category_{product.category_id}"
            )]
        ]
        keyboard = types.InlineKeyboardMarkup(inline_keyboard=kb)
        
        text = f"{hbold(product.name)}\n\n"
        text += f"Narxi: {product.price:,.0f} so'm\n"
        if product.original_price:
            text += f"Avvalgi narxi: {product.original_price:,.0f} so'm\n"
        if product.discount:
            text += f"Chegirma: {product.discount}%\n"
        text += f"\n{product.description}"
        
        await callback.message.answer_photo(
            photo=product.image,
            caption=text,
            reply_markup=keyboard
        )
        await callback.answer()

@user_router.message(F.text == "🛒 Savat")
async def show_cart(message: Message):
    """Show user's cart"""
    async with async_session() as session:
        # Get active order (cart)
        order = await session.query(Order).filter(
            Order.user_id == message.from_user.id,
            Order.status == "pending"
        ).first()
        
        if not order or not order.items:
            await message.answer("Savatingiz bo'sh!")
            return
        
        text = "Savatdagi mahsulotlar:\n\n"
        total = 0
        
        for item in order.items:
            product = item.product
            subtotal = item.quantity * item.price
            total += subtotal
            
            text += f"{hbold(product.name)}\n"
            text += f"{item.quantity} x {item.price:,.0f} = {subtotal:,.0f} so'm\n\n"
        
        text += f"\nUmumiy summa: {total:,.0f} so'm"
        
        kb = [
            [types.InlineKeyboardButton(
                text="🚚 Buyurtma berish",
                callback_data="checkout"
            )],
            [types.InlineKeyboardButton(
                text="🗑 Savatni tozalash",
                callback_data="clear_cart"
            )]
        ]
        keyboard = types.InlineKeyboardMarkup(inline_keyboard=kb)
        
        await message.answer(text, reply_markup=keyboard)

@user_router.callback_query(F.data == "checkout")
async def start_checkout(callback: CallbackQuery, state: FSMContext):
    """Start checkout process"""
    await state.set_state(OrderStates.waiting_for_location)
    
    await callback.message.answer(
        "Buyurtma berish uchun lokatsiyangizni yuboring:",
        reply_markup=types.ReplyKeyboardMarkup(
            keyboard=[[types.KeyboardButton(
                text="📍 Lokatsiyani yuborish",
                request_location=True
            )]],
            resize_keyboard=True
        )
    )
    await callback.answer()

@user_router.message(OrderStates.waiting_for_location)
async def process_location(message: Message, state: FSMContext):
    """Process user's location"""
    if not message.location:
        await message.answer("Iltimos, lokatsiyangizni yuboring!")
        return
    
    await state.update_data(location=f"{message.location.latitude},{message.location.longitude}")
    await state.set_state(OrderStates.waiting_for_phone)
    
    await message.answer(
        "Telefon raqamingizni yuboring:",
        reply_markup=types.ReplyKeyboardMarkup(
            keyboard=[[types.KeyboardButton(
                text="📱 Raqamni yuborish",
                request_contact=True
            )]],
            resize_keyboard=True
        )
    )

@user_router.message(OrderStates.waiting_for_phone)
async def process_phone(message: Message, state: FSMContext):
    """Process user's phone number"""
    if not message.contact:
        await message.answer("Iltimos, telefon raqamingizni yuboring!")
        return
    
    data = await state.get_data()
    location = data.get("location")
    
    async with async_session() as session:
        # Update order with contact info
        order = await session.query(Order).filter(
            Order.user_id == message.from_user.id,
            Order.status == "pending"
        ).first()
        
        if order:
            order.phone = message.contact.phone_number
            order.location = location
            order.status = "confirmed"
            await session.commit()
            
            # Send order details to admin
            admin_message = f"Yangi buyurtma #{order.id}\n\n"
            admin_message += f"Mijoz: {message.from_user.full_name}\n"
            admin_message += f"Telefon: {order.phone}\n"
            admin_message += f"Lokatsiya: {order.location}\n\n"
            
            total = 0
            for item in order.items:
                product = item.product
                subtotal = item.quantity * item.price
                total += subtotal
                
                admin_message += f"{product.name}\n"
                admin_message += f"{item.quantity} x {item.price:,.0f} = {subtotal:,.0f} so'm\n\n"
            
            admin_message += f"\nUmumiy summa: {total:,.0f} so'm"
            
            # TODO: Send to admin
            
            await message.answer(
                "Buyurtmangiz qabul qilindi! Tez orada siz bilan bog'lanamiz.",
                reply_markup=types.ReplyKeyboardMarkup(
                    keyboard=[[
                        types.KeyboardButton(text="🛍 Katalog"),
                        types.KeyboardButton(text="🛒 Savat"),
                    ]],
                    resize_keyboard=True
                )
            )
        else:
            await message.answer("Xatolik yuz berdi. Qaytadan urinib ko'ring!")
    
    await state.clear() 