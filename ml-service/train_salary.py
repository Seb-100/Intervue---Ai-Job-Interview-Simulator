"""
train_salary.py — Run this ONCE to generate training data and save the salary model.
Usage:  python train_salary.py
Output: models/salary_model.joblib + models/salary_encoder.joblib
"""

import numpy as np
import joblib
from pathlib import Path
from sklearn.preprocessing import OrdinalEncoder
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

MODELS_DIR = Path(__file__).parent / "models"
MODELS_DIR.mkdir(exist_ok=True)

# Realistic GBP salary ranges per (role_category, level)
SALARY_RANGES = {
    ("software", "junior"): (28_000, 42_000),
    ("software", "mid"):    (45_000, 72_000),
    ("software", "senior"): (70_000, 105_000),
    ("software", "lead"):   (95_000, 140_000),
    ("data",     "junior"): (26_000, 40_000),
    ("data",     "mid"):    (42_000, 68_000),
    ("data",     "senior"): (65_000, 98_000),
    ("data",     "lead"):   (88_000, 130_000),
    ("product",  "junior"): (30_000, 44_000),
    ("product",  "mid"):    (48_000, 74_000),
    ("product",  "senior"): (72_000, 105_000),
    ("product",  "lead"):   (95_000, 138_000),
    ("design",   "junior"): (24_000, 36_000),
    ("design",   "mid"):    (36_000, 58_000),
    ("design",   "senior"): (55_000, 85_000),
    ("design",   "lead"):   (75_000, 110_000),
    ("devops",   "junior"): (30_000, 45_000),
    ("devops",   "mid"):    (48_000, 72_000),
    ("devops",   "senior"): (72_000, 105_000),
    ("devops",   "lead"):   (92_000, 135_000),
    ("marketing","junior"): (22_000, 33_000),
    ("marketing","mid"):    (32_000, 52_000),
    ("marketing","senior"): (48_000, 72_000),
    ("marketing","lead"):   (65_000, 95_000),
    ("general",  "junior"): (22_000, 34_000),
    ("general",  "mid"):    (33_000, 54_000),
    ("general",  "senior"): (52_000, 80_000),
    ("general",  "lead"):   (70_000, 100_000),
}

CATEGORIES = ["software", "data", "product", "design", "devops", "marketing", "general"]
LEVELS     = ["junior", "mid", "senior", "lead"]


def generate_data(n: int = 4000):
    rng = np.random.default_rng(42)
    X, y = [], []
    for _ in range(n):
        cat   = rng.choice(CATEGORIES)
        level = rng.choice(LEVELS)
        lo, hi = SALARY_RANGES[(cat, level)]
        # Add realistic noise
        salary = int(rng.integers(lo, hi) + rng.normal(0, 1500))
        salary = max(lo - 2000, min(hi + 5000, salary))  # clamp
        X.append([cat, level])
        y.append(salary)
    return X, y


def main():
    print("🔧 Generating synthetic salary training data...")
    X, y = generate_data(4000)

    encoder = OrdinalEncoder(categories=[CATEGORIES, LEVELS], handle_unknown="use_encoded_value", unknown_value=-1)
    X_enc = encoder.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(X_enc, y, test_size=0.15, random_state=42)

    print("🤖 Training GradientBoostingRegressor...")
    model = GradientBoostingRegressor(
        n_estimators=300,
        learning_rate=0.08,
        max_depth=4,
        subsample=0.85,
        min_samples_leaf=5,
        random_state=42,
        verbose=0,
    )
    model.fit(X_train, y_train)

    mae = mean_absolute_error(y_test, model.predict(X_test))
    print(f"✅ Training complete  |  MAE on test set: £{mae:,.0f}")

    joblib.dump(model,   MODELS_DIR / "salary_model.joblib")
    joblib.dump(encoder, MODELS_DIR / "salary_encoder.joblib")
    print(f"✅ Model saved → {MODELS_DIR / 'salary_model.joblib'}")
    print(f"✅ Encoder saved → {MODELS_DIR / 'salary_encoder.joblib'}")


if __name__ == "__main__":
    main()
