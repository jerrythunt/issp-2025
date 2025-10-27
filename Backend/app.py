from flask import Flask
from api import music
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # allows React frontend to connect

app.register_blueprint(music.bp, url_prefix="/api/music")

@app.route("/", methods=["GET"])
def home():
    return "Welcome to the Home Page!"

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=8888)