import { default as to } from 'await-to-js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import Room from '@/api/room/roomModel';
import User from '@/api/user/userModel';
import { ResponseStatus, ServiceResponse } from '@/common/schemaResponse/serviceResponse';

import Apartment from './apartmentModel';

export const apartmentService = {
  async getAllApartments() {
    const [err, apartments] = await to(
      Apartment.find({})
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

  async getApartment(apartmentId: string, query: any) {
    const { start_date, end_date, number_of_guest, room_number, min_price, max_price } = query;

    const startDay = new Date(start_date);
    const endDay = new Date(end_date);
    const today = new Date(Date.now()).setHours(0, 0, 0, 0);

    if (startDay < today || endDay < today) {
      return new ServiceResponse(ResponseStatus.Failed, 'Invalid start or end date', null, StatusCodes.BAD_REQUEST);
    }

    const numberOfGuest = Number.parseInt(number_of_guest, 10) || 1;
    const roomNumber = Number.parseInt(room_number, 10) || 1;
    const minPrice = Number.parseInt(min_price, 10) || 0;
    const maxPrice = Number.parseInt(max_price, 10) || 1000000000;

    const [err, apartment] = await to(
      Apartment.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(apartmentId) } },
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
        {
          $unwind: '$createBy',
        },
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

  async createApartment(createBy: string, title: string, rooms: any[], location: string, files: any) {
    const roomPromises = rooms.map(async (room, index) => {
      const fieldName = `rooms[${index}][images]`;
      const roomImages = files.filter((image: any) => image.fieldname === fieldName) || [];
      const images = roomImages.map((file: any) => file?.filename);

      const services = room.services.map((service: any) => new mongoose.Types.ObjectId(service));

      const newRoom = await Room.create({
        ...room,
        images,
        services,
        apartmentId: null, // Will be set later
      });

      return newRoom._id;
    });

    const roomIds = await Promise.all(roomPromises);

    const [err, newApartment] = await to(
      Apartment.create({
        title,
        createBy,
        location,
        rooms: roomIds,
      })
    );

    if (err) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error creating apartment',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    await Room.updateMany({ _id: { $in: roomIds } }, { $set: { apartmentId: newApartment._id } });

    let updateUser;
    [err, updateUser] = await to(
      User.findByIdAndUpdate(createBy, { $push: { createApartments: newApartment._id } }, { new: true })
    );

    if (err || !updateUser) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error updating user with new apartment',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    const populatedRooms = await Room.find({ _id: { $in: roomIds } }).populate('services');

    populatedRooms.forEach(async (room) => {
      room.apartmentId = newApartment._id;
      await room.save();
    });

    const response = {
      _id: newApartment._id,
      title: newApartment.title,
      location: newApartment.location,
      createBy: newApartment.createBy,
      rooms: populatedRooms,
    };

    return new ServiceResponse(ResponseStatus.Success, 'Apartment created successfully', response, StatusCodes.OK);
  },

  async searchApartments(query: any) {
    const {
      number_of_guest,
      room_number,
      province,
      district,
      ward,
      street,
      start_date,
      end_date,
      name,
      min_price,
      max_price,
    } = query;

    const parsedStartDay = new Date(start_date);
    const parsedEndDay = new Date(end_date);
    const page = Number.parseInt(query.page, 10) || 1;
    const limit = Number.parseInt(query.limit, 10) || 10;
    const minPrice = Number.parseInt(min_price, 10) || 0;
    const maxPrice = Number.parseInt(max_price, 10) || 1000000000;
    const skip = (page - 1) * limit;
    const today = new Date(Date.now()).setHours(0, 0, 0, 0);

    if (parsedStartDay < today || parsedEndDay < today) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'The start date or end date cannot be earlier than the current date',
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const parsedNumberOfGuest = Number.parseInt(number_of_guest, 10) || 1;
    const parsedQuantity = Number.parseInt(room_number, 10) || 1;

    const roomQuery = {
      numberOfGuest: { $gte: parsedNumberOfGuest },
      quantity: { $gte: parsedQuantity },
      unavailableDateRanges: {
        $not: {
          $elemMatch: {
            startDay: { $lte: parsedEndDay },
            endDay: { $gte: parsedStartDay },
          },
        },
      },
      price: { $gte: minPrice, $lte: maxPrice },
    };

    const [roomError, rooms] = await to(Room.find(roomQuery).populate('services').exec());
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
      Apartment.aggregate([
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
                  services: { $first: '$rooms.services' },
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
                  services: {
                    $slice: ['$services.title', 3],
                  },
                  rating: {
                    ratingAvg: {
                      $cond: {
                        if: {
                          $gt: [{ $size: { $ifNull: ['$reviews', []] } }, 0],
                        },
                        then: { $avg: '$reviews.score' },
                        else: 0,
                      },
                    },
                    totalRating: {
                      $cond: {
                        if: {
                          $gt: [{ $size: { $ifNull: ['$reviews', []] } }, 0],
                        },
                        then: { $sum: '$reviews.score' },
                        else: 0,
                      },
                    },
                  },
                },
              },
              { $skip: skip },
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
      Apartment.findByIdAndUpdate(
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

  async deleteApartment(apartmentId: string, deletedBy: string) {
    const [err, deletedApartment] = await to(
      Apartment.findOneAndDelete({
        _id: apartmentId,
        createdBy: deletedBy,
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

    [err] = await to(
      User.findByIdAndUpdate(deletedBy, {
        $pull: { createdApartments: deletedApartment._id },
      })
    );

    if (err) {
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
      Apartment.findByIdAndUpdate(
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

    if (isNaN(startDay.getTime()) || isNaN(endDay.getTime())) {
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
      { $match: { 'rooms._id': roomIdObj } },
      { $unwind: '$rooms' },
      { $match: { 'rooms._id': roomIdObj } },
      {
        $match: {
          $or: [
            {
              'rooms.unavailableDateRanges': {
                $not: {
                  $elemMatch: {
                    startDay: { $lte: startDay },
                    endDay: { $gte: endDay },
                  },
                },
              },
            },
            { 'rooms.unavailableDateRanges': { $exists: false } },
          ],
        },
      },
      {
        $match: {
          'rooms.quantity': { $gte: Number.parseInt(room_number, 10) || 1 },
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
        $project: {
          _id: 0,
          title: 1,
          location: 1,
          room: {
            _id: '$rooms._id',
            price: '$rooms.price',
            size: '$rooms.size',
            roomType: '$rooms.roomType',
            numberOfGuest: '$rooms.numberOfGuest',
            quantity: '$rooms.quantity',
            reviews: '$rooms.reviews',
            services: {
              $slice: [
                {
                  $map: {
                    input: '$rooms.services',
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

    const result = await Apartment.aggregate(pipeline).exec();

    if (!result || result.length === 0) {
      return new ServiceResponse(ResponseStatus.Failed, 'Room not found or unavailable', null, StatusCodes.NOT_FOUND);
    }

    const { title, location, room } = result[0];
    return new ServiceResponse(ResponseStatus.Success, 'Room found', { title, location, ...room }, StatusCodes.OK);
  },

  async createStripePayment(amount: number, description: string, source: string) {
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
      Apartment.find({ createBy: userId }).select('title location rooms.images rooms.price').lean()
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

    const formattedApartments = apartments.map((apartment) => ({
      title: apartment.title,
      location: apartment.location,
      image:
        apartment.rooms.length > 0 ? `${process.env.SERVER_URI}/api/image/${apartment.rooms[0].images[0]}` : undefined,
      price: apartment.rooms.length > 0 ? apartment.rooms[0].price : undefined,
    }));

    return new ServiceResponse(
      ResponseStatus.Success,
      'Apartments retrieved successfully',
      formattedApartments,
      StatusCodes.OK
    );
  },
};
