from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.graph.nodes import build_source_payload
from app.graph.workflow import graph

router = APIRouter()

RATE_LIMIT_MESSAGE = (
    "The selected model is temporarily rate-limited. "
    "Please retry shortly or select another model."
)


class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=4000)
    model: str | None = None
    api_key: str | None = None


class ChatResponse(BaseModel):
    answer: str
    sources: list[dict]


def _is_rate_limit_error(exc: Exception) -> bool:
    """Detect rate-limit (HTTP 429) errors generically.

    Checks for known OpenAI/LangChain rate-limit exception types as well as
    any exception carrying a status_code/response.status_code of 429, so
    that we don't rely solely on a single exception class name.
    """
    try:
        import openai

        if isinstance(exc, openai.RateLimitError):
            return True
    except ImportError:
        pass

    status_code = getattr(exc, "status_code", None)
    if status_code == 429:
        return True

    response = getattr(exc, "response", None)
    if response is not None and getattr(response, "status_code", None) == 429:
        return True

    body = getattr(exc, "body", None)
    if isinstance(body, dict) and body.get("code") == 429:
        return True

    return False


@router.post("", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
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
    except Exception as exc:
        if _is_rate_limit_error(exc):
            raise HTTPException(
                status_code=429,
                detail=RATE_LIMIT_MESSAGE,
            ) from None
        raise

    return ChatResponse(
        answer=result["answer"],
        sources=build_source_payload(result["context"]),
    )
