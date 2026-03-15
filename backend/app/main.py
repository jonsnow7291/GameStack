import logging
import traceback

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

from app.config import settings
from app.database import Base, engine
from app.routers import auth, games, orders


Base.metadata.create_all(bind=engine)

app = FastAPI(title="GameStack API")

# Lista de orígenes permitidos en desarrollo
ALLOWED_ORIGINS = [
    settings.frontend_url,          # valor del .env / config (por defecto http://localhost:5173)
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Garantiza que los headers CORS se incluyan incluso en errores 500 no controlados."""
    logger.error("Unhandled exception on %s %s", request.method, request.url)
    logger.error(traceback.format_exc())
    origin = request.headers.get("origin", "")
    headers = {}
    if origin in ALLOWED_ORIGINS:
        headers["Access-Control-Allow-Origin"] = origin
        headers["Access-Control-Allow-Credentials"] = "true"
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},   # muestra el error real en desarrollo
        headers=headers,
    )

app.include_router(auth.router)
app.include_router(games.router)
app.include_router(orders.router)


@app.get("/")
def healthcheck():
    return {"message": "GameStack API running"}
