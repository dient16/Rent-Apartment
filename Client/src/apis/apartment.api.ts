import axios from './axiosConfig';

export const apiCreateApartment = (data: Apartment): Promise<Res> =>
   axios({
      url: '/apartment',
      method: 'post',
      data,
   });
export const apiSearchRoom = (params: string): Promise<Res> =>
   axios({
      url: `/apartment/search?limit=4&${params}`,
      method: 'get',
   });
export const apiApartmentDetail = (
   apartmentId: string,
   params: string,
): Promise<Res> =>
   axios({
      url: `/apartment/${apartmentId}?${params}`,
      method: 'get',
   });
export const apiCreateStripePayment = (data: {
   amount: number;
   description?: string;
   source?: string;
}): Promise<{ data: string }> =>
   axios({
      url: `/apartment/create-stripe-payment`,
      method: 'post',
      data,
   });
export const apiGetRoomCheckout = ({
   roomIds,
   roomNumbers,
   params,
}: {
   roomIds: string[];
   roomNumbers: number[];
   params: string;
}): Promise<Res> => {
   const roomParams = roomIds
      .map(
         (id, index) =>
            `roomIds[]=${encodeURIComponent(
               id,
            )}&roomNumbers[]=${encodeURIComponent(roomNumbers[index])}`,
      )
      .join('&');

   const url = `/apartment/get-room-checkout?${roomParams}&${params}`;

   return axios({
      url,
      method: 'get',
   });
};
export const apiGetApartmentByUser = (): Promise<Res> =>
   axios({
      url: `/apartment/by-user`,
      method: 'get',
   });
export const apiGetApartmentPopular = (): Promise<Res> =>
   axios({
      url: `/apartment/popular-rooms`,
      method: 'get',
   });
export const apiGetRoomByApartmentId = (id: string): Promise<Res> =>
   axios({
      url: `/room/apartments/${id}`,
      method: 'get',
   });
export const apiGetPricingByRoomId = (id: string): Promise<Res> =>
   axios({
      url: `/pricing/${id}`,
      method: 'get',
   });
export const apiGetApartmentDetails = (apartmentId: string): Promise<Res> =>
   axios({
      url: `/room/apartments/${apartmentId}`,
      method: 'get',
   });
export const apiUpdatePricing = (
   roomId: string,
   date: string,
   price: number,
): Promise<Res> =>
   axios({
      url: `/pricing`,
      method: 'put',
      data: {
         roomId,
         date,
         price,
      },
   });
