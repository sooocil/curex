"use client";

import dynamic from "next/dynamic";

const DynamicMapComponent = dynamic(() => import("@/app/Interview/[userId]/results/map-component"), {
  ssr: false,
});

export default DynamicMapComponent;
