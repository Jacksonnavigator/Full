"""
Database Configuration
SQLAlchemy session and engine setup
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.config import settings

# ============================================================
# Database Engine
# ============================================================

engine = create_engine(
    settings.database_url,
    echo=settings.debug,  # Print SQL queries in development
    pool_pre_ping=True,  # Verify connection before using
)

# ============================================================
# Database Session Factory
# ============================================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# ============================================================
# Dependency for FastAPI
# ============================================================

def get_db() -> Session:
    """
    Get database session for use in FastAPI dependencies
    
    Usage in routes:
        @app.get("/items")
        def get_items(db: Session = Depends(get_db)):
            return db.query(Item).all()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
