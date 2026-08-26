from flask import Flask, render_template, redirect, url_for

canvamarketApp  = Flask(__name__)

@canvamarketApp.route('/')
def home():
    return render_template('home.html') 

if __name__ == '__main__':
    canvamarketApp.run(port=5500,debug=True)