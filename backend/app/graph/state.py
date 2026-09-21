from typing import TypedDict

from langchain_core.documents import Document


class GraphState(TypedDict):
    question: str
    search_query: str
    context: list[Document]
    answer: str
    attempts: int
    model: str | None
    api_key: str | None
