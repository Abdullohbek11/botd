import os
from aiogram import Bot, Dispatcher, types
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils.markdown import hbold
from dotenv import load_dotenv
import asyncio

load_dotenv()
TOKEN = os.getenv("BOT_TOKEN")
WEBAPP_URL = os.getenv("WEBAPP_URL")
GROUP_CHAT_ID_STR = os.getenv("GROUP_CHAT_ID")

# Xavfsiz int ga o'tkazish
if GROUP_CHAT_ID_STR:
    GROUP_CHAT_ID = int(GROUP_CHAT_ID_STR)
else:
    print("ERROR: GROUP_CHAT_ID not found in .env file")
    GROUP_CHAT_ID = None

bot = Bot(TOKEN, parse_mode=ParseMode.HTML)
dp = Dispatcher()

def order_text(order_data: dict) -> str:
    text = (
        f"🛒 <b>Yangi buyurtma!</b>\n"
        f"<b>Ism:</b> {order_data.get('customerInfo', {}).get('name', '-')}\n"
        f"<b>Telefon:</b> {order_data.get('customerInfo', {}).get('phone', '-')}\n"
        f"<b>Manzil:</b> {order_data.get('customerInfo', {}).get('address', '-')}\n"
        f"<b>Joylashuv:</b> {order_data.get('customerInfo', {}).get('location', '-')}\n"
        f"<b>Mahsulotlar:</b>\n"
    )
    for item in order_data.get('items', []):
        text += f"- {item.get('name', '')} x {item.get('quantity', 1)}\n"
    text += f"\n<b>Jami:</b> {order_data.get('total', 0)} so'm"
    return text

async def send_order_to_group(order_data: dict):
    if GROUP_CHAT_ID is None:
        print("ERROR: GROUP_CHAT_ID is not set")
        return
    
    text = order_text(order_data)
    await bot.send_message(GROUP_CHAT_ID, text)

@dp.message(CommandStart())
async def command_start_handler(message: Message) -> None:
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(
                text="🛍 Do'konni ochish",
                web_app=WebAppInfo(url=WEBAPP_URL)
            )]
        ]
    )
    await message.answer(
        f"Salom, {hbold(message.from_user.full_name)}!\n"
        f"Beauty Shop botiga xush kelibsiz!\n\n"
        f"Do'konni ochish uchun pastdagi tugmani bosing 👇",
        reply_markup=keyboard
    )

@dp.message(Command("testorder"))
async def test_order(message: Message):
    order_data = {
        "customerInfo": {
            "name": "Test Foydalanuvchi",
            "phone": "+998901234567",
            "address": "Toshkent, Chilonzor",
            "location": "41.2995, 69.2401"
        },
        "items": [
            {"name": "Olma", "quantity": 2},
            {"name": "Banan", "quantity": 1}
        ],
        "total": 35000
    }
    await send_order_to_group(order_data)
    await message.answer("Buyurtma xabari guruhga yuborildi!")

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main()) 