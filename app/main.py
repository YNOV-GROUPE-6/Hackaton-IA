from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests

app = FastAPI()

OLLAMA_URL = "https://silliness-puma-embassy.ngrok-free.dev"
MODEL = "phi3-financial:latest"


class ChatRequest(BaseModel):
    prompt: str


@app.get("/")
def root():
    return {"message": "TechCorp API running"}


@app.post("/chat")
def chat(req: ChatRequest):
    prompt = req.prompt

    if not prompt or len(prompt) > 2000:
        raise HTTPException(status_code=400, detail="Invalid prompt")

    try:
        response = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model": MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.2,
                    "top_p": 0.9,
                    "num_predict": 512
                }
            },
            timeout=30
        )

        data = response.json()

        return {
            "response": data.get("response", "").strip()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))