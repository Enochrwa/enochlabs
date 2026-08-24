from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Base class for all ORM models. Import all models in db/models/__init__.py
    so Alembic's autogenerate can discover them via Base.metadata."""

    pass
