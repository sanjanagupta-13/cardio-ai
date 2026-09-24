# Cardiovascular Disease Prediction - Backend

This backend converts the existing Streamlit prediction logic from the project into a REST API.

## 1. Folder structure

```text
cardio_backend/
│
├── app.py
├── requirements.txt
├── models/
│   ├── cardio_model.pkl
│   └── scaler.pkl
└── README.md
```

## 2. Install dependencies

Open a terminal inside this folder:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Then:

```bash
pip install -r requirements.txt
```

## 3. Start backend

```bash
python app.py
```

Backend will run on:

```text
http://localhost:5000
```

## 4. Test health API

Open:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Cardiovascular prediction backend is running"
}
```

## 5. Prediction API

Method:

```text
POST /api/predict
```

Example JSON:

```json
{
  "age": 45,
  "gender": "Female",
  "height": 165,
  "weight": 70,
  "ap_hi": 120,
  "ap_lo": 80,
  "cholesterol": "Normal",
  "gluc": "Normal",
  "smoke": "No",
  "alco": "No",
  "active": "Yes"
}
```

Example response:

```json
{
  "success": true,
  "prediction": 0,
  "result": "No Cardiovascular Disease Detected",
  "probability": 32.41
}
```

## 6. Important

The model and scaler are the same `.pkl` files already present in the uploaded project.

The API also performs the same conversions as the original Streamlit app:
- age: years -> days
- Female -> 1, Male -> 2
- cholesterol: Normal/Above Normal/Well Above Normal -> 1/2/3
- glucose: Normal/Above Normal/Well Above Normal -> 1/2/3
- Yes/No values -> 1/0

The frontend can now send the form data to `/api/predict` using `fetch()`.
