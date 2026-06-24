"use client";

import dynamic from "next/dynamic";

const CrisisMap = dynamic(
  () => import("./CrisisMap"),
  {
    ssr: false,
  }
);

export default function MapWrapper({
  hazard,
  forecast,
}: {
  hazard: string;
  forecast: number;
}) {
  return (
    <CrisisMap
      hazard={hazard}
      forecast={forecast}
    />
  );
}