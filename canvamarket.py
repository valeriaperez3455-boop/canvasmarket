from flask import Flask

canvamarketApp  = Flask(__name__)

@canvamarketApp.route('/')
def home():
    return '<h1>hello mundo<h1>'

if __name__ == '__main__':
    canvamarketApp.run(port=5500,debug=True)