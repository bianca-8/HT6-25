from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/public")
def public():
    return jsonify(message="Hello from a public endpoint! You don't need to be authenticated to see this.")

if __name__ == "__main__":
    app.run(debug=True)
