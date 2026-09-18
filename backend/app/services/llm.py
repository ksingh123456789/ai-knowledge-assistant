from langchain_openai import ChatOpenAI

from app.core.config import settings


def get_llm() -> ChatOpenAI:
    return ChatOpenAI(
        model=settings.model_name,
        api_key=settings.openrouter_api_key,
        base_url=settings.openrouter_base_url,
        temperature=0,
        default_headers={
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": settings.app_name,
        },
    )
