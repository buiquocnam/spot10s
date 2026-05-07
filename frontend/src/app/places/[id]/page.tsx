import React from "react";
import PlaceDetailView from "@/features/places/components/PlaceDetailView";

export default function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  return <PlaceDetailView id={unwrappedParams.id} />;
}
