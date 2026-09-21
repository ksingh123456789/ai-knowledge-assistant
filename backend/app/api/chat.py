from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.graph.nodes import build_source_payload
from app.graph.workflow import graph

router = APIRouter()


class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=4000)
    model: str | None = None
    api_key: str | None = None


class ChatResponse(BaseModel):
    answer: str
    sources: list[dict]


@router.post("", response_model=ChatResponse)
def chat(request: ChatRequest):
    result = graph.invoke(
        {
            "question": request.question,
            "search_query": "",
            "context": [],
            "answer": "",
            "attempts": 0,
            "model": request.model,
            "api_key": request.api_key,
        }
    )

    return ChatResponse(
        answer=result["answer"],
        sources=build_source_payload(result["context"]),
    )
