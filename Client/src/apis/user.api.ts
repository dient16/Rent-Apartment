import axios from './axiosConfig';

export const apiGetCurrentUser = (): Promise<Res> =>
   axios({
      url: '/user/current-user',
      method: 'get',
      withCredentials: true,
   });
export const apiEditUser = (data: FormData): Promise<Res> =>
   axios({
      url: '/user',
      method: 'put',
      data,
   });
