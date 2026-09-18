import shutil
import tempfile
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.rag.ingestion import ingest_file

router = APIRouter()


@router.post("/upload")
def upload_document(file: UploadFile = File(...)):
    extension = Path(file.filename or "").suffix.lower()

    if extension not in {".pdf", ".txt"}:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and TXT files are supported.",
        )

    with tempfile.NamedTemporaryFile(
        suffix=extension,
        delete=False,
    ) as temporary_file:
        shutil.copyfileobj(file.file, temporary_file)
        temporary_path = temporary_file.name

    try:
        chunk_count = ingest_file(
            path=temporary_path,
            source_name=file.filename or "uploaded-file",
        )
    finally:
        Path(temporary_path).unlink(missing_ok=True)

    return {
        "filename": file.filename,
        "chunks_created": chunk_count,
    }
