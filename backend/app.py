from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from datetime import datetime
import os

load_dotenv()
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"postgresql://{os.getenv('DB_USER')}:"
    f"{os.getenv('DB_PASSWORD')}@"
    f"{os.getenv('DB_HOST')}:"
    f"{os.getenv('DB_PORT')}/"
    f"{os.getenv('DB_NAME')}"
)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

class Read(db.Model):
    __tablename__ = "allreads"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(90), nullable=False)
    author = db.Column(db.String(35), nullable=False)
    book_type = db.Column(db.String(13), nullable=False)
    page_count = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Float)
    start_date = db.Column(db.Date, nullable=False)
    finish_date = db.Column(db.Date, nullable=False)
    demographic = db.Column(db.String(12), nullable=False)
    standalone = db.Column(db.Boolean, nullable=False)
    partofseries = db.Column(db.String(40))
    fiction = db.Column(db.Boolean, nullable=False)
    reread = db.Column(db.Boolean)

@app.route("/", methods=["GET"])
def index():
    reads = Read.query.order_by(Read.finish_date, Read.title).all()

    result = []

    for r in reads:
        result.append({
            "id": r.id,
            "title": r.title,
            "author": r.author,
            "book_type": r.book_type,
            "page_count": r.page_count,
            "rating": r.rating,
            "start_date": r.start_date.isoformat(),
            "finish_date": r.finish_date.isoformat(),
            "demographic": r.demographic,
            "standalone": r.standalone,
            "partofseries": r.partofseries,
            "fiction": r.fiction,
            "reread": r.reread
        })

    return jsonify(result)

@app.route("/post-read", methods=["POST"])
def add_read():
    data = request.get_json()

    new_read = Read(
        title=data['title'],
        author=data['author'],
        book_type=data['book_type'],
        page_count=data['page_count'],
        rating=data.get('rating'),
        start_date=datetime.strptime(data['start_date'], "%Y-%m-%d").date(),
        finish_date=datetime.strptime(data['finish_date'], "%Y-%m-%d").date(),
        demographic=data['demographic'],
        standalone=data['standalone'],
        partofseries=data.get('partofseries'),
        fiction=data['fiction']
    )

    db.session.add(new_read)
    db.session.commit()

    return jsonify({'message': 'Read added successfully'}), 201

if __name__ == "__main__":
    app.run(debug=True)