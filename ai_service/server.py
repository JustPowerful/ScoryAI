import joblib
model = joblib.load('student_linear_regression_score_predict.pkl')
import numpy as np

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Add this line to enable CORS

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        data_2d = [list(data.values())]
        data_2d = np.array(data_2d).reshape(1, -1)
        prediction = model.predict(data_2d)
        return jsonify({
            'message': 'Prediction made successfully',
            'prediction': prediction[0]
        })
    except Exception as e:
        return jsonify({
            'message': 'Error occurred during prediction',
            'error': str(e)
        })

if __name__ == '__main__':
    app.run(port=5000)