import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import os
import requests
from dotenv import load_dotenv
load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN")
GROUP_CHAT_ID = os.getenv("GROUP_CHAT_ID")

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
PRODUCTS_FILE = os.path.join(DATA_DIR, "products.json")
CATEGORIES_FILE = os.path.join(DATA_DIR, "categories.json")
USERS_FILE = os.path.join(DATA_DIR, "users.json")
ORDERS_FILE = os.path.join(DATA_DIR, "orders.json")

app = FastAPI()

# CORS (frontend uchun)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import datetime
from apscheduler.schedulers.background import BackgroundScheduler

def read_json(file_path):
    if not os.path.exists(file_path):
        return []
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def write_json(file_path, data):
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def send_order_to_group(order, order_number):
    # 1. Lokatsiyani yuborish
    loc = order.get('customerInfo', {}).get('location', '')
    try:
        if loc and ',' in loc:
            lat, lon = map(float, loc.split(','))
            url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendLocation"
            payload = {
                "chat_id": GROUP_CHAT_ID,
                "latitude": lat,
                "longitude": lon
            }
            r = requests.post(url, json=payload, timeout=5)
            print("Telegram location javobi:", r.text)
    except Exception as e:
        print("Telegram location xatolik:", e)

    # 2. Matnli xabar
    text = (
        f"🛒 #{order_number}-chi buyurtma!\n"
        f"Ism: {order.get('customerInfo', {}).get('name', '-') }\n"
        f"Telefon: {order.get('customerInfo', {}).get('phone', '-') }\n"
        f"Manzil: {order.get('customerInfo', {}).get('address', '-') }\n"
        f"Mahsulotlar:\n"
    )
    for item in order.get('items', []):
        name = item.get('name', '')
        quantity = item.get('quantity', 1)
        price = item.get('price') or item.get('product', {}).get('price') or 0
        subtotal = int(price) * int(quantity)
        text += f"- {name} {quantity} dona = {subtotal} so‘m\n"
    text += f"\nJami: {order.get('total', 0)} so‘m"
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": GROUP_CHAT_ID,
        "text": text
    }
    try:
        r = requests.post(url, json=payload, timeout=5)
        print("Telegram API javobi:", r.text)
    except Exception as e:
        print("Telegram API xatolik:", e)

def send_daily_stats():
    try:
        now = datetime.datetime.now()
        today_13 = now.replace(hour=13, minute=0, second=0, microsecond=0)
        if now >= today_13:
            start = today_13 - datetime.timedelta(days=1)
            end = today_13
        else:
            start = today_13 - datetime.timedelta(days=2)
            end = today_13 - datetime.timedelta(days=1)
        orders = read_json(ORDERS_FILE)
        product_stats = {}
        total_sum = 0
        total_orders = 0
        customer_orders = []
        for order in orders:
            created = order.get('created_at')
            if created:
                try:
                    created_dt = datetime.datetime.fromisoformat(created)
                except Exception:
                    continue
                if not (start <= created_dt < end):
                    continue
            total_orders += 1
            order_sum = 0
            customer_name = order.get('customerInfo', {}).get('name', 'Noma\'lum')
            order_id = order.get('id', 'N/A')
            for item in order.get('items', []):
                name = item.get('name', '')
                quantity = int(item.get('quantity', 1))
                price = int(item.get('price', 0))
                item_total = quantity * price
                order_sum += item_total
                if name not in product_stats:
                    product_stats[name] = {'quantity': 0, 'total': 0}
                product_stats[name]['quantity'] += quantity
                product_stats[name]['total'] += item_total
            total_sum += order_sum
            items_str = ', '.join([f"{item.get('name', '')} — {item.get('quantity', 1)} dona" for item in order.get('items', [])])
            customer_orders.append(f"{customer_name} (#{order_id}): {items_str}")
        if not product_stats:
            stats_text = 'So\'nggi 24 soatda buyurtmalar yo\'q.'
        else:
            stats_text = f'📊 So\'nggi 24 soat (13:00–13:00) buyurtmalar statistikasi:\n\n'
            stats_text += 'Mahsulotlar:\n'
            for name, data in product_stats.items():
                stats_text += f'{name} — {data["quantity"]} dona, {data["total"]} so\'m\n'
            stats_text += f'\nJami buyurtmalar: {total_orders} ta\n'
            stats_text += f'Jami summa: {total_sum} so\'m\n'
            if customer_orders:
                stats_text += '\nMijozlar:\n'
                for customer_order in customer_orders:
                    stats_text += f'- {customer_order}\n'
        url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": GROUP_CHAT_ID,
            "text": stats_text
        }
        r = requests.post(url, json=payload, timeout=5)
        print("Kunlik statistika yuborildi:", r.text)
    except Exception as e:
        print("Kunlik statistika xatolik:", e)

