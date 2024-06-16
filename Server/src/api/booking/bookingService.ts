import fs from 'node:fs/promises';

import to from 'await-to-js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import Apartment from '@/api/apartment/apartmentModel';
import User, { User as IUser } from '@/api/user/userModel';
import { ServiceResponse } from '@/common/schemaResponse/serviceResponse';
import { sendMail } from '@/common/utils/helpers';

import Booking, { IBooking } from './bookingModel';

const createBooking = async (bookingData: Partial<IBooking>): Promise<ServiceResponse<IBooking>> => {
  const { email, firstname, lastname, roomId, checkInTime, checkOutTime, totalPrice, arrivalTime, phone } = bookingData;

  if (!email || !roomId || !checkInTime || !checkOutTime || !totalPrice) {
    return new ServiceResponse(StatusCodes.BAD_REQUEST, 'Missing required fields', null);
  }

  const [findError, apartment] = await to(
    Apartment.findOne({
      'rooms._id': new mongoose.Types.ObjectId(roomId),
    }).exec()
  );

  if (findError || !apartment) {
    return new ServiceResponse(StatusCodes.NOT_FOUND, 'Room not found', null);
  }

  const room = apartment.rooms.id(roomId);
  room.unavailableDateRanges.push({
    startDay: checkInTime,
    endDay: checkOutTime,
  });

  const [updateError] = await to(apartment.save());
  if (updateError) {
    return new ServiceResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Error updating room availability', null);
  }

  const newBooking = new Booking({
    email,
    firstname,
    lastname,
    room: roomId,
    phone,
    arrivalTime,
    checkInTime,
    checkOutTime,
    totalPrice,
  });

  const [saveError, savedBooking] = await to(newBooking.save());
  if (saveError) {
    return new ServiceResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Error saving booking', null);
  }

  const [readError, htmlTemplate] = await to(fs.readFile('src/template/bookingConfirmationTemplate.html', 'utf-8'));
  if (readError) {
    return new ServiceResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Error reading email template', null);
  }

  const htmlToSend = htmlTemplate
    .replace('{{firstname}}', firstname)
    .replace('{{lastname}}', lastname)
    .replace('{{bookingId}}', newBooking._id.toString())
    .replace('{{checkInTime}}', checkInTime.toString())
    .replace('{{checkOutTime}}', checkOutTime.toString())
    .replace('{{totalPrice}}', `${totalPrice.toLocaleString()} VND`);

  const [mailError] = await to(sendMail({ email, html: htmlToSend, subject: 'Booking Confirmation' }));
  if (mailError) {
    return new ServiceResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Error sending email', null);
  }

  return new ServiceResponse(StatusCodes.CREATED, 'Booking successfully created', savedBooking);
};

const getBookings = async (userId: string): Promise<ServiceResponse<any[]>> => {
  const [errFindUser, user] = await to(User.findById(userId).exec());
  if (errFindUser || !user) {
    return new ServiceResponse(StatusCodes.NOT_FOUND, 'User not found', null);
  }

  const [err, bookings] = await to(Booking.find({ email: user.email }).exec());
  if (err) {
    return new ServiceResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Error finding bookings', null);
  }

  const bookingDetails = await Promise.all(
    bookings.map(async (booking) => {
      const apartment = await Apartment.findOne({
        'rooms._id': booking.room,
      }).exec();
      const room = apartment.rooms.id(booking.room);
      return {
        _id: booking._id,
        name: apartment.title,
        image: `${process.env.SERVER_URI}/api/image/${room.images[0]}`,
        checkIn: booking.checkInTime,
        checkOut: booking.checkOutTime,
        totalPrice: booking.totalPrice,
      };
    })
  );

  return new ServiceResponse(StatusCodes.OK, 'Bookings retrieved successfully', bookingDetails);
};

const getBooking = async (bookingId: string): Promise<ServiceResponse<any>> => {
  const [err, booking] = await to(Booking.findById(bookingId).exec());
  if (err || !booking) {
    return new ServiceResponse(StatusCodes.NOT_FOUND, 'Booking not found', null);
  }

  const apartment = await Apartment.findOne({ 'rooms._id': booking.room })
    .populate({ path: 'createBy', select: 'phone email' })
    .exec();
  if (!apartment) {
    return new ServiceResponse(StatusCodes.NOT_FOUND, 'Apartment not found', null);
  }

  const room = apartment.rooms.id(booking.room);
  const bookingDetails = {
    _id: booking._id,
    name: apartment.title,
    address: apartment.location,
    image: `${process.env.SERVER_URL}/api/image/${room.images[0]}`,
    checkIn: booking.checkInTime,
    checkOut: booking.checkOutTime,
    totalPrice: booking.totalPrice,
    roomType: room.roomType,
    contact: apartment.createBy,
  };

  return new ServiceResponse(StatusCodes.OK, 'Booking retrieved successfully', bookingDetails);
};

export const bookingService = {
  createBooking,
  getBookings,
  getBooking,
};
