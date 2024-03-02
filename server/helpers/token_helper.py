import jwt
from fastapi import HTTPException
from starlette import status


class TokenHelper:
    """
    class in charge of helping with token related computations
    """
    def __init__(self):
        import os
        from dotenv import load_dotenv
        load_dotenv()
        self.SECRET_KEY = os.getenv("SECRET_KEY")

    def create_token(self, payload):
        token = jwt.encode(payload, self.SECRET_KEY, algorithm="HS256")
        return token

    def decode_token(self, token):
        try:
            payload = jwt.decode(token, self.SECRET_KEY, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            # Handle expired token
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token.",
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Something went wrong.",
            )