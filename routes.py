from flask import Flask, render_template, request, jsonify
import NOVA_classifier

app = Flask(__name__)

@app.route("/")
def homepage():     #load the webpage
    return render_template("index.html")

@app.route("/api_get_suggestions", methods=["POST"]) 
def api_get_suggestions():       #receives a string and returns a list of ingredients that could match
    api_package = request.get_json()
    string = api_package["kwargs"]["string"]
    suggestions = NOVA_classifier.get_ingredient_suggestions(string)
    return_package = dict(rc=0, message="worked okay", suggestions=suggestions)
    
    return jsonify(return_package)
    
    
@app.route("/api_get_classification", methods=["POST"])
def api_get_classification():       #recieves a list of ingredient for a food and sends back the NOVA classification of the food
    api_package = request.get_json()
    ingredient_names = api_package["kwargs"]["ingredient_names"]
    nova_classification = NOVA_classifier.classification(ingredient_names)
    return_package = dict(rc=0, message="worked okay", nova_group=nova_classification)
    return jsonify(return_package)


if __name__ == "__main__":
    app.run(debug=True)