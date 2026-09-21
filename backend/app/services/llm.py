from typing import Optional

from langchain_openai import ChatOpenAI

from app.core.config import settings


def get_llm(
    model_name: Optional[str] = None,
    api_key: Optional[str] = None,
) -> ChatOpenAI:
    resolved_model = model_name if model_name else settings.model_name
    resolved_api_key = api_key if api_key else settings.openrouter_api_key

    return ChatOpenAI(
        model=resolved_model,
        api_key=resolved_api_key,
        base_url=settings.openrouter_base_url,
        temperature=0,
        default_headers={
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": settings.app_name,
        },
    )
