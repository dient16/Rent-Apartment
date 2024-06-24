import { default as to } from 'await-to-js';
import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/serviceResponse/serviceResponse';

import PricingModel from './pricingModel';
import type { Pricing } from './pricingSchema';

export const pricingService = {
  async updatePricing(roomId: string, date: Date, price: number) {
    const [err, existingPricing] = await to(
      PricingModel.findOneAndUpdate({ roomId, date }, { price }, { new: true, upsert: true }).exec()
    );

    if (err) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error updating pricing',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    if (!existingPricing) {
      return new ServiceResponse(ResponseStatus.Failed, 'Failed to update pricing', null, StatusCodes.NOT_FOUND);
    }

    return new ServiceResponse<Pricing>(
      ResponseStatus.Success,
      'Pricing updated successfully',
      existingPricing,
      StatusCodes.OK
    );
  },
};
