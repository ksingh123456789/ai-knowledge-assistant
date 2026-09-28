# AI Knowledge Assistant — FastAPI + LangChain + LangGraph + PostgreSQL/pgvector + React

A learning-friendly, production-structured RAG project.

## Architecture

React → FastAPI → LangGraph → Retriever → PostgreSQL + pgvector → LLM

Document ingestion:

TXT/PDF/DOCX → Loader → Chunker → Embeddings → PostgreSQL/pgvector

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

Supported file types:
- `.txt`
- `.pdf`
- `.docx`

Not supported:
- Legacy `.doc` (binary OLE format). Convert to `.docx` before uploading.
- Scanned/image-only PDFs. There is no OCR support — only PDFs with an embedded text layer will extract content.
- Any other extension (e.g. `.csv`, `.png`) is rejected with a descriptive 400 error.
- Empty/zero-byte or corrupted files of any supported extension are rejected with a descriptive 400 error rather than silently ingesting empty content.

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

## Adding a policy document

1. Place your source file (`.txt`, `.pdf`, or `.docx`) in `backend/sample_data/` or upload it via the frontend/`POST /api/documents/upload`.
2. Ingest it into the vector store using the upload endpoint, or by calling `ingest_file` directly for local files:

```bash
cd backend
python -c "from app.rag.ingestion import ingest_file; print(ingest_file('sample_data/refund_policy.docx', 'refund_policy.docx'))"
```

This prints the number of chunks created and written to PostgreSQL/pgvector.

3. Re-index all sample documents (repeat the command above for each file: `.txt`, `.pdf`, `.docx`) whenever their content changes.

## Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

DOCX support in production is provided solely by `docx2txt` (via `langchain_community.document_loaders.Docx2txtLoader`). `python-docx` is included only as a test-time dependency, used by the test suite to programmatically build `.docx` fixture files — it is not exercised by the production ingestion path.

## Run tests

```bash
cd backend
pytest
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

## Known limitations

- No OCR: scanned/image-only PDFs will not yield extracted text.
- Legacy `.doc` files (pre-2007 binary Word format) are not supported; convert to `.docx` first.
- DOCX extraction is plain-text only — embedded images, tables, headers/footers, and complex formatting are not preserved, only the textual content is extracted.
- Empty or invalid/corrupted files (zero-byte or unreadable) for any supported extension raise a clear error rather than being silently ingested as empty content.

## Learning order

1. Run the app.
2. Upload a TXT/PDF/DOCX.
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
