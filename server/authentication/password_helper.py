import bcrypt


class PasswordHelper:
    def __init__(self):
        import os
        from dotenv import load_dotenv
        load_dotenv()
        self.SECRET_KEY = os.getenv("SECRET_KEY")

    def hash(self, password):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    def compare_to_hash(self, password, hash):
        return bcrypt.checkpw(password.encode('utf-8'), hash)