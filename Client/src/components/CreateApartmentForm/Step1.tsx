import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { InputField, SelectField } from '@/components';
import { Provinces } from '@/utils/location/provinces';
import { Districts } from '@/utils/location/districts';
import { Wards } from '@/utils/location/wards';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
   iconRetinaUrl: markerIcon2x,
   iconUrl: markerIcon,
   shadowUrl: markerShadow,
});

const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/reverse';

export const getAddressFromLatLng = async (lat: number, lng: number) => {
   try {
      const response = await axios.get(NOMINATIM_API_URL, {
         params: {
            lat,
            lon: lng,
            format: 'json',
            'accept-language': 'vi',
         },
      });

      if (response.status === 200) {
         const address = response.data;
         return address;
      } else {
         throw new Error('Nominatim API error');
      }
   } catch (error) {
      console.error('Error fetching address:', error);
      throw error;
   }
};

const Step1: React.FC = () => {
   const { setValue } = useFormContext();
   const [position, setPosition] = useState<{
      lat: number;
      lng: number;
   } | null>(null);

   const [districtsOption, setDistrictsOption] = useState([]);
   const [wardsOption, setWardsOption] = useState([]);

   const handleProvinceChange = (selectedProvinceCode: number) => {
      const filteredDistricts = Districts.filter(
         (district) => district.province_code === selectedProvinceCode,
      );
      setDistrictsOption(filteredDistricts);
      setWardsOption([]);
      setValue('location.district', '');
      setValue('location.ward', '');
   };

   const handleDistrictChange = (selectedDistrictCode: number) => {
      const filteredWards = Wards.filter(
         (ward) => ward.district_code === selectedDistrictCode,
      );
      setWardsOption(filteredWards);
      setValue('location.ward', '');
   };

   const LocationMarker = () => {
      useMapEvents({
         async click(e) {
            setPosition(e.latlng);
            setValue('location.lat', e.latlng.lat);
            setValue('location.long', e.latlng.lng);

            try {
               const address = await getAddressFromLatLng(
                  e.latlng.lat,
                  e.latlng.lng,
               );
               setValue(
                  'location.province',
                  address.address?.state ?? address.address?.city,
               );
               setValue(
                  'location.district',
                  address.address?.county ??
                     address.address?.suburb ??
                     address.address?.town ??
                     address.address?.city_district,
               );
               setValue(
                  'location.ward',
                  address.address?.quarter ??
                     address.address?.village ??
                     address.address?.town,
               );

               console.log('Địa chỉ:', address);
            } catch (error) {
               console.error('Error fetching address:', error);
            }
         },
      });

      return position === null ? null : <Marker position={position} />;
   };

   return (
      <div className="p-6 bg-white rounded-lg shadow-md">
         <div className="flex flex-col gap-5">
            <InputField
               name="title"
               label="Title"
               rules={{ required: 'Title is required' }}
            />
            <InputField
               name="description"
               label="Description"
               rules={{ required: 'Description is required' }}
               type="textarea"
               rows={4}
            />
         </div>
         <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 lg:pr-6">
               <div className="mb-6">
                  <h4 className="block text-lg font-medium text-gray-700 my-5">
                     Location
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
                     <InputField
                        name="location.lat"
                        label="Latitude"
                        rules={{ required: 'Latitude is required' }}
                        type="number"
                        className="w-full"
                     />
                     <InputField
                        name="location.long"
                        label="Longitude"
                        rules={{ required: 'Longitude is required' }}
                        type="number"
                        className="w-full"
                     />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-6">
                     <SelectField
                        name="location.province"
                        label="Province"
                        options={(Provinces || []).map((province) => {
                           return {
                              label: province.name,
                              value: province.code,
                           };
                        })}
                        onChangeSelected={handleProvinceChange}
                        rules={{ required: 'Province is required' }}
                     />
                     <SelectField
                        name="location.district"
                        label="District"
                        options={(districtsOption || []).map((district) => {
                           return {
                              label: district.name,
                              value: district.code,
                           };
                        })}
                        onChangeSelected={handleDistrictChange}
                        rules={{ required: 'District is required' }}
                     />
                     <SelectField
                        name="location.ward"
                        label="Ward"
                        options={wardsOption.map((ward) => ({
                           value: ward.code,
                           label: ward.name,
                        }))}
                        rules={{ required: 'Ward is required' }}
                     />
                  </div>
                  <div className="grid grid-cols-1 gap-6 mt-6">
                     <InputField
                        name="location.street"
                        label="Street"
                        rules={{ required: 'Street is required' }}
                     />
                  </div>
               </div>
            </div>
            <div className="lg:w-1/2 lg:pl-6 mt-6 lg:mt-6 h-96">
               <MapContainer
                  center={[10.762622, 106.660172]}
                  zoom={13}
                  className="w-full h-full rounded-md shadow-sm"
               >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker />
               </MapContainer>
            </div>
         </div>
      </div>
   );
};

export default Step1;
