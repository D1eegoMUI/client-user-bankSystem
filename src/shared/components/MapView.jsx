import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export const MapView = ({ latitude, longitude }) => {
  if (!latitude || !longitude) {
    return (
      <div className="h-64 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
        Ubicación no disponible
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-2xl border border-gray-200"
      style={{ isolation: "isolate" }}
    >
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={true}
        style={{
          height: "300px",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[latitude, longitude]} />
      </MapContainer>
    </div>
  );
};