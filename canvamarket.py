from flask import Flask, render_template, redirect, url_for
from flask_mysqldb import MYSQL
from config import config

canvamarketApp  = Flask(__name__)
db              = MYSQL(canvamarketApp)

@canvamarketApp.route('/')
def home():
    return render_template('home.html') 

if __name__ == '__main__':
    canvamarketApp.run(port=5500)