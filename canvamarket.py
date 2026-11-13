from flask import Flask, render_template, request, redirect, url_for, flash
from flask_mysqldb import MySQL
from flask_login import LoginManager, login_user, login_required, current_user, logout_user
from config import config
from werkzeug.security import generate_password_hash
from models.entities.User import User
from models.ModelUser import ModelUser



canvamarketApp = Flask(__name__)
canvamarketApp.config.from_object(config['development'])
db      = MySQL(canvamarketApp)
adminUsuarios = LoginManager (canvamarketApp)

@adminUsuarios.user_loader
def agregarUsuario(id):
    return ModelUser.get_by_id(db,id) 

@canvamarketApp.route('/')
def home():
    return render_template('home.html')
@canvamarketApp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        nombre  = request.form['nombre']
        correo  = request.form['correo']
        clave   = request.form['clave']
        claveCifrada = generate_password_hash(clave)
        regUsuario = db.connection.cursor()
        regUsuario.execute("INSERT INTO usuario (nombre,correo,clave) VALUES (%s,%s,%s)", (nombre,correo,claveCifrada))

        db.connection.commit()
        regUsuario.close()
        return redirect(url_for('home'))
    else:
        return redirect(url_for('home'))

@canvamarketApp.route('/signin', methods = ['GET', 'POST'])
def signin():
    if request.method == 'POST':
        usuario = User(0,None,request.form['correo'], request.form['clave'],None)
        usuarioAutenticado = ModelUser.signin(db,usuario)
        if usuarioAutenticado is not None:
            if usuarioAutenticado.clave:
                login_user(usuarioAutenticado)
                if usuarioAutenticado.perfil == 'A':
                    return redirect (url_for('home_admin'))
                else:
                    return redirect (url_for('home_user'))
            else:
                flash('contraseña incorrecta')
                return redirect(url_for('home'))
        else:
            flash('Usuario inexistente')
            return redirect(url_for('home'))
    else:
        return render_template('home.html')

@canvamarketApp.route('/signout', methods = ['GET', 'POST'])
def signout():
    logout_user()
    return redirect(url_for('home'))

@canvamarketApp.route('/home_admin', methods = ['GET', 'POST'])
@login_required
def home_admin():
    return render_template ('home_admin.html')

@canvamarketApp.route('/home_user', methods = ['GET', 'POST'])
@login_required
def home_user():
    return render_template ('home_user.html')

@canvamarketApp.route('/sUsuario', methods = ['GET', 'POST'])
@login_required
def sUsuario():
    if current_user.perfil == 'A':
        selUsuario = db.connection.cursor()
        selUsuario.execute("SELECT * FROM usuario")
        U = selUsuario.fetchall()
        selUsuario.close()
        return render_template ('users.html', usuarios = U)
    else:
        return render_template('home.html')

@canvamarketApp.route('/uUsuario/<int:id>', methods = ['GET', 'POST'])
@login_required
def uUsuario(id):
    if current_user.perfil == 'A':
        nombre = request.form ['nombre']
        correo = request.form ['correo']
        perfil = request.form ['perfil']
        actUsuario = db.connection.cursor()
        actUsuario.execute("UPDATE usuario SET nombre = %s, correo = %s, perfil = %s WHERE id = %s", (nombre,correo,perfil,id))
        db.connection.commit()
        actUsuario.close()
        flash ('Registro Actualizado')
        return redirect(url_for('sUsuario'))
    else:
        return render_template('home.html')

@canvamarketApp.route('/iUsuario', methods = ['GET', 'POST'])
@login_required
def iUsuario():
    if current_user.perfil == 'A':
        nombre = request.form ['nombre']
        correo = request.form ['correo']
        perfil = request.form ['perfil']
        clave  = request.form ['clave']
        claveCifrada = generate_password_hash(clave)
        regUsuario = db.connection.cursor()
        regUsuario.execute("INSERT INTO usuario (nombre,correo,clave,perfil) VALUES (%s,%s,%s,%s)",(nombre,correo,claveCifrada,perfil))
        db.connection.commit()
        flash ("Usuario registrado Satisfactoriamente")
        regUsuario.close()
        return redirect(url_for('sUsuario'))
    else:
        return render_template('home.html')

    
@canvamarketApp.route('/dUsuario/<int:id>', methods = ['GET', 'POST'])
@login_required
def dUsuario(id):
    if current_user.perfil == 'A':
        delUsuario = db.connection.cursor()
        delUsuario.execute("DELETE FROM usuario WHERE id = %s", (id,))
        db.connection.commit()
        delUsuario.close()
        flash("Usuario eliminado")
        return redirect(url_for('sUsuario'))
    else:
        return render_template('home.html')

if __name__ == '__main__':
    canvamarketApp.run(port=5812 )
