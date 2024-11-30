import joblib
model = joblib.load('student_linear_regression_score_predict.pkl')
import numpy as np

from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    data_2d = [list(data.values())]
    data_2d = np.array(data_2d).reshape(1, -1)
    prediction = model.predict(data_2d)
    return jsonify(prediction.tolist())

if __name__ == '__main__':
    app.run(port=5000)