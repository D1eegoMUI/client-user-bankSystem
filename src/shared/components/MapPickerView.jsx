import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Sub-componente que recibe clicks del mapa
const ClickHandler = ({ onPick, editable }) => {
  useMapEvents({
    click(e) {
      if (!editable) return;
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Sub-componente que mueve la vista cuando cambian las coordenadas externamente
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
};

/**
 * MapPickerView
 * - editable=false → solo muestra la ubicación (igual que MapView)
 * - editable=true  → el usuario puede hacer click para mover el marcador
 *
 * Props:
 *   latitude  {number|null}
 *   longitude {number|null}
 *   onPick    {(lat, lng) => void}  — requerido cuando editable=true
 *   editable  {boolean}
 */
export const MapPickerView = ({ latitude, longitude, onPick, editable = false }) => {
  const hasCoords = latitude != null && longitude != null && latitude !== "" && longitude !== "";

  const defaultCenter = [-14.0, -75.0]; // centro genérico si no hay coords
  const center = hasCoords ? [Number(latitude), Number(longitude)] : defaultCenter;

  return (
    <div className="space-y-2">
      {editable && (
        <p className="text-xs text-gray-500">
          Haz clic en el mapa para actualizar la ubicación del usuario.
        </p>
      )}

      <div
        className={`overflow-hidden rounded-2xl border ${
          editable
            ? "border-green-300 ring-2 ring-green-100 cursor-crosshair"
            : "border-gray-200"
        }`}
      >
        <MapContainer
          center={center}
          zoom={hasCoords ? 14 : 5}
          scrollWheelZoom={true}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {hasCoords && (
            <>
              <Marker position={[Number(latitude), Number(longitude)]} />
              <RecenterMap lat={Number(latitude)} lng={Number(longitude)} />
            </>
          )}

          <ClickHandler onPick={onPick ?? (() => {})} editable={editable} />
        </MapContainer>
      </div>

      {hasCoords && (
        <div className="flex gap-4 text-xs text-gray-500">
          <span>Lat: <span className="font-mono text-slate-700">{Number(latitude).toFixed(6)}</span></span>
          <span>Lng: <span className="font-mono text-slate-700">{Number(longitude).toFixed(6)}</span></span>
        </div>
      )}

      {!hasCoords && (
        <p className="text-xs text-gray-400 italic">
          {editable ? "Ninguna ubicación seleccionada. Haz clic en el mapa." : "Ubicación no disponible."}
        </p>
      )}
    </div>
  );
};