from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_admin
from app.models import Game
from app.schemas import GameCreate, GameResponse, GameUpdate


router = APIRouter(prefix="/games", tags=["games"])


@router.get("", response_model=list[GameResponse])
def get_games(db: Session = Depends(get_db)):
    return db.query(Game).order_by(Game.id.desc()).all()


@router.post("", response_model=GameResponse, status_code=status.HTTP_201_CREATED)
def create_game(payload: GameCreate, _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    game = Game(**payload.model_dump(by_alias=False))
    db.add(game)
    db.commit()
    db.refresh(game)
    return game


@router.put("/{game_id}", response_model=GameResponse)
def update_game(
    game_id: int,
    payload: GameUpdate,
    _: dict = Depends(require_admin),
    db: Session = Depends(get_db),
):
    game = db.query(Game).filter(Game.id == game_id).first()
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")

    for field, value in payload.model_dump(exclude_unset=True, by_alias=False).items():
        setattr(game, field, value)

    db.commit()
    db.refresh(game)
    return game


@router.delete("/{game_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_game(game_id: int, _: dict = Depends(require_admin), db: Session = Depends(get_db)):
    game = db.query(Game).filter(Game.id == game_id).first()
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
    db.delete(game)
    db.commit()
