from .dummy import database


class DBHelper:
    def __init__(self):
        pass

    def user_exists(self, username):
        return username in database
    
    def get_password_hash(self, username):
        return database[username]["pwhash"]

    def get_organization(self, username):
        return database[username]["organization"]

