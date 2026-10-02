export function convertHeightToCm(feet, inches) {
  return Math.round((Number(feet) * 12 + Number(inches)) * 2.54);
}

export function validateMeasurements(measurements, fields) {
  const errors = {};

  fields.forEach(({ name, label, min, max }) => {
    const value = Number(measurements[name]);

    if (measurements[name] === "" || !Number.isFinite(value)) {
      errors[name] = `Please enter your ${label.toLowerCase()}.`;
    } else if (value < min || value > max) {
      errors[name] = `${label} must be between ${min} and ${max}.`;
    }
  });

  if (!measurements.fit) {
    errors.fit = "Please select your preferred fit.";
  }

  return errors;
}

export async function getSizeFromAI(measurements) {
  const prompt = `
You are a practical clothing-size recommendation assistant.
Use the measurements provided to suggest clothing sizes.
Do not make comments about the person's appearance or body.

Measurements:
${JSON.stringify(measurements, null, 2)}

Return only valid JSON in this exact format:
{
  "shirtSize": "Suggested top size",
  "trouserSize": "Suggested bottom size",
  "fitType": "Preferred fit",
  "recommendation": "One short, practical sentence"
}

Use common clothing sizes such as XS, S, M, L, XL, or XXL.
Treat the result as an estimate because clothing sizes vary by brand.
`;

  const response = await fetch( "https://avit-server.netlify.app/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  console.log(response)

  if (!response.ok) {
    throw new Error("We couldn't get your size recommendation. Please try again.");
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  // Supports the Gemini response format used by the original script.
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("The recommendation response was empty. Please try again.");
  }

  const cleanedText = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleanedText);
  } catch {
    throw new Error("The recommendation couldn't be read. Please try again.");
  }
}

export function saveUserFit(measurements, recommendation) {
  const userFit = {
    ...measurements,
    shirtSize: recommendation.shirtSize,
    trouserSize: recommendation.trouserSize,
    fitType: recommendation.fitType || measurements.fit,
    recommendation: recommendation.recommendation,
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem("userFit", JSON.stringify(userFit));

  return userFit;
}