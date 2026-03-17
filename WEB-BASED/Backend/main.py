#!/usr/bin/env python3
"""
HydraNet Backend - Entry Point
Run this file to start the FastAPI server
"""

if __name__ == "__main__":
    import uvicorn
    from app.config import settings

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info",
    )
