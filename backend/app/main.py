from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import auth, games, orders


Base.metadata.create_all(bind=engine)

app = FastAPI(title="GameStack API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(games.router)
app.include_router(orders.router)


@app.get("/")
def healthcheck():
    return {"message": "GameStack API running"}
