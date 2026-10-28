from werkzeug.security import check_password_hash
from flask_login import UserMixin


class User(UserMixin):
    # IMPORTANTE: __init__ NO lleva @classmethod.
    # Con @classmethod los datos se guardaban en la clase y no en cada usuario,
    # así que todos los objetos User compartían el mismo id, nombre, perfil, etc.
    def __init__(self, id, nombre, correo, clave, perfil) -> None:
        self.id     = id
        self.nombre = nombre
        self.correo = correo
        self.clave  = clave
        self.perfil = perfil

    @staticmethod
    def validarClave(claveCifrada, clave):
        return check_password_hash(claveCifrada, clave)
