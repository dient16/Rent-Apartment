import fs from 'node:fs/promises';

import to from 'await-to-js';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import type { User } from '@/api/user/userModel';
import UserModel from '@/api/user/userModel';
import { ResponseStatus, ServiceResponse } from '@/common/schemaResponse/serviceResponse';
import { generateAccessToken, generateRefreshToken, generateToken, sendMail } from '@/common/utils/helpers';

const hashPassword = (password: string) => bcrypt.hashSync(password, bcrypt.genSaltSync(12));

export const authService = {
  async register(email: string): Promise<ServiceResponse<User | null>> {
    const [errExistingUser, existingUser] = await to(UserModel.findOne({ email }));
    if (errExistingUser) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error checking existing user',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    if (existingUser) {
      return new ServiceResponse(ResponseStatus.Failed, 'Email already in use', null, StatusCodes.BAD_REQUEST);
    }

    const confirmationToken = generateToken();

    const [errCreateUser, newUser] = await to(UserModel.create({ email, confirmationToken }));
    if (errCreateUser) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error registering user',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    const [readError, htmlTemplate] = await to(fs.readFile('src/template/confirmMailTemplate.html', 'utf-8'));
    if (readError) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error reading email template',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    const emailHtml = htmlTemplate.replace(
      '{{confirmationUrl}}',
      `${process.env.SERVER_URI}/api/auth/confirm-email?token=${confirmationToken}`
    );
    const [mailError] = await to(sendMail({ email, html: emailHtml, subject: 'Confirm email' }));
    if (mailError) {
      return new ServiceResponse(ResponseStatus.Failed, 'Error sending email', null, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return new ServiceResponse<ResponseStatus.Success, null>(
      'Registration successful. Please check your email to confirm',
      newUser,
      StatusCodes.CREATED
    );
  },

  async confirmEmail(token: string): Promise<ServiceResponse<User | null>> {
    const [errFindUser, user] = await to(UserModel.findOne({ confirmationToken: token }));
    if (errFindUser || !user) {
      return new ServiceResponse(ResponseStatus.Failed, 'Invalid or expired token', null, StatusCodes.BAD_REQUEST);
    }

    user.emailConfirmed = true;
    const [errSaveUser] = await to(user.save());
    if (errSaveUser) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Internal server error',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    return new ServiceResponse<ResponseStatus.Success, null>('Email confirmed', user, StatusCodes.OK);
  },

  async setPassword(userId: string, password: string): Promise<ServiceResponse<User | null>> {
    const [errFindUser, user] = await to(UserModel.findById(userId));
    if (errFindUser || !user) {
      return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
    }

    if (!user.emailConfirmed) {
      return new ServiceResponse(ResponseStatus.Failed, 'Email has not been confirmed', null, StatusCodes.BAD_REQUEST);
    }

    const passwordHash = hashPassword(password);
    const { isAdmin } = user.toObject();
    const accessToken = generateAccessToken(user._id, isAdmin);
    const newRefreshToken = generateRefreshToken(user._id);

    const [errUpdateUser, updatedUser] = await to(
      User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken, password: passwordHash }, { new: true }).select(
        '-password -refreshToken'
      )
    );

    if (errUpdateUser) {
      return new ServiceResponse(ResponseStatus.Failed, 'Error updating user', null, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return new ServiceResponse<ResponseStatus.Success, null>(
      'Password has been set successfully',
      updatedUser,
      StatusCodes.OK
    );
  },

  async login(email: string, password: string): Promise<ServiceResponse<User | null>> {
    const [errFindUser, user] = await to(User.findOne({ email }));
    if (errFindUser || !user) {
      return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
    }

    const [errPassword, isPasswordCorrect] = await to(bcrypt.compare(password, user.password));
    if (errPassword || !isPasswordCorrect) {
      return new ServiceResponse(ResponseStatus.Failed, 'Incorrect password', null, StatusCodes.UNAUTHORIZED);
    }

    const { password: userPassword, isAdmin, refreshToken, ...userData } = user.toObject();
    const accessToken = generateAccessToken(user._id, isAdmin);
    const newRefreshToken = generateRefreshToken(user._id);

    const [errUpdate] = await to(
      UserModel.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken }, { new: true })
    );
    if (errUpdate) {
      return new ServiceResponse(ResponseStatus.Failed, 'Error updating user', null, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return new ServiceResponse<ResponseStatus.Success, null>(
      'Login successful',
      { ...userData, accessToken, refreshToken: newRefreshToken },
      StatusCodes.OK
    );
  },

  async logout(refreshToken: string): Promise<ServiceResponse<null>> {
    const [errUpdateUser] = await to(UserModel.findOneAndUpdate({ refreshToken }, { refreshToken: '' }, { new: true }));
    if (errUpdateUser) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Internal server error',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    return new ServiceResponse<ResponseStatus.Success, null>('Logout is done', null, StatusCodes.OK);
  },

  async refreshAccessToken(refreshToken: string): Promise<ServiceResponse<string | null>> {
    const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY) as { _id: string };
    if (!decodedToken) {
      return new ServiceResponse(ResponseStatus.Failed, 'Invalid refresh token', null, StatusCodes.UNAUTHORIZED);
    }

    const [errFindUser, user] = await to(UserModel.findOne({ _id: decodedToken._id, refreshToken }));
    if (errFindUser || !user) {
      return new ServiceResponse(ResponseStatus.Failed, 'Invalid refresh token', null, StatusCodes.UNAUTHORIZED);
    }

    const newAccessToken = generateAccessToken(user._id, user.isAdmin);
    return new ServiceResponse<ResponseStatus.Success, null>('Access token refreshed', newAccessToken, StatusCodes.OK);
  },
  async googleLoginSuccess(userId: string): Promise<ServiceResponse<User | null>> {
    const [errFindUser, user] = await to(UserModel.findById(userId));
    if (errFindUser || !user) {
      return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
    }

    const { isAdmin } = user.toObject();
    const accessToken = generateAccessToken(user._id, isAdmin);
    const newRefreshToken = generateRefreshToken(user._id);

    const [errUpdate, updatedUser] = await to(
      User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken }, { new: true }).select(
        '-password -refreshToken'
      )
    );

    if (errUpdate) {
      return new ServiceResponse(ResponseStatus.Failed, 'Error updating user', null, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return new ServiceResponse<ResponseStatus.Success, null>(
      'Login successful',
      { ...user.toObject(), accessToken, refreshToken: newRefreshToken },
      StatusCodes.OK
    );
  },
};
