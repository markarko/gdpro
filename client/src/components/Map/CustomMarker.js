import React from 'react';
import { Marker, Popup } from 'react-leaflet';

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