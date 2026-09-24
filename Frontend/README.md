# ❤️ CardioPulse AI - Cardiovascular Disease Prediction Frontend

A modern, clinical-grade Streamlit web application developed for **Semester 5 Machine Learning / Cardiology Project**.

---

## 🌟 Highlights & Key Features

1. **🧭 Comprehensive Sidebar Navigation**:
   - **🏠 Overview & Pipeline**: Executive metrics, clinical problem background, and end-to-end ML architecture flowchart.
   - **📊 Exploratory Data Analysis (EDA)**: Interactive Plotly visualizer for Age, Blood Pressure, Cholesterol, Glucose, BMI, Lifestyle habits, and Correlation Heatmap.
   - **🤖 Model Benchmark & Graphs**: Complete leaderboard comparing all 7 algorithms (Accuracy, Precision, Recall, F1-Score), Confusion Matrix, ROC-AUC curves, and Gini Feature Importance.
   - **🩺 Live Patient Risk Prediction**: Interactive doctor consultation form with real-time **BMI calculator**, **AHA Hypertension Staging**, model switcher (XGBoost, Random Forest, Consensus voting), risk meter gauge, personalized recommendations, and downloadable clinical report (`.txt`).
   - **📁 Batch Patient Prediction**: Upload patient cohort CSV or load demo cohort to triage multiple patients simultaneously with CSV report export.
   - **🎓 Student & Project Details**: Academic course info, algorithm theoretical insights, tech stack, and clinical disclaimer.

2. **⚡ Dual Execution Engine**:
   - **Standalone Mode**: Runs directly via `streamlit run app.py` (models loaded in-process).
   - **API Mode**: Automatically connects with Flask REST API (`http://localhost:5000/api/predict`) if the backend is running.

3. **🤖 7 Supported Algorithms**:
   - XGBoost (`cardio_model.pkl`)
   - Random Forest (`cardio_model_rf.pkl`)
   - Logistic Regression (`cardio_model_lr.pkl`)
   - Decision Tree (`cardio_model_dt.pkl`)
   - AdaBoost (`cardio_model_ada.pkl`)
   - Gaussian Naive Bayes (`cardio_model_nb.pkl`)
   - K-Nearest Neighbors (`cardio_model_knn.pkl`)

---

## 🚀 How to Run

### Step 1: Install Dependencies
Open terminal inside the `Frontend` folder:
```bash
pip install -r requirements.txt
```

### Step 2: Launch Frontend
```bash
streamlit run app.py
```
The browser will automatically open at:
```text
http://localhost:8501
```

*(Optional)* If you wish to run the Flask backend simultaneously:
Open another terminal in `Backend/` and run:
```bash
python app.py
```
The frontend will detect the active API and display a `🟢 Flask Backend: Connected` status badge.
