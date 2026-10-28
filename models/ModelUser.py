from models.entities.User import User


class ModelUser:

    @classmethod
    def signin(cls, db, usuario):
        """Busca el usuario por correo y valida la contraseña.
        Regresa None si no existe; si existe, el campo clave queda en
        True (contraseña correcta) o False (incorrecta)."""
        try:
            selUsuario = db.connection.cursor()
            selUsuario.execute(
                "SELECT id, nombre, correo, clave, perfil FROM usuario WHERE correo = %s",
                (usuario.correo,)
            )
            u = selUsuario.fetchone()
            selUsuario.close()
            if u is not None:
                return User(u[0], u[1], u[2], User.validarClave(u[3], usuario.clave), u[4])
            return None
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_by_id(cls, db, id):
        try:
            selUsuario = db.connection.cursor()
            selUsuario.execute(
                "SELECT id, nombre, correo, clave, perfil FROM usuario WHERE id = %s",
                (id,)
            )
            u = selUsuario.fetchone()
            selUsuario.close()
            if u is not None:
                return User(u[0], u[1], u[2], u[3], u[4])
            return None
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def existe_correo(cls, db, correo):
        try:
            selUsuario = db.connection.cursor()
            selUsuario.execute("SELECT id FROM usuario WHERE correo = %s", (correo,))
            u = selUsuario.fetchone()
            selUsuario.close()
            return u is not None
        except Exception as ex:
            raise Exception(ex)
