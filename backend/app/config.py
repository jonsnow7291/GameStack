import os

from dotenv import load_dotenv


load_dotenv()


class Settings:
    database_url: str = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://root:password@localhost:3306/gamestack",
    )
    secret_key: str = os.getenv("SECRET_KEY", "change-this-secret-key")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "120"))
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:5173")


settings = Settings()
