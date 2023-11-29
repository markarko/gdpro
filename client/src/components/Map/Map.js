import { Icon } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import CustomMarker from './CustomMarker';

import 'leaflet/dist/leaflet.css';
import './Map.css';
import markerImage from '../../img/marker-icon.png';

const customIcon = new Icon({
  iconUrl: markerImage,
  iconSize: [38, 38],
  iconAnchor: [22, 30],
});

/**
 * Map component used for displaying the map
 * Implements MapContainer from react-leaflet
 * Tiles from openstreetmap.org
 * And a CustomMarker component for displaying the markers 
 *
 * @param {Object} gdp - The gdp data
 * @param {Object} protein - The protein data
 * @returns JSX Map Component with the map
 */


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
      gppd: matchingProteinItem ? matchingProteinItem.gppd : null,
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
        center={[0, 0]}
        zoom={2}
        zoomControl={true}
        updateWhenZooming={false}
        updateWhenIdle={true}
        preferCanvas={true}
        minZoom={3}
        maxZoom={16}
      >
        <TileLayer attribution={attribution} url={tileUrl} />
        {filterGdp && gdp.length > 0
          ? gdp.map((data) => <CustomMarker
            key={data.country}
            data={data}
            icon={customIcon} />)
          : filterProtein && protein.length > 0
            ? protein.map((data) => <CustomMarker
              key={data.country}
              data={data}
              icon={customIcon} />)
            : mergedData.length > 0
              ? mergedData.map((data) => <CustomMarker
                key={data.country}
                data={data} 
                icon={customIcon} />)
              : null}
      </MapContainer>
    </div>
  );
}
