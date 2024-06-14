import to from 'await-to-js';
import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/schemaResponse/serviceResponse';
import { logger } from '@/server';

import type { Service as ServiceType } from './serviceModel';
import Service from './serviceModel';

export const serviceService = {
  async createService(title: string, description?: string): Promise<ServiceResponse<ServiceType | null>> {
    const [errExistingService, existingService] = await to(Service.findOne({ title }).exec());

    if (errExistingService) {
      const errorMessage = 'Error finding service';
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    if (existingService) {
      const errorMessage = 'Service with the same title already exists';
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.BAD_REQUEST);
    }

    const [errCreateService, newService] = await to(Service.create({ title, description }));

    if (errCreateService) {
      const errorMessage = 'Error creating service';
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return new ServiceResponse<ServiceType>(
      ResponseStatus.Success,
      'Service created successfully',
      newService,
      StatusCodes.CREATED
    );
  },

  async getServices(): Promise<ServiceResponse<ServiceType[] | null>> {
    const [errGetServices, services] = await to(Service.find({}).exec());

    if (errGetServices) {
      const errorMessage = 'Error getting services';
      logger.error(errGetServices);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    if (!services || services.length === 0) {
      return new ServiceResponse(ResponseStatus.Failed, 'No services found', null, StatusCodes.NOT_FOUND);
    }

    return new ServiceResponse<ServiceType[]>(
      ResponseStatus.Success,
      'Get services successfully',
      services,
      StatusCodes.OK
    );
  },

  async updateService(sid: string, title: string, description?: string): Promise<ServiceResponse<ServiceType | null>> {
    const [errFindService, service] = await to(Service.findById(sid).exec());

    if (errFindService) {
      const errorMessage = 'Internal server error';
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    if (!service) {
      return new ServiceResponse(ResponseStatus.Failed, 'Service does not exist', null, StatusCodes.NOT_FOUND);
    }

    const [errUpdateService, updatedService] = await to(
      Service.findByIdAndUpdate(sid, { title, description }, { new: true }).exec()
    );

    if (errUpdateService) {
      const errorMessage = 'Error updating service';
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return new ServiceResponse<ServiceType>(
      ResponseStatus.Success,
      'Service updated successfully',
      updatedService,
      StatusCodes.OK
    );
  },

  async deleteService(sid: string): Promise<ServiceResponse<ServiceType | null>> {
    const [errFindService, service] = await to(Service.findById(sid).exec());

    if (errFindService) {
      const errorMessage = 'Error finding service';
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    if (!service) {
      return new ServiceResponse(ResponseStatus.Failed, 'Service does not exist', null, StatusCodes.NOT_FOUND);
    }

    const [errDeleteService] = await to(Service.findByIdAndRemove(sid).exec());

    if (errDeleteService) {
      const errorMessage = 'Error deleting service';
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return new ServiceResponse<ServiceType>(
      ResponseStatus.Success,
      'Service deleted successfully',
      service,
      StatusCodes.OK
    );
  },
};
