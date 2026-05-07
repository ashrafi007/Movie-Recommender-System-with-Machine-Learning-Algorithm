import os
import requests
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from nltk.stem.porter import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

load_dotenv()

app = Flask(__name__)
CORS(app)

TMDB_API_KEY = os.getenv("TMDB_API_KEY", "")
TMDB_BASE = "https://api.themoviedb.org/3"
TMDB_IMG = "https://image.tmdb.org/t/p/w500"
TMDB_BACKDROP = "https://image.tmdb.org/t/p/original"

# ---------------------------------------------------------------------------
# Model bootstrap
# ---------------------------------------------------------------------------
CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "dataset", "processed_movies.csv")

df = pd.read_csv(CSV_PATH)

ps = PorterStemmer()


def stem(text):
    return " ".join(ps.stem(w) for w in str(text).split())


df["tags"] = df["tags"].apply(stem)

cv = CountVectorizer(max_features=5000, stop_words="english")
vectors = cv.fit_transform(df["tags"]).toarray()
similarity = cosine_similarity(vectors)

movie_titles = df["title"].tolist()
movie_id_map = dict(zip(df["title"], df["movie_id"]))


# ---------------------------------------------------------------------------
# TMDB helpers
# ---------------------------------------------------------------------------
def tmdb_headers():
    if TMDB_API_KEY:
        return {"Authorization": f"Bearer {TMDB_API_KEY}", "accept": "application/json"}
    return {}


def get_poster_url(movie_id):
    if not TMDB_API_KEY:
        return None
    try:
        resp = requests.get(
            f"{TMDB_BASE}/movie/{movie_id}",
            headers=tmdb_headers(),
            timeout=5,
        )
        data = resp.json()
        path = data.get("poster_path")
        return f"{TMDB_IMG}{path}" if path else None
    except Exception:
        return None


def get_backdrop_url(movie_id):
    if not TMDB_API_KEY:
        return None
    try:
        resp = requests.get(
            f"{TMDB_BASE}/movie/{movie_id}",
            headers=tmdb_headers(),
            timeout=5,
        )
        data = resp.json()
        path = data.get("backdrop_path")
        return f"{TMDB_BACKDROP}{path}" if path else None
    except Exception:
        return None


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.route("/movies", methods=["GET"])
def get_movies():
    return jsonify({"movies": movie_titles})


@app.route("/recommend", methods=["POST"])
def recommend():
    body = request.get_json(force=True)
    movie = body.get("movie", "").strip()

    matches = df[df["title"].str.lower() == movie.lower()]
    if matches.empty:
        return jsonify({"error": "Movie not found"}), 404

    idx = matches.index[0]
    distances = similarity[idx]
    top_indices = sorted(
        list(enumerate(distances)), reverse=True, key=lambda x: x[1]
    )[1:6]

    recommendations = []
    for i, _ in top_indices:
        title = df.iloc[i]["title"]
        mid = int(df.iloc[i]["movie_id"])
        poster = get_poster_url(mid)
        recommendations.append({"title": title, "movie_id": mid, "poster_url": poster})

    return jsonify({"recommendations": recommendations})


@app.route("/hero-posters", methods=["GET"])
def hero_posters():
    # Return backdrop images for the landing hero section
    # Uses the first 20 movies in the dataset to pick 8 varied backdrops
    hero_ids = [
        19995,   # Avatar
        27205,   # Inception
        157336,  # Interstellar
        155,     # The Dark Knight
        24428,   # The Avengers
        76341,   # Mad Max: Fury Road
        118340,  # Guardians of the Galaxy
        597,     # Titanic
    ]
    backdrops = []
    for mid in hero_ids:
        url = get_backdrop_url(mid)
        if url:
            backdrops.append(url)

    # Fallback gradient colors if no API key
    if not backdrops:
        backdrops = []

    return jsonify({"backdrops": backdrops})


if __name__ == "__main__":
    app.run(debug=True, port=5001)
