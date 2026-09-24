import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import xgboost as xgb

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "cardio_train.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

print("Loading dataset from:", DATA_PATH)
df = pd.read_csv(DATA_PATH, sep=";")
df = df.drop(columns=["id"])

# Outlier filtering consistent with Cardio_Pandas.ipynb
df = df[(df["ap_hi"] >= 50) & (df["ap_hi"] <= 250) & (df["ap_lo"] >= 30) & (df["ap_lo"] <= 200)]
df = df[(df["height"] >= 100) & (df["height"] <= 220) & (df["weight"] >= 30) & (df["weight"] <= 200)]
print(f"Dataset shape after outlier removal: {df.shape}")

features = ["age", "gender", "height", "weight", "ap_hi", "ap_lo", "cholesterol", "gluc", "smoke", "alco", "active"]
X = df[features]
y = df["cardio"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Fit / reuse Scaler
scaler_path = os.path.join(MODELS_DIR, "scaler.pkl")
if os.path.exists(scaler_path):
    print("Loading existing scaler...")
    scaler = joblib.load(scaler_path)
else:
    print("Fitting new scaler...")
    scaler = StandardScaler()
    scaler.fit(X_train)
    joblib.dump(scaler, scaler_path)

X_train_scaled = scaler.transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Dictionary of models to verify or train
models = {
    "Logistic Regression": {
        "file": "cardio_model_lr.pkl",
        "clf": LogisticRegression(max_iter=1000, random_state=42)
    },
    "Decision Tree": {
        "file": "cardio_model_dt.pkl",
        "clf": DecisionTreeClassifier(max_depth=10, min_samples_leaf=20, random_state=42)
    },
    "Random Forest": {
        "file": "cardio_model_rf.pkl",
        "clf": RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1)
    },
    "AdaBoost": {
        "file": "cardio_model_ada.pkl",
        "clf": AdaBoostClassifier(n_estimators=100, random_state=42)
    },
    "GaussianNB": {
        "file": "cardio_model_nb.pkl",
        "clf": GaussianNB()
    },
    "KNN": {
        "file": "cardio_model_knn.pkl",
        "clf": KNeighborsClassifier(n_neighbors=25, n_jobs=-1)
    },
    "XGBoost": {
        "file": "cardio_model.pkl",
        "clf": xgb.XGBClassifier(n_estimators=120, max_depth=5, learning_rate=0.08, eval_metric="logloss", random_state=42)
    }
}

# If root cardio_model.pkl exists and is Random Forest, we can use it or train rf
root_rf_path = os.path.join(BASE_DIR, "..", "cardio_model.pkl")
if os.path.exists(root_rf_path) and not os.path.exists(os.path.join(MODELS_DIR, "cardio_model_rf.pkl")):
    try:
        loaded_rf = joblib.load(root_rf_path)
        joblib.dump(loaded_rf, os.path.join(MODELS_DIR, "cardio_model_rf.pkl"))
        print("Copied existing Random Forest model to models/cardio_model_rf.pkl")
    except Exception as e:
        print("Could not copy root RF model:", e)

results_list = []

for name, info in models.items():
    model_file = os.path.join(MODELS_DIR, info["file"])
    clf = None
    if os.path.exists(model_file):
        try:
            print(f"Loading existing {name} from {info['file']}...")
            clf = joblib.load(model_file)
        except Exception as e:
            print(f"Error loading {name}: {e}. Retraining...")

    if clf is None:
        print(f"Training {name}...")
        clf = info["clf"]
        clf.fit(X_train_scaled, y_train)
        joblib.dump(clf, model_file)
        print(f"Saved {name} to {info['file']}")

    train_preds = clf.predict(X_train_scaled)
    test_preds = clf.predict(X_test_scaled)

    train_acc = accuracy_score(y_train, train_preds)
    test_acc = accuracy_score(y_test, test_preds)
    prec = precision_score(y_test, test_preds)
    rec = recall_score(y_test, test_preds)
    f1 = f1_score(y_test, test_preds)

    print(f"-> {name} | Test Acc: {test_acc:.4f} | Prec: {prec:.4f} | Rec: {rec:.4f} | F1: {f1:.4f}")

    results_list.append({
        "Model": name,
        "Training Accuracy": train_acc,
        "Testing Accuracy": test_acc,
        "Precision": prec,
        "Recall": rec,
        "F1 Score": f1
    })

# Save updated comprehensive results table
results_df = pd.DataFrame(results_list)
csv_path = os.path.join(BASE_DIR, "..", "model_results.csv")
results_df.to_csv(csv_path, index=False)
print("Updated model results saved to:", csv_path)
print("All models processed successfully!")
