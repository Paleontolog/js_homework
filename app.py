import uuid

from flask_cors import CORS
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

articles = dict()

CORS(app)


@app.route("/", methods=["GET"])
def get_page():
    return render_template('page.html')


@app.route("/articles", methods=["GET"])
def get_articles():
    response = jsonify([{"id": key, "header": value["header"]} for key, value in articles.items()])
    return response, 200


@app.route("/article", methods=["GET"])
def get_article():
    name = request.args.get('id')
    response = jsonify(articles.get(name, None))
    return response, 200


@app.route("/article", methods=["POST"])
def create_article():
    article = request.get_json(force=True)
    article_id = str(uuid.uuid1())
    articles[article_id] = article

    response = jsonify(article_id)
    return response, 200


@app.route("/article", methods=["DELETE"])
def delete_article():
    article_id = request.args.get("id")
    articles.pop(article_id)

    response = jsonify(article_id)
    return response, 200


if __name__ == "__main__":
    app.run(debug=True)
