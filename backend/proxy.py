from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS sozlamalari
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Proksi server
@app.get("/{path:path}")
async def proxy(path: str, request: Request):
    # Frontend URL (Vite server)
    target_url = f"http://localhost:5174/{path}"
    
    async with httpx.AsyncClient() as client:
        # Ngrok headerlarini qo'shamiz
        headers = {
            "ngrok-skip-browser-warning": "true",
            "User-Agent": "TelegramWebApp"
        }
        
        # So'rovni yuborish
        response = await client.get(target_url, headers=headers)
        
        return StreamingResponse(
            response.iter_bytes(),
            status_code=response.status_code,
            headers=dict(response.headers)
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 