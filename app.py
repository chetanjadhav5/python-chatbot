import pickle
from flask import Flask, request, jsonify, render_template
import mysql.connector

# Initialize Flask app
app = Flask(__name__, template_folder="templates", static_folder="static")

# Load trained model and vectorizer with error handling
try:
    with open("C:/Users/dell/OneDrive/Desktop/Project/chatbot frontend/chatbot_model.pkl", 'rb') as model_file, \
         open("C:/Users/dell/OneDrive/Desktop/Project/chatbot frontend/tfidf_vectorizer.pkl", 'rb') as vec_file:
        model = pickle.load(model_file)
        vectorizer = pickle.load(vec_file)
    print("Model and vectorizer loaded successfully.")
except Exception as e:
    print(f"Error loading model/vectorizer: {e}")
    model, vectorizer = None, None  # Prevent crashes if model loading fails

# Database Connection with error handling
def get_db_connection():
    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Prashant@123",
            database="enquiries_db"
        )
        return db
    except mysql.connector.Error as err:
        print(f"Database connection error: {err}")
        return None

# Render Chatbot UI
@app.route('/')
def home():
    return render_template("chatbot.html")

# Chatbot API (Handles user queries)
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_input = data.get("message", "").strip().lower()

        if not user_input:
            return jsonify({"response": "Please enter a valid message."})

        if not model or not vectorizer:
            return jsonify({"response": "Chatbot model is unavailable. Please check the server."})

        # Process user input with the trained model
        user_vector = vectorizer.transform([user_input])
        response = model.predict(user_vector)[0]

        return jsonify({"response": response})

    except Exception as e:
        return jsonify({"error": str(e)})

# Enquiry Submission API
@app.route('/submit-enquiry', methods=['POST'])
def submit_enquiry():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        department = data.get('department')
        message = data.get('message')

        if not all([name, email, department, message]):
            return jsonify({"success": False, "error": "All fields are required!"})

        db = get_db_connection()
        if db is None:
            return jsonify({"success": False, "error": "Database connection failed!"})

        cursor = db.cursor()
        sql = "INSERT INTO enquiries (name, email, department, message) VALUES (%s, %s, %s, %s)"
        values = (name, email, department, message)
        cursor.execute(sql, values)
        db.commit()
        cursor.close()
        db.close()

        return jsonify({"success": True, "message": "Enquiry submitted successfully!"})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

# Run Flask Server
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
