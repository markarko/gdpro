import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import './Map.css';
import markerImage from '../../img/marker-icon.png';

const customIcon = new Icon({
  iconUrl: markerImage,
  iconSize: [38, 38],
  iconAnchor: [22, 30],
});

// export default function MontrealMap({gdp, protein, position}) {
export default function MontrealMap({gdp, protein}) {
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  
  return (
    <div className="ui-container">
      <MapContainer
        center={[45.5, -73.6]}
        zoom={3}
        zoomControl={true}
        updateWhenZooming={false}
        updateWhenIdle={true}
        preferCanvas={true}
        minZoom={10}
        maxZoom={16}
      >
        <TileLayer attribution={attribution} url={tileUrl} />
        {protein && protein.length > 0 && protein.map(data =>
          <Marker key={data.country} position={data.position} icon={customIcon}>
            <Popup>
              {data.protein}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
