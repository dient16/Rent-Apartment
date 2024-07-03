import { default as to } from 'await-to-js';
import { StatusCodes } from 'http-status-codes';
import mongoose, { Types } from 'mongoose';
import Stripe from 'stripe';

import Room from '@/api/room/roomModel';
import User from '@/api/user/userModel';
import { ResponseStatus, ServiceResponse } from '@/common/serviceResponse/serviceResponse';
import { env } from '@/common/utils/envConfig';

import { roomService } from '../room/roomService';
import ApartmentModel from './apartmentModel';
import type { CreateRoom, Location } from './apartmentSchema';
const { STRIPE_SECRET_KEY } = env;
export const apartmentService = {
  async getAllApartments() {
    const [err, apartments] = await to(
      ApartmentModel.find({})
        .populate({
          path: 'rooms.services',
        })
        .populate({
          path: 'createBy',
        })
        .exec()
    );

    if (err) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error getting apartments',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    return new ServiceResponse(ResponseStatus.Success, 'Apartments retrieved successfully', apartments, StatusCodes.OK);
  },

  async getApartmentDetail(apartmentId: string, query: any) {
    const { startDate, endDate, numberOfGuest, roomNumber, minPrice, maxPrice } = query;

    const startDay = startDate ? new Date(startDate) : null;
    const endDay = endDate ? new Date(endDate) : null;
    const today = new Date(Date.now());

    if ((startDay && startDay < today) || (endDay && endDay < today)) {
      return new ServiceResponse(ResponseStatus.Failed, 'Invalid start or end date', null, StatusCodes.BAD_REQUEST);
    }

    const [err, apartment] = await to(
      ApartmentModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(apartmentId) } },
        {
          $lookup: {
            from: 'rooms',
            localField: '_id',
            foreignField: 'apartmentId',
            as: 'rooms',
          },
        },
        { $unwind: '$rooms' },
        {
          $match: {
            'rooms.numberOfGuest': { $gte: numberOfGuest },
            'rooms.quantity': { $gte: roomNumber },
            $or: [
              { 'rooms.unavailableDateRanges': null },
              {
                'rooms.unavailableDateRanges': {
                  $not: {
                    $elemMatch: {
                      startDay: { $lt: endDay },
                      endDay: { $gt: startDay },
                    },
                  },
                },
              },
            ],
            'rooms.price': { $gte: minPrice, $lte: maxPrice },
          },
        },
        {
          $lookup: {
            from: 'services',
            localField: 'rooms.services',
            foreignField: '_id',
            as: 'rooms.services',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'createBy',
            foreignField: '_id',
            as: 'createBy',
          },
        },
        { $unwind: '$createBy' },
        {
          $group: {
            _id: '$_id',
            title: { $first: '$title' },
            location: { $first: '$location' },
            createBy: { $first: '$createBy' },
            rooms: {
              $push: {
                $mergeObjects: [
                  '$rooms',
                  {
                    services: {
                      $map: {
                        input: '$rooms.services',
                        as: 'service',
                        in: {
                          title: '$$service.title',
                          image: '$$service.image',
                        },
                      },
                    },
                    images: {
                      $map: {
                        input: '$rooms.images',
                        as: 'image',
                        in: {
                          $concat: [`${process.env.SERVER_URL}/api/image/`, '$$image'],
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            location: 1,
            'createBy._id': 1,
            'createBy.firstname': 1,
            'createBy.lastname': 1,
            'createBy.avatar': 1,
            rooms: 1,
          },
        },
        { $limit: 1 },
      ]).exec()
    );

    if (err) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error retrieving apartment',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    if (!apartment || !apartment[0]) {
      return new ServiceResponse(ResponseStatus.Failed, 'Apartment not found', null, StatusCodes.NOT_FOUND);
    }

    return new ServiceResponse(
      ResponseStatus.Success,
      'Apartment retrieved successfully',
      apartment[0],
      StatusCodes.OK
    );
  },

  async createApartment(
    createBy: string,
    title: string,
    description: string,
    location: Location,
    rooms: CreateRoom[],
    houseRules?: string[],
    checkInTime?: string,
    checkOutTime?: string,
    safetyInfo?: string[],
    cancellationPolicy?: string[],
    discounts?: string[]
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const [errApartment, newApartment] = await to(
        ApartmentModel.create(
          [
            {
              title,
              description,
              location,
              owner: createBy,
              rooms: [],
              images: [],
              houseRules,
              checkInTime,
              checkOutTime,
              safetyInfo,
              cancellationPolicy,
              discounts,
            },
          ],
          { session }
        )
      );

      if (errApartment || !newApartment || newApartment.length === 0) {
        await session.abortTransaction();
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Failed to create apartment',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const apartmentId = newApartment[0]._id;
      const roomIds: Types.ObjectId[] = [];

      for (const room of rooms) {
        const roomResponse = await roomService.addRoomToApartment(apartmentId, room, session);

        if (!roomResponse.success) {
          await session.abortTransaction();
          return roomResponse;
        }

        roomIds.push(roomResponse.data!._id);
      }

      const [errUpdateApartment] = await to(
        ApartmentModel.findByIdAndUpdate(apartmentId, { $set: { rooms: roomIds } }, { new: true, session })
      );

      if (errUpdateApartment) {
        await session.abortTransaction();
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Failed to update apartment with room IDs',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const [errUpdateUser] = await to(
        User.findByIdAndUpdate(createBy, { $push: { createApartments: apartmentId } }, { new: true, session })
      );

      if (errUpdateUser) {
        await session.abortTransaction();
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Failed to update user',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      await session.commitTransaction();
      session.endSession();

      const populatedRooms = await Room.find({ _id: { $in: roomIds } }).populate('amenities');

      const response = {
        ...newApartment[0].toObject(),
        rooms: populatedRooms,
      };

      return new ServiceResponse(ResponseStatus.Success, 'Apartment created successfully', response, StatusCodes.OK);
    } catch (error) {
      console.log('createApartment error: %s', error);
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error('Error aborting transaction:', abortError);
      } finally {
        session.endSession();
      }
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error creating apartment',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    } finally {
      session.endSession();
    }
  },
  async searchApartments(query: any) {
    const {
      numberOfGuest,
      roomNumber,
      province,
      district,
      ward,
      street,
      startDate,
      endDate,
      name,
      minPrice,
      maxPrice,
      limit,
      page,
    } = query;

    const roomQuery = {
      numberOfGuest: { $gte: numberOfGuest },
      quantity: { $gte: roomNumber },
      unavailableDateRanges: {
        $not: {
          $elemMatch: {
            startDay: { $lte: endDate },
            endDay: { $gte: startDate },
          },
        },
      },
      price: { $gte: minPrice || 0, $lte: maxPrice },
    };

    const [roomError, rooms] = await to(Room.find(roomQuery).populate('amenities').exec());
    if (roomError) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error searching rooms',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    const apartmentIds = [...new Set(rooms.map((room) => room.apartmentId))];

    const textSearchString = `${province || ''} ${district || ''} ${ward || ''} ${street || ''} ${name || ''}`.trim();

    const initialMatch = {
      $match: {
        _id: { $in: apartmentIds },
        ...(textSearchString && { $text: { $search: textSearchString } }),
      },
    };

    const queryObj = {
      'rooms.price': { $gte: minPrice, $lte: maxPrice },
    };
    const [error, aggregateResult] = await to(
      ApartmentModel.aggregate([
        initialMatch,
        {
          $facet: {
            paginatedResult: [
              {
                $lookup: {
                  from: 'rooms',
                  localField: '_id',
                  foreignField: 'apartmentId',
                  as: 'rooms',
                },
              },
              { $unwind: '$rooms' },
              { $match: queryObj },
              {
                $group: {
                  _id: '$_id',
                  roomPriceMin: { $min: '$rooms.price' },
                  roomId: { $first: '$rooms._id' },
                  title: { $first: '$title' },
                  location: { $first: '$location' },
                  numberOfGuest: { $first: '$rooms.numberOfGuest' },
                  quantity: { $first: '$rooms.quantity' },
                  reviews: { $first: '$rooms.reviews' },
                  images: { $first: '$rooms.images' },
                  amenities: { $first: '$rooms.amenities' },
                },
              },
              {
                $project: {
                  _id: 1,
                  roomId: 1,
                  name: '$title',
                  address: {
                    street: '$location.street',
                    ward: '$location.ward',
                    district: '$location.district',
                    province: '$location.province',
                  },
                  image: {
                    $concat: [
                      `${process.env.SERVER_URL}/api/image/`,
                      { $arrayElemAt: [{ $ifNull: ['$images', []] }, 0] },
                    ],
                  },
                  price: '$roomPriceMin',
                  numberOfGuest: 1,
                  quantity: 1,
                  amenities: {
                    $slice: ['$amenities.name', 3],
                  },
                  rating: {
                    ratingAvg: {
                      $cond: {
                        if: { $gt: [{ $size: { $ifNull: ['$reviews', []] } }, 0] },
                        then: { $avg: '$reviews.score' },
                        else: 0,
                      },
                    },
                    totalRating: {
                      $cond: {
                        if: { $gt: [{ $size: { $ifNull: ['$reviews', []] } }, 0] },
                        then: { $sum: '$reviews.score' },
                        else: 0,
                      },
                    },
                  },
                },
              },
              { $skip: (page - 1) * limit },
              { $limit: limit },
            ],
            totalCount: [
              { $unwind: '$rooms' },
              { $match: queryObj },
              {
                $group: {
                  _id: '$_id',
                  roomPriceMin: { $min: '$rooms.price' },
                },
              },
              { $count: 'totalCount' },
            ],
          },
        },
      ]).exec()
    );
    if (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error searching apartments',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    const { paginatedResult, totalCount } = aggregateResult[0];
    const totalResults = totalCount.length > 0 ? totalCount[0].totalCount : 0;

    return new ServiceResponse(
      ResponseStatus.Success,
      'Apartments retrieved successfully',
      {
        page,
        pageResults: paginatedResult.length,
        totalResults,
        apartments: paginatedResult,
      },
      StatusCodes.OK
    );
  },

  async updateApartment(apartmentId: string, updateData: any, updatedBy: string) {
    const roomsInApartment = updateData.rooms.map((room: any) => {
      return {
        ...room,
        services: room.services.map((service: any) => new mongoose.Types.ObjectId(service)),
      };
    });
    const [err, updatedApartment] = await to(
      ApartmentModel.findByIdAndUpdate(
        apartmentId,
        {
          title: updateData.title,
          updatedBy,
          rooms: roomsInApartment,
          updatedAt: new Date(),
        },
        { new: true }
      )
    );

    if (err) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error updating apartment',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    if (!updatedApartment) {
      return new ServiceResponse(ResponseStatus.Failed, 'Apartment not found', null, StatusCodes.NOT_FOUND);
    }

    return new ServiceResponse(
      ResponseStatus.Success,
      'Apartment updated successfully',
      updatedApartment,
      StatusCodes.OK
    );
  },

  async deleteApartment(apartmentId: string, ownerId: string) {
    const [err, deletedApartment] = await to(
      ApartmentModel.findOneAndDelete({
        _id: apartmentId,
        owner: ownerId,
      })
    );

    if (err) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error deleting apartment',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    if (!deletedApartment) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Apartment not found or you do not have permission to delete it',
        null,
        StatusCodes.NOT_FOUND
      );
    }

    const [errUpdateUser] = await to(
      User.findByIdAndUpdate(ownerId, {
        $pull: { createApartments: apartmentId },
      })
    );

    if (errUpdateUser) {
      return new ServiceResponse(ResponseStatus.Failed, 'Error updating user', null, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return new ServiceResponse(
      ResponseStatus.Success,
      'Apartment deleted successfully',
      deletedApartment,
      StatusCodes.OK
    );
  },

  async removeRoomFromApartment(apartmentId: string, roomId: string, removedBy: string) {
    const [err, updatedApartment] = await to(
      ApartmentModel.findByIdAndUpdate(
        apartmentId,
        {
          $pull: { rooms: { _id: roomId } },
          updatedBy: removedBy,
          updatedAt: new Date(),
        },
        { new: true }
      )
    );

    if (err) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error removing room from apartment',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    if (!updatedApartment) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Apartment not found or you do not have permission to remove a room',
        null,
        StatusCodes.NOT_FOUND
      );
    }

    return new ServiceResponse(
      ResponseStatus.Success,
      'Room removed from apartment successfully',
      updatedApartment,
      StatusCodes.OK
    );
  },

  async findRoomById(roomId: string, query: any) {
    const { start_date, end_date, room_number } = query;

    const roomIdObj = new mongoose.Types.ObjectId(roomId);

    const startDay = new Date(start_date);
    const endDay = new Date(end_date);

    if (Number.isNaN(startDay.getTime()) || Number.isNaN(endDay.getTime())) {
      return new ServiceResponse(ResponseStatus.Failed, 'Invalid start or end date', null, StatusCodes.BAD_REQUEST);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDay < today || endDay < today) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'The start date or end date cannot be earlier than the current date',
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const pipeline = [
      { $match: { _id: roomIdObj } },
      {
        $match: {
          $or: [
            {
              unavailableDateRanges: {
                $not: {
                  $elemMatch: {
                    startDay: { $lte: startDay },
                    endDay: { $gte: endDay },
                  },
                },
              },
            },
            { unavailableDateRanges: { $exists: false } },
          ],
        },
      },
      {
        $match: {
          quantity: { $gte: Number.parseInt(room_number, 10) || 1 },
        },
      },
      {
        $lookup: {
          from: 'apartments',
          localField: 'apartmentId',
          foreignField: '_id',
          as: 'apartment',
        },
      },
      { $unwind: '$apartment' },
      {
        $lookup: {
          from: 'services',
          localField: 'services',
          foreignField: '_id',
          as: 'services',
        },
      },
      {
        $project: {
          _id: 0,
          title: '$apartment.title',
          location: '$apartment.location',
          room: {
            _id: '$_id',
            price: '$price',
            size: '$size',
            roomType: '$roomType',
            numberOfGuest: '$numberOfGuest',
            quantity: '$quantity',
            reviews: '$reviews',
            services: {
              $slice: [
                {
                  $map: {
                    input: '$services',
                    as: 'service',
                    in: {
                      title: '$$service.title',
                      image: '$$service.image',
                    },
                  },
                },
                4,
              ],
            },
          },
        },
      },
      { $limit: 1 },
    ];

    const result = await Room.aggregate(pipeline).exec();

    if (!result || result.length === 0) {
      return new ServiceResponse(ResponseStatus.Failed, 'Room not found or unavailable', null, StatusCodes.NOT_FOUND);
    }

    const { title, location, room } = result[0];
    return new ServiceResponse(ResponseStatus.Success, 'Room found', { title, location, ...room }, StatusCodes.OK);
  },

  async createStripePayment(amount: number, description: string, source: string) {
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const [err, paymentIntent] = await to(
      stripe.paymentIntents.create({
        amount: amount,
        currency: 'VND',
        description: description,
        source: source,
        automatic_payment_methods: { enabled: true },
      })
    );

    if (err) {
      return new ServiceResponse(ResponseStatus.Failed, err.message, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return new ServiceResponse(
      ResponseStatus.Success,
      'Payment intent created',
      paymentIntent.client_secret,
      StatusCodes.OK
    );
  },

  async getApartmentsByUserId(userId: string) {
    const [err, apartments] = await to(
      ApartmentModel.find({ createBy: userId }).select('title location rooms.images rooms.price').lean().exec()
    );

    if (err) {
      return new ServiceResponse(ResponseStatus.Failed, err.message, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    if (!apartments || apartments.length === 0) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'No apartments found for this user.',
        null,
        StatusCodes.NOT_FOUND
      );
    }

    const formattedApartments = apartments.map((apartment: any) => ({
      title: apartment.title,
      location: apartment.location,
      image:
        apartment.rooms?.length && apartment.rooms[0].images?.length
          ? `${process.env.SERVER_URI}/api/image/${apartment.rooms[0].images[0]}`
          : undefined,
      price: apartment.rooms?.length ? apartment.rooms[0].price : undefined,
    }));

    return new ServiceResponse(
      ResponseStatus.Success,
      'Apartments retrieved successfully',
      formattedApartments,
      StatusCodes.OK
    );
  },
};
