import { useState } from "react";
import { Link } from "react-router-dom";
import "./FitPage.css";
import {
  convertHeightToCm,
  validateMeasurements,
  getSizeFromAI,
  saveUserFit,
} from "../../utils/fitUtils";

const initialForm = {
  feet: "",
  inches: "",
  chest: "",
  waist: "",
  fit: "",
};

export default function MensFitPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateMeasurements(form, [
      { name: "feet", label: "Height (feet)", min: 3, max: 8 },
      { name: "inches", label: "Height (inches)", min: 0, max: 11 },
      { name: "chest", label: "Chest", min: 20, max: 70 },
      { name: "waist", label: "Waist", min: 20, max: 70 },
    ]);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const measurements = {
      gender: "Male",
      heightCm: convertHeightToCm(form.feet, form.inches),
      chestCm: Number(form.chest) * 2.54,
      waistCm: Number(form.waist) * 2.54,
      fit: form.fit,
    };

    setLoading(true);
    setRequestError("");
    setResult(null);

    try {
      const recommendation = await getSizeFromAI(measurements);
      const savedFit = saveUserFit(measurements, recommendation);
      setResult(savedFit);
    } catch (error) {
      setRequestError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="fit-page">
      <div className="fit-container">
        <Link to="/find-fit" className="back-fit">
          ← Back to Find My Fit
        </Link>

        <header className="fit-header">
          <span>AVIT MEN'S FIT</span>
          <h1>Find Your Fit</h1>
          <p>
            Enter a few measurements to get a clothing-size
            recommendation tailored to your preferred fit.
          </p>
        </header>

        <form className="fit-form" onSubmit={handleSubmit} noValidate>
          <div className={`form-group ${errors.feet || errors.inches ? "has-error" : ""}`}>
            <label>
              Height <span>Required</span>
            </label>

            <div className="height-fields">
              <div>
                <input
                  type="number"
                  name="feet"
                  placeholder="Feet"
                  min="3"
                  max="8"
                  value={form.feet}
                  onChange={handleChange}
                />
                <span>ft</span>
              </div>

              <div>
                <input
                  type="number"
                  name="inches"
                  placeholder="Inches"
                  min="0"
                  max="11"
                  value={form.inches}
                  onChange={handleChange}
                />
                <span>in</span>
              </div>
            </div>

            {(errors.feet || errors.inches) && (
              <small className="error-message">
                {errors.feet || errors.inches}
              </small>
            )}
          </div>

          <div className={`form-group ${errors.chest ? "has-error" : ""}`}>
            <label htmlFor="men-chest">
              Chest <span>Inches</span>
            </label>
            <input
              id="men-chest"
              type="number"
              name="chest"
              placeholder="Enter chest measurement"
              min="20"
              max="70"
              step="0.5"
              value={form.chest}
              onChange={handleChange}
            />
            {errors.chest && (
              <small className="error-message">{errors.chest}</small>
            )}
          </div>

          <div className={`form-group ${errors.waist ? "has-error" : ""}`}>
            <label htmlFor="men-waist">
              Waist <span>Inches</span>
            </label>
            <input
              id="men-waist"
              type="number"
              name="waist"
              placeholder="Enter waist measurement"
              min="20"
              max="70"
              step="0.5"
              value={form.waist}
              onChange={handleChange}
            />
            {errors.waist && (
              <small className="error-message">{errors.waist}</small>
            )}
          </div>

          <div className={`form-group ${errors.fit ? "has-error" : ""}`}>
            <label htmlFor="men-fit">
              Preferred Fit <span>Required</span>
            </label>
            <select
              id="men-fit"
              name="fit"
              value={form.fit}
              onChange={handleChange}
            >
              <option value="">Choose your preferred fit</option>
              <option value="Slim">Slim</option>
              <option value="Regular">Regular</option>
              <option value="Relaxed">Relaxed</option>
              <option value="Oversized">Oversized</option>
            </select>
            {errors.fit && (
              <small className="error-message">{errors.fit}</small>
            )}
          </div>

          {requestError && (
            <p className="fit-request-error" role="alert">
              {requestError}
            </p>
          )}

          <button className="find-fit-btn" type="submit" disabled={loading}>
            {loading ? "Finding Your Fit..." : "Find My Size"}
            {!loading && <span>→</span>}
          </button>
        </form>

        {result && (
          <section className="fit-result" aria-live="polite">
            <span className="result-label">YOUR AVIT FIT</span>
            <h2 className="result-title">Your Size Recommendation</h2>

            <div className="result-grid">
              <div className="result-item">
                <small>TOP SIZE</small>
                <strong>{result.shirtSize}</strong>
              </div>
              <div className="result-item">
                <small>BOTTOM SIZE</small>
                <strong>{result.trouserSize}</strong>
              </div>
              <div className="result-item">
                <small>PREFERRED FIT</small>
                <strong>{result.fitType}</strong>
              </div>
            </div>

            <p className="result-recommendation">
              {result.recommendation}
            </p>
            <p className="fit-result-note">
              This is an estimate. Sizing can vary between clothing brands.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}