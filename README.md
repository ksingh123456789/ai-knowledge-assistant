# AI Knowledge Assistant — FastAPI + LangChain + LangGraph + PostgreSQL/pgvector + React

A learning-friendly, production-structured RAG project.

## Architecture

React → FastAPI → LangGraph → Retriever → PostgreSQL + pgvector → LLM

Document ingestion:

PDF/TXT → Loader → Chunker → Embeddings → PostgreSQL/pgvector

LangSmith traces the LangChain/LangGraph execution.

## Why PostgreSQL + pgvector instead of Qdrant?

For this project, PostgreSQL + pgvector is the recommended choice because:
- You already want PostgreSQL.
- Documents, metadata, users, application data, and vectors can live in one database.
- SQL + vector similarity can be combined.
- Fewer infrastructure services to learn/deploy.
- Excellent for learning RAG with real database concepts.

Qdrant is a very good dedicated vector database. Choose it when vector search is a major independent workload, you need its vector-native features at scale, or your architecture intentionally separates transactional data from retrieval infrastructure.

Do NOT run both for this project. Start with PostgreSQL + pgvector. You can add Qdrant later as a comparison exercise.

## Requirements

- Python 3.11+
- Node.js 20+
- Docker Desktop
- An OpenRouter API key
- Optional LangSmith API key

## 1. Backend

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
```

Start PostgreSQL:

```bash
cd ..
docker compose up -d postgres
```

Run API:

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

API docs:
http://localhost:8000/docs

## 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## 3. Configure .env

Copy `.env.example` to `.env` and add your own credentials.

IMPORTANT: never commit `.env`.

## 4. Use the API

### Health

GET `/health`

### Upload a document

POST `/api/documents/upload`

Multipart form field:
`file`

Supported initially:
- `.txt`
- `.pdf`

### Chat

POST `/api/chat`

```json
{
  "question": "What is the refund policy for annual plans?"
}
```

Response:

```json
{
  "answer": "...",
  "sources": [
    {
      "content": "...",
      "source": "refund_policy.pdf",
      "page": 1
    }
  ]
}
```

## Graph

The current LangGraph is intentionally simple:

START
  ↓
retrieve
  ↓
grade_context
  ├── useful → generate
  └── not useful → rewrite → retrieve
                           ↓
                         generate
                           ↓
                          END

The graph state carries:
- question
- search_query
- context
- answer
- attempts

## Learning order

1. Run the app.
2. Upload a TXT/PDF.
3. Inspect the chunks in PostgreSQL.
4. Test retrieval.
5. Understand embeddings.
6. Understand the LangGraph state/nodes/edges.
7. Add LLM generation.
8. Inspect LangSmith traces.
9. Add query rewriting.
10. Add evaluation, authentication, streaming, and production hardening.

## Security

The credentials shown in your message should be treated as exposed. Rotate/revoke them and create fresh keys. This repository intentionally contains placeholders only.
