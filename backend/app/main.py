from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router as chat_router
from app.api.documents import router as documents_router
from app.core.config import settings
from app.db.database import init_db

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="RAG assistant using FastAPI, LangChain, LangGraph and PostgreSQL + pgvector.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}

from pydantic import BaseModel
import redis
import json

class TicketRequest(BaseModel):
    ticket_id: str
    requirement: str

@app.post("/api/start-ticket")
def start_ticket(request: TicketRequest) -> dict[str, str]:
    print(f"Received request to start AI agent for ticket: {request.ticket_id}")
    
    # 1. Connect to Redis (Synchronous for simplicity in this endpoint)
    # Note: In production, you might want to use aioredis/redis.asyncio and await it.
    redis_client = redis.Redis.from_url("redis://localhost:6379")
    
    # 2. Prepare the Job Payload
    job_data = {
        "ticket_id": request.ticket_id,
        "requirement": request.requirement
    }
    
    # 3. Push to Redis List ('agent_jobs')
    # lpush = Left Push (adds to the beginning of the queue)
    redis_client.lpush("agent_jobs", json.dumps(job_data))
    
    return {"message": f"Ticket {request.ticket_id} has been queued for the AI Agent!", "ticket_id": request.ticket_id}

app.include_router(documents_router, prefix="/api/documents", tags=["documents"])
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])
