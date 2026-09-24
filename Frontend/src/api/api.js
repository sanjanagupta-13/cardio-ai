/**
 * Centralized API Client using Browser Native fetch()
 * Strict Rule: NO Axios is used in this project.
 */

let rawBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").trim().replace(/\/+$/, "");
if (!rawBaseUrl.endsWith("/api")) {
  rawBaseUrl = `${rawBaseUrl}/api`;
}
const API_BASE_URL = rawBaseUrl;

/**
 * Helper to handle fetch responses and standardize errors
 */
async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData && (errorData.error || errorData.message)) {
          errorMessage = errorData.error || errorData.message;
        }
      } catch (parseErr) {
        // use status text fallback
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
      throw new Error("Backend Offline: Unable to connect to Flask API server at port 5000.");
    }
    throw err;
  }
}

/**
 * Health check endpoint: GET /api/health
 */
export async function checkBackendHealth() {
  return await fetchJson("/health");
}

/**
 * Get all available models with metrics: GET /api/models
 */
export async function getModels() {
  return await fetchJson("/models");
}

/**
 * Get single model details: GET /api/models/:modelName
 */
export async function getModelDetails(modelName) {
  return await fetchJson(`/models/${encodeURIComponent(modelName)}`);
}

/**
 * Get comparative model evaluation metrics: GET /api/metrics
 */
export async function getModelMetrics() {
  return await fetchJson("/metrics");
}

/**
 * Predict cardiovascular disease risk: POST /api/predict
 */
export async function predictCardio(formData) {
  return await fetchJson("/predict", {
    method: "POST",
    body: JSON.stringify(formData)
  });
}

/**
 * Get prediction history with optional search & filter: GET /api/history
 */
export async function getHistory(params = {}) {
  const query = new URLSearchParams();
  if (params.model && params.model !== "all") query.append("model", params.model);
  if (params.prediction !== undefined && params.prediction !== "all") query.append("prediction", params.prediction);
  if (params.search) query.append("search", params.search);

  const queryString = query.toString() ? `?${query.toString()}` : "";
  return await fetchJson(`/history${queryString}`);
}

/**
 * Save prediction entry to history: POST /api/history
 */
export async function saveHistory(entry) {
  return await fetchJson("/history", {
    method: "POST",
    body: JSON.stringify(entry)
  });
}

/**
 * Update prediction history item: PUT /api/history/:id
 */
export async function updateHistory(id, data) {
  return await fetchJson(`/history/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

/**
 * Delete prediction history item: DELETE /api/history/:id
 */
export async function deleteHistory(id) {
  return await fetchJson(`/history/${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
}

/**
 * Get real dataset analytics & visualizations: GET /api/analytics
 */
export async function getAnalytics() {
  return await fetchJson("/analytics");
}

/**
 * Get dataset metadata, feature schema & sample rows: GET /api/dataset/summary
 */
export async function getDatasetSummary() {
  return await fetchJson("/dataset/summary");
}
