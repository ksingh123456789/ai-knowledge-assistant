import shutil
import tempfile
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.rag.ingestion import ingest_file

router = APIRouter()

SUPPORTED_EXTENSIONS = {".pdf", ".txt", ".docx"}


@router.post("/upload")
def upload_document(file: UploadFile = File(...)):
    extension = Path(file.filename or "").suffix.lower()

    if extension == ".doc":
        raise HTTPException(
            status_code=400,
            detail="Legacy .doc files are not supported. Please use .docx instead.",
        )

    if extension not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Unsupported file extension '{extension or '(none)'}'. "
                "Only .pdf, .txt, and .docx files are supported."
            ),
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
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    finally:
        Path(temporary_path).unlink(missing_ok=True)

    return {
        "filename": file.filename,
        "chunks_created": chunk_count,
    }
