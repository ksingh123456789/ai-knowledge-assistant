from sqlalchemy import create_engine, text
from app.core.config import settings


engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
)


def init_db():
    with engine.connect() as connection:
        connection.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        connection.commit()