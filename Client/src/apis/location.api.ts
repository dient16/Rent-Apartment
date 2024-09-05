import axios, { AxiosResponse } from 'axios';

const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/reverse';
export const apiGetAddress = (
   lat: number,
   lng: number,
): Promise<AxiosResponse> =>
   axios({
      url: NOMINATIM_API_URL,
      method: 'get',
      params: {
         lat,
         lon: lng,
         format: 'json',
         'accept-language': 'vi',
      },
   });
