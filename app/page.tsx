"use client";

import { useState } from "react";
import MapWrapper from "@/components/MapWrapper";
import { shelters } from "@/data/shelters";

export default function Home() {
  const [hazard, setHazard] = useState("flood");
  const [forecast, setForecast] = useState(0);

  const [aiPlan, setAiPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/generate-plan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hazard,
            forecast,
          }),
        }
      );

      const data = await response.json();

      if (data.plan) {
        setAiPlan(data.plan);
      } else {
        setAiPlan("No response received.");
      }
    } catch (error) {
      console.error(error);
      setAiPlan(
        "Failed to generate AI evacuation plan."
      );
    } finally {
      setLoading(false);
    }
  };

  let riskLevel = "Moderate";
  let impact = "";
  let action = "";

  if (hazard === "flood") {
    riskLevel =
      forecast >= 60 ? "High" : "Moderate";

    impact =
      "Floodwaters may affect low-lying roads and homes.";

    action =
      "Move to higher ground and monitor updates.";
  }

  if (hazard === "landslide") {
    riskLevel = "High";

    impact =
      "Slope instability detected in nearby areas.";

    action =
      "Avoid hillsides and prepare for evacuation.";
  }

  if (hazard === "wildfire") {
    riskLevel = "High";

    impact =
      "Fire spread likely due to dry conditions.";

    action =
      "Evacuate vulnerable areas immediately.";
  }

  if (hazard === "cyclone") {
    riskLevel = "Severe";

    impact =
      "Strong winds and flooding expected.";

    action =
      "Secure shelter and avoid travel.";
  }

  let riskColor = "text-yellow-400";

  if (riskLevel === "High") {
    riskColor = "text-red-400";
  }

  if (riskLevel === "Severe") {
    riskColor = "text-purple-400";
  }

  const disasterLat = 9.9312;
  const disasterLng = 76.2673;

  const nearestShelter = shelters.reduce(
    (closest, shelter) => {
      const currentDistance = Math.sqrt(
        Math.pow(
          shelter.lat - disasterLat,
          2
        ) +
          Math.pow(
            shelter.lng - disasterLng,
            2
          )
      );

      const closestDistance = Math.sqrt(
        Math.pow(
          closest.lat - disasterLat,
          2
        ) +
          Math.pow(
            closest.lng - disasterLng,
            2
          )
      );

      return currentDistance <
        closestDistance
        ? shelter
        : closest;
    }
  );

  return (
  <main className="min-h-screen bg-slate-50 text-slate-900 p-6">
    {/* Hero */}
    <div className="mb-8">
      <h1 className="text-5xl font-bold mb-3">
        🌊 FloodSafe AI
      </h1>

      <p className="text-xl text-slate-600 mb-2">
        Know Before You Need To Evacuate
      </p>

      <p className="text-slate-500 max-w-3xl">
        Predict flood risk, understand future
        impact, and find the safest evacuation
        route before it's too late.
      </p>
    </div>

    {/* Alert Banner */}
    <div className="mb-6 rounded-2xl p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
      <div className="flex items-center gap-3">
        <div className="text-4xl">⚠️</div>

        <div>
          <h2 className="text-xl font-bold">
            Flood Risk Rising
          </h2>

          <p>
            Your area may experience severe
            flooding within the next 6 hours.
          </p>
        </div>
      </div>
    </div>

    {/* Search */}
    <div className="bg-white rounded-2xl shadow-sm border p-4 mb-6">
      <input
        placeholder="📍 Search location (e.g. Kochi)"
        className="w-full outline-none"
      />
    </div>

    {/* Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-2xl p-5 shadow-sm border">
        <p className="text-sm text-slate-500">
          Risk Score
        </p>

        <h3 className="text-3xl font-bold text-red-500">
          {forecast === 0
            ? 42
            : forecast === 30
            ? 61
            : forecast === 60
            ? 79
            : 92}
        </h3>

        <p className="text-sm text-slate-500">
          Flood Threat
        </p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border">
        <p className="text-sm text-slate-500">
          Forecast Confidence
        </p>

        <h3 className="text-3xl font-bold text-blue-600">
          91%
        </h3>

        <p className="text-sm text-slate-500">
          AI Prediction
        </p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border">
        <p className="text-sm text-slate-500">
          Estimated Flood Depth
        </p>

        <h3 className="text-3xl font-bold text-cyan-600">
          {forecast === 0
            ? "0.2m"
            : forecast === 30
            ? "0.5m"
            : forecast === 60
            ? "0.9m"
            : "1.4m"}
        </h3>

        <p className="text-sm text-slate-500">
          Water Level
        </p>
      </div>
    </div>

    {/* Forecast */}
    <div className="flex gap-3 mb-6 flex-wrap">
      <button
        onClick={() => setForecast(0)}
        className={`px-5 py-3 rounded-xl ${
          forecast === 0
            ? "bg-green-500 text-white"
            : "bg-white border"
        }`}
      >
        Now
      </button>

      <button
        onClick={() => setForecast(30)}
        className={`px-5 py-3 rounded-xl ${
          forecast === 30
            ? "bg-green-500 text-white"
            : "bg-white border"
        }`}
      >
        30 Min
      </button>

      <button
        onClick={() => setForecast(60)}
        className={`px-5 py-3 rounded-xl ${
          forecast === 60
            ? "bg-green-500 text-white"
            : "bg-white border"
        }`}
      >
        1 Hour
      </button>

      <button
        onClick={() => setForecast(360)}
        className={`px-5 py-3 rounded-xl ${
          forecast === 360
            ? "bg-green-500 text-white"
            : "bg-white border"
        }`}
      >
        6 Hours
      </button>
    </div>

    {/* Main Layout */}
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Map */}
      <div className="lg:col-span-4">
        <MapWrapper
          hazard={hazard}
          forecast={forecast}
        />
      </div>

      {/* Safety Panel */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="text-2xl font-bold mb-1">
          Your Safety
        </h2>

        <p className="text-sm text-slate-500 mb-6">
          Personalized evacuation guidance
        </p>

        <div className="space-y-5">
  <div>
    <p className="text-slate-500">
      Current Risk
    </p>

    <p
      className={`text-2xl font-bold ${riskColor}`}
    >
      {riskLevel}
    </p>
  </div>

  <div>
    <p className="text-slate-500">
      Predicted Impact
    </p>

    <p>{impact}</p>
  </div>

  <div>
    <p className="text-slate-500">
      Recommended Action
    </p>

    <p>{action}</p>
  </div>

  <div>
    <p className="text-slate-500">
      Nearest Shelter
    </p>

    <p className="font-semibold text-green-600">
      {nearestShelter.name}
    </p>
  </div>

  <div>
    <p className="text-slate-500">
      Travel Time
    </p>

    <p className="font-semibold">
      12 minutes
    </p>
  </div>

  <div>
    <p className="text-slate-500">
      Emergency Contacts
    </p>

    <div className="mt-2 text-sm space-y-1">
      <p>🚨 Disaster Control: 1077</p>
      <p>🚑 Ambulance: 108</p>
      <p>👮 Police: 100</p>
    </div>
  </div>

  <button
    onClick={generatePlan}
    className="bg-blue-600 hover:bg-blue-700 transition-all px-4 py-3 rounded-xl w-full text-white font-semibold"
  >
    🧠 Analyze My Situation
  </button>

  <div className="mt-4">
    {loading ? (
      <p>Generating AI response...</p>
    ) : (
      <div className="bg-slate-100 p-4 rounded-xl text-sm whitespace-pre-wrap">
        {aiPlan}
      </div>
    )}
  </div>
</div>
      </div>
    </div>
  </main>
  );
}