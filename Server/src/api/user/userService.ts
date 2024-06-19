import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/schemaResponse/serviceResponse';
import { logger } from '@/server';

import type { IUser } from './userModel';
import UserModel from './userModel';

export const userService = {
  findAll: async (): Promise<ServiceResponse<IUser[] | null>> => {
    try {
      const users = await UserModel.find().exec();
      if (!users || users.length === 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Users found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<IUser[]>(ResponseStatus.Success, 'Users found', users, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all users: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findById: async (id: string): Promise<ServiceResponse<IUser | null>> => {
    try {
      const user = await UserModel.findById(id)
        .select('-confirmationToken -password -createApartments -emailConfirmed -provider -isAdmin -refreshToken')
        .exec();
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }

      return new ServiceResponse<IUser>(ResponseStatus.Success, 'User found', user, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  update: async (id: string, updateData: Partial<IUser>): Promise<ServiceResponse<IUser | null>> => {
    try {
      const user = await UserModel.findByIdAndUpdate(id, updateData, {
        new: true,
      }).exec();
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<IUser>(ResponseStatus.Success, 'User updated successfully', user, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating user with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
