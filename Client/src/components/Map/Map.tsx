import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import icons from '@/assets/placeholder.png';

const icon = L.icon({
   iconUrl: icons,
   iconSize: [50, 50],
});

interface Position {
   lat: number;
   lon: number;
}

interface ResetCenterViewProps {
   selectPosition: Position | null;
}

const ResetCenterView: React.FC<ResetCenterViewProps> = ({
   selectPosition,
}) => {
   const map = useMap();

   useEffect(() => {
      if (selectPosition) {
         map.setView(
            L.latLng(selectPosition.lat, selectPosition.lon),
            map.getZoom(),
            {
               animate: true,
            },
         );
      }
   }, [selectPosition, map]);

   return null;
};

interface MapsProps {
   selectPosition: Position | null;
}

const Maps: React.FC<MapsProps> = ({ selectPosition }) => {
   const locationSelection: LatLngExpression = selectPosition
      ? [selectPosition.lat, selectPosition.lon]
      : [51.505, -0.09];
   return (
      <MapContainer
         center={locationSelection}
         zoom={16}
         style={{ width: '100%', height: '100%' }}
      >
         <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            //https://api.maptiler.com/maps/streets-v2/?key=qEOvROLB56v7UAc2gvdZ#
         />
         {selectPosition && (
            <Marker position={locationSelection} icon={icon}>
               <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
               </Popup>
            </Marker>
         )}
         <ResetCenterView selectPosition={selectPosition} />
      </MapContainer>
   );
};

export default Maps;
