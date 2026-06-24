"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapContainerAny = MapContainer as unknown as any;
const TileLayerAny = TileLayer as unknown as any;
const CircleAny = Circle as unknown as any;
const MarkerAny = Marker as unknown as any;
const PopupAny = Popup as unknown as any;
const PolylineAny = Polyline as unknown as any;

type CrisisMapProps = {
  hazard: string;
  forecast: number;
};

export default function CrisisMap({
  hazard,
  forecast,
}: CrisisMapProps) {
  const [highRiskRadius, setHighRiskRadius] =
    useState<number>(500);

  useEffect(() => {
    switch (forecast) {
      case 0:
        setHighRiskRadius(500);
        break;

      case 30:
        setHighRiskRadius(1500);
        break;

      case 60:
        setHighRiskRadius(3000);
        break;

      case 360:
        setHighRiskRadius(7000);
        break;

      default:
        setHighRiskRadius(500);
    }
  }, [forecast]);

  let spreadMultiplier = 1;
  let center: [number, number] = [9.9312, 76.2673];
  let color = "#3b82f6";

  switch (hazard) {
    case "flood":
      color = "#3b82f6";
      spreadMultiplier = 1;
      break;

    case "landslide":
      color = "#92400e";
      spreadMultiplier = 0.8;
      center = [
        9.9312 + highRiskRadius / 500000,
        76.2673 + highRiskRadius / 500000,
      ];
      break;

    case "wildfire":
      color = "#dc2626";
      spreadMultiplier = 1.2;
      center = [
        9.9312,
        76.2673 + highRiskRadius / 300000,
      ];
      break;

    case "cyclone":
      color = "#9333ea";
      spreadMultiplier = 2;
      break;
  }

  const shelters: {
    name: string;
    position: [number, number];
  }[] = [
    {
      name: "Kochi Relief Camp",
      position: [9.9412, 76.2773],
    },
    {
      name: "Medical Response Center",
      position: [9.9212, 76.2573],
    },
  ];

  const hospitals: {
    name: string;
    position: [number, number];
  }[] = [
    {
      name: "Emergency Hospital",
      position: [9.935, 76.285],
    },
  ];

  const userLocation: [number, number] = [
    9.925,
    76.262,
  ];

  const evacuationRoute: [number, number][] = [
    userLocation,
    shelters[0].position,
  ];

  return (
    <div className="relative">
      <MapContainerAny
        center={[9.9312, 76.2673]}
        zoom={12}
        style={{
          height: "700px",
          width: "100%",
          borderRadius: "20px",
        }}
      >
      <TileLayerAny
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Low Risk */}
      <CircleAny
        center={center}
        radius={
          highRiskRadius *
          3 *
          spreadMultiplier
        }
        pathOptions={{
          color,
          fillColor: color,
          fillOpacity: 0.1,
        }}
      />

      {/* Medium Risk */}
      <CircleAny
        center={center}
        radius={
          highRiskRadius *
          2 *
          spreadMultiplier
        }
        pathOptions={{
          color,
          fillColor: color,
          fillOpacity: 0.2,
        }}
      />

      {/* High Risk */}
      <CircleAny
        center={center}
        radius={
          highRiskRadius *
          spreadMultiplier
        }
        pathOptions={{
          color,
          fillColor: color,
          fillOpacity: 0.4,
        }}
      />

      {/* User Marker */}
      <MarkerAny position={userLocation}>
        <PopupAny>
          📍 You Are Here
        </PopupAny>
      </MarkerAny>

      {/* Evacuation Route */}
      <PolylineAny
        positions={evacuationRoute}
        pathOptions={{
          color: "#10b981",
          weight: 6,
        }}
      />

      {/* Shelters */}
      {shelters.map(
        (shelter, index) => (
          <MarkerAny
            key={`shelter-${index}`}
            position={
              shelter.position
            }
          >
            <PopupAny>
              🏠 {shelter.name}
            </PopupAny>
          </MarkerAny>
        )
      )}

      {/* Hospitals */}
      {hospitals.map(
        (hospital, index) => (
          <MarkerAny
            key={`hospital-${index}`}
            position={
              hospital.position
            }
          >
            <PopupAny>
              🏥 {hospital.name}
            </PopupAny>
          </MarkerAny>
        )
      )}

      </MapContainerAny>

      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-xl shadow-lg border z-[1000]">
  <h3 className="font-semibold mb-2">
    Flood Risk Zones
  </h3>

  <div className="space-y-2 text-sm">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-red-500"></div>
      <span>High Risk</span>
    </div>

    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-orange-400"></div>
      <span>Medium Risk</span>
    </div>

    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-yellow-300"></div>
      <span>Low Risk</span>
    </div>

    <div className="flex items-center gap-2">
      <div className="w-4 h-1 bg-green-500"></div>
      <span>Evacuation Route</span>
    </div>
  </div>
</div>

</div>
  );
}