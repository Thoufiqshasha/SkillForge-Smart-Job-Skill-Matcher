from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

JOBS = {
    "Python Developer": ["Python","OOP","DSA","Git","REST APIs","SQL"],
    "Full Stack Developer": ["Python","HTML","CSS","JavaScript","SQL","Git","REST APIs"],
    "Backend Developer": ["Python","OOP","SQL","REST APIs","Git","Testing"],
    "Data Analyst": ["Python","SQL","Excel","Pandas","Data Visualization"],
    "Cloud Engineer": ["Python","AWS","Cloud Computing","Networking","Linux","Git"],
    "Cybersecurity Analyst": ["Cybersecurity","Networking","Linux","Python","Git"],
    "DevOps Engineer": ["Linux","Git","CI/CD","Docker","Cloud Computing","Python"],
    "QA Automation Engineer": ["Python","Selenium","SQL","Git","Testing","APIs"],
    "Frontend Developer": ["HTML","CSS","JavaScript","React","Git"],
    "AI / GenAI Developer": ["Python","SQL","APIs","Prompt Engineering","Cloud Computing","Git"]
}

SKILLS = [
    "Python","Java","SQL","OOP","DSA","HTML","CSS","JavaScript","React",
    "Git","REST APIs","AWS","Cloud Computing","Networking","Cybersecurity",
    "Linux","Docker","CI/CD","Testing","Selenium","Excel","Pandas",
    "Data Visualization","Prompt Engineering"
]

@app.route("/")
def home():
    return render_template("index.html", skills=SKILLS)

@app.post("/api/match")
def match():
    data = request.get_json(silent=True) or {}
    selected = set(data.get("skills", []))
    results = []
    for role, required in JOBS.items():
        matched = [s for s in required if s in selected]
        missing = [s for s in required if s not in selected]
        score = round((len(matched) / len(required)) * 100)
        results.append({"role": role, "score": score, "matched": matched, "missing": missing})
    results.sort(key=lambda x: (-x["score"], x["role"]))
    return jsonify({"results": results})

if __name__ == "__main__":
    app.run(debug=True)