# --- Scheduler ---
scheduler = BackgroundScheduler()
scheduler.add_job(send_daily_stats, 'cron', hour=13, minute=0)
scheduler.start()

# --- PRODUCTS ---
@app.get("/products")
def get_products():
    return read_json(PRODUCTS_FILE)

@app.post("/products")
def add_product(product: Dict):
    mapped_product = {
        "id": str(product.get("id")),
        "name": product.get("name"),
        "description": product.get("description", ""),
        "price": product.get("price", 0),
        "original_price": product.get("original_price", 0),
        "discount": product.get("discount", 0),
        "image": product.get("image", ""),
        "category_id": product.get("category_id"),
        "in_stock": product.get("inStock", True),
        "rating": product.get("rating", 0),
        "reviews_count": product.get("reviews_count", 0),
        "tannarxi": product.get("tannarxi", 0)
    }
    products = read_json(PRODUCTS_FILE)
    products.append(mapped_product)
    write_json(PRODUCTS_FILE, products)
    return mapped_product

@app.delete("/products/{product_id}")
def delete_product(product_id: str):
    products = read_json(PRODUCTS_FILE)
    products = [p for p in products if str(p.get("id")) != str(product_id)]
    write_json(PRODUCTS_FILE, products)
    return {"success": True}

# --- CATEGORIES ---
@app.get("/categories")
def get_categories():
    return read_json(CATEGORIES_FILE)

@app.post("/categories")
def add_category(category: Dict):
    mapped_category = {
        "id": str(category.get("id")),
        "name": category.get("name", ""),
        "icon": category.get("icon", ""),
        "image": category.get("image", ""),
        "productCount": category.get("productCount", 0)
    }
    categories = read_json(CATEGORIES_FILE)
    categories.append(mapped_category)
    write_json(CATEGORIES_FILE, categories)
    return mapped_category

@app.delete("/categories/{category_id}")
def delete_category(category_id: str):
    categories = read_json(CATEGORIES_FILE)
    categories = [c for c in categories if str(c.get("id")) != str(category_id)]
    write_json(CATEGORIES_FILE, categories)
    return {"success": True}

# --- USERS ---
@app.get("/users")
def get_users():
    return read_json(USERS_FILE)

@app.post("/users")
def add_user(user: Dict):
    users = read_json(USERS_FILE)
    users.append(user)
    write_json(USERS_FILE, users)
    return user 

# --- ORDERS ---
@app.get("/orders")
def get_orders():
    return read_json(ORDERS_FILE)

@app.post("/orders")
def add_order(order: Dict):
    orders = read_json(ORDERS_FILE)
    order_id = len(orders) + 1
    order['id'] = order_id
    orders.append(order)
    write_json(ORDERS_FILE, orders)
    send_order_to_group(order, order_id)
    return {"message": f"Buyurtma muvaffaqiyatli yuborildi! #{order_id}-chi buyurtma. Tez orada siz bilan bog'lanamiz."} 