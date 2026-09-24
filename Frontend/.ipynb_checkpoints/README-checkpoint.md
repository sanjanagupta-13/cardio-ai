# Cardio Frontend

This is the Streamlit frontend for the cardiovascular disease prediction project.

IMPORTANT:
The frontend does NOT contain `cardio_model.pkl` or `scaler.pkl`.
Those files belong only to the Backend.

## Folder

```text
Frontend/
├── app.py
├── requirements.txt
└── README.md
```

## Install

```bash
pip install -r requirements.txt
```

## Run

Make sure the Flask backend is already running on:

```text
http://localhost:5000
```

Then run:

```bash
streamlit run app.py
```

The frontend sends patient data to:

```text
POST http://localhost:5000/api/predict
```

The backend performs preprocessing, scaling, model prediction, and returns the result.
