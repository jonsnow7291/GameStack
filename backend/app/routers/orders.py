from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.models import Game, Order, User
from app.schemas import CheckoutPayload, OrderResponse, SalesReport


router = APIRouter(tags=["orders"])


@router.post("/orders/checkout", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def checkout(
    payload: CheckoutPayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "customer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only customers can checkout")

    if not payload.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty")

    order_items = []
    total = 0.0

    for item in payload.items:
        game = db.query(Game).filter(Game.id == item.game_id).with_for_update().first()
        if not game:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Game {item.game_id} not found")
        if game.stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for {game.title}",
            )

        game.stock -= item.quantity
        subtotal = round(game.price * item.quantity, 2)
        total += subtotal
        order_items.append(
            {
                "gameId": game.id,
                "title": game.title,
                "price": game.price,
                "quantity": item.quantity,
                "subtotal": subtotal,
            }
        )

    order = Order(user_id=current_user.id, items=order_items, total=round(total, 2))
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.get("/orders/me", response_model=list[OrderResponse])
def my_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.id.desc()).all()


@router.get("/admin/reports/sales", response_model=SalesReport)
def sales_report(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    orders = db.query(Order).all()
    revenue = round(sum(order.total for order in orders), 2)
    return SalesReport(total_orders=len(orders), total_revenue=revenue)
