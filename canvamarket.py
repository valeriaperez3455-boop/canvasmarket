from flask import Flask, render_template, request, redirect, url_for, flash
from flask_mysqldb import MySQL
from flask_login import LoginManager, login_user, login_required, current_user, logout_user
from config import config
from werkzeug.security import generate_password_hash
from models.entities.User import User
from models.ModelUser import ModelUser


canvamarketApp  = Flask(__name__)
canvamarketApp.config.from_object(config['development'])

db              = MySQL(canvamarketApp)
adminUsuarios   = LoginManager(canvamarketApp)

# Si alguien entra a una página protegida sin sesión, lo regresamos al inicio
adminUsuarios.login_view = 'home'
adminUsuarios.login_message = 'Inicia sesión para continuar'


@adminUsuarios.user_loader
def agregarUsuario(id):
    return ModelUser.get_by_id(db, id)


def ir_a_su_inicio(usuario):
    """Manda a cada perfil a su página principal."""
    if usuario.perfil == 'A':
        return redirect(url_for('home_admin'))
    return redirect(url_for('home_user'))


@canvamarketApp.route('/')
def home():
    # Si ya inició sesión, lo mandamos a su página
    if current_user.is_authenticated:
        return ir_a_su_inicio(current_user)
    return render_template('home.html')


@canvamarketApp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        nombre = request.form.get('nombre', '').strip()
        correo = request.form.get('correo', '').strip()
        clave  = request.form.get('clave', '')

        if not nombre or not correo or not clave:
            flash('Completa todos los campos para registrarte', 'register')
            return redirect(url_for('home'))

        if ModelUser.existe_correo(db, correo):
            flash('Ese correo ya está registrado', 'register')
            return redirect(url_for('home'))

        claveCifrada = generate_password_hash(clave)
        regUsuario = db.connection.cursor()
        regUsuario.execute(
            "INSERT INTO usuario (nombre, correo, clave) VALUES (%s, %s, %s)",
            (nombre, correo, claveCifrada)
        )
        db.connection.commit()
        regUsuario.close()

        flash('Cuenta creada, ahora inicia sesión', 'login_ok')
        return redirect(url_for('home'))

    # GET: no hay página propia de registro, el formulario vive en el modal
    return redirect(url_for('home'))


@canvamarketApp.route('/signin', methods=['GET', 'POST'])
def signin():
    if request.method == 'POST':
        correo = request.form.get('correo', '').strip()
        clave  = request.form.get('clave', '')

        usuario = User(0, None, correo, clave, None)
        usuarioAutenticado = ModelUser.signin(db, usuario)

        if usuarioAutenticado is None:
            flash('Usuario inexistente', 'login')
            return redirect(url_for('home'))

        if not usuarioAutenticado.clave:
            flash('Contraseña incorrecta', 'login')
            return redirect(url_for('home'))

        recordar = request.form.get('remember') is not None
        login_user(usuarioAutenticado, remember=recordar)
        return ir_a_su_inicio(usuarioAutenticado)

    # GET: el login está en el modal de la página de inicio
    return redirect(url_for('home'))


@canvamarketApp.route('/signout', methods=['GET', 'POST'])
def signout():
    logout_user()
    return redirect(url_for('home'))


@canvamarketApp.route('/home_admin', methods=['GET', 'POST'])
@login_required
def home_admin():
    if current_user.perfil != 'A':
        return redirect(url_for('home_user'))
    return render_template('admin.html')


@canvamarketApp.route('/home_user', methods=['GET', 'POST'])
@login_required
def home_user():
    if current_user.perfil == 'A':
        return redirect(url_for('home_admin'))
    return render_template('user.html')

@canvamarketApp.route('/sUsuario', methods=['GET', 'POST'])
@login_required
def sUsuario():
    if current_user.perfil == 'A':
        selUsuario = db.connection.cursor()
        selUsuario.execute("SELECT * FROM usuario")
        u = selUsuario.fetchall()
        selUsuario.close()
        return render_template('users.html', usuarios = u)
    else:
        return render_template('home.html')


if __name__ == '__main__':
    canvamarketApp.run(port=5812)
