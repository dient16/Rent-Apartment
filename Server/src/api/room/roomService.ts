import { default as to } from 'await-to-js';
import { StatusCodes } from 'http-status-codes';
import mongoose, { Types } from 'mongoose';

import ApartmentModel from '@/api/apartment/apartmentModel';
import Room from '@/api/room/roomModel';
import type { CreateRoom, UpdateRoom } from '@/api/room/roomSchema';
import { ResponseStatus, ServiceResponse } from '@/common/serviceResponse/serviceResponse';

export const roomService = {
  async addRoomToApartment(apartmentId: string, room: CreateRoom, session: mongoose.ClientSession) {
    // __AUTO_GENERATED_PRINT_VAR_START__
    console.log('addRoomToApartment room: %s', room); // __AUTO_GENERATED_PRINT_VAR_END__
    try {
      const amenities = room.amenities.map((amenity: any) => new Types.ObjectId(amenity));

      const [err, newRoom] = await to(
        Room.create(
          [
            {
              ...room,
              amenities,
              apartmentId: new Types.ObjectId(apartmentId),
            },
          ],
          { session }
        )
      );

      if (err || !newRoom || newRoom.length === 0) {
        await session.abortTransaction();
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Failed to create room',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      return new ServiceResponse(
        ResponseStatus.Success,
        'Room added to apartment successfully',
        newRoom[0],
        StatusCodes.OK
      );
    } catch (error) {
      await session.abortTransaction();
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error adding room to apartment',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  async findRoomById(roomId: string) {
    const [err, room] = await to(Room.findById(roomId).populate('amenities').exec());

    if (err) {
      return new ServiceResponse(ResponseStatus.Failed, 'Error finding room', null, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    if (!room) {
      return new ServiceResponse(ResponseStatus.Failed, 'Room not found', null, StatusCodes.NOT_FOUND);
    }

    return new ServiceResponse(ResponseStatus.Success, 'Room found successfully', room, StatusCodes.OK);
  },

  async updateRoom(roomId: string, roomData: UpdateRoom) {
    const [err, updatedRoom] = await to(Room.findByIdAndUpdate(roomId, roomData, { new: true }).exec());

    if (err) {
      return new ServiceResponse(ResponseStatus.Failed, 'Error updating room', null, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    if (!updatedRoom) {
      return new ServiceResponse(ResponseStatus.Failed, 'Room not found', null, StatusCodes.NOT_FOUND);
    }

    return new ServiceResponse(ResponseStatus.Success, 'Room updated successfully', updatedRoom, StatusCodes.OK);
  },

  async deleteRoom(roomId: string) {
    const [err, deletedRoom] = await to(Room.findByIdAndDelete(roomId).exec());

    if (err) {
      return new ServiceResponse(ResponseStatus.Failed, 'Error deleting room', null, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    if (!deletedRoom) {
      return new ServiceResponse(ResponseStatus.Failed, 'Room not found', null, StatusCodes.NOT_FOUND);
    }

    const [errUpdateApartment] = await to(
      ApartmentModel.updateMany({ rooms: roomId }, { $pull: { rooms: roomId } }).exec()
    );

    if (errUpdateApartment) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Failed to update apartment',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    return new ServiceResponse(ResponseStatus.Success, 'Room deleted successfully', deletedRoom, StatusCodes.OK);
  },
};
