from flask import Flask, request, jsonify
import pandas as pd
import xgboost as xgb
from flask_cors import CORS 
import traceback

app = Flask(__name__)

CORS(app)

# Load the XGBoost model from JSON
model = xgb.XGBRegressor()
model.load_model("xgb_model.json")

@app.route('/')
def index():
    return 'Student Performance Prediction Model'

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse JSON input
        data = request.get_json()

        # Convert to DataFrame
        df = pd.DataFrame([data])  # Single-row DataFrame

        # Make prediction
        prediction = model.predict(df)

        return jsonify({'prediction': float(prediction[0])})

    except Exception as e:
        return jsonify({
            'error': str(e),
            'trace': traceback.format_exc()
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
