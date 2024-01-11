import React from 'react';
import { Marker, Popup } from 'react-leaflet';

/**
 * CustomMarker component used for displaying the markers on the map
 * Creates popup with the data for each marker
 * @param {Object} data - The data
 * @param {Object} icon - The icon
 * @returns JSX CustomMarker Component with the markers
 */


const CustomMarker = ({ data, icon }) => 
  <Marker key={data.country} position={data.position} icon={icon}>
    <Popup>
      <div>
        <p>Country: {data.country}</p>
        {data.gdp && <p>GDP: {data.gdp}</p>}
        {data.gppd && <p>Protein: {data.gppd}</p>}
      </div>
    </Popup>
  </Marker>;

export default CustomMarker;