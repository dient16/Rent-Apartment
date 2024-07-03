import axios from './axiosConfig';

export const apiGetServices = (): Promise<Res> =>
   axios({
      url: '/amenity',
      method: 'get',
   });
