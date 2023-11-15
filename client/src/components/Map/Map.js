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

export default function Map({gdp, protein}) {
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  let filterGdp = false;
  let filterProtein = false;
  const mergedData = gdp.map((gdpItem) => {
    const matchingProteinItem = protein.find(
      (proteinItem) => proteinItem.country === gdpItem.country
    );
  
    return {
      ...gdpItem,
      protein: matchingProteinItem ? matchingProteinItem.protein : null,
    };
  });
  if (gdp.length > protein.length && protein.length === 0) {
    filterGdp = true;
  }else if(protein.length > gdp.length && gdp.length === 0) {
    filterProtein = true;
  }
  

  return (
    <div className="ui-container">
      <MapContainer
        center={[45.5, -73.6]}
        zoom={3}
        zoomControl={true}
        updateWhenZooming={false}
        updateWhenIdle={true}
        preferCanvas={true}
        minZoom={3}
        maxZoom={16}
      >
        <TileLayer attribution={attribution} url={tileUrl} />
        {filterGdp && gdp.length > 0
          ? gdp.map((data) => 
            <Marker key={data.country} position={data.position} icon={customIcon}>
              <Popup>
                <div>
                  <p>Country: {data.country}</p>
                  <p>GDP: {data.gdp}</p>
                </div>
              </Popup>
            </Marker>
          )
          : filterProtein && protein.length > 0
            ? protein.map((data) => 
              <Marker key={data.country} position={data.position} icon={customIcon}>
                <Popup>
                  <div>
                    <p>Country: {data.country}</p>
                    <p>Protein: {data.protein}</p>
                  </div>
                </Popup>
              </Marker>
            )
            : mergedData.length > 0
              ? mergedData.map((data) => 
                <Marker key={data.country} position={data.position} icon={customIcon}>
                  <Popup>
                    <div>
                      <p>Country: {data.country}</p>
                      <p>GDP: {data.gdp}</p>
                      <p>Protein: {data.protein}</p>
                    </div>
                  </Popup>
                </Marker>
              )
              : null}
      </MapContainer>
    </div>
  );
}
