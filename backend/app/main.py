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


app.include_router(documents_router, prefix="/api/documents", tags=["documents"])
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])
