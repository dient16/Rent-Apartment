import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import UserModel from '@/api/user/userModel';
import { env } from '@/common/utils/envConfig';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = env;
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        if (profile) {
          const user = await UserModel.findOne({
            email: profile.emails[0]?.value,
          });
          if (user) return cb(null, user);
          const newUser = await UserModel.create({
            email: profile.emails[0]?.value,
            provider: 'Google',
            firstname: profile.name.familyName,
            lastname: profile.name.givenName,
            avatar: profile?.photos[0]?.value,
          });
          return cb(null, newUser);
        }
      } catch (error) {
        return cb(null, false);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      callbackURL: '/api/auth/facebook/callback',
      profileFields: ['email', 'photos', 'id', 'displayName', 'name', 'gender'],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        if (profile) {
          console.log(profile);
          const user = await UserModel.findOne({
            email: profile.emails[0]?.value,
          });
          if (user) return cb(null, user);
          const newUser = await UserModel.create({
            email: profile.emails[0]?.value,
            provider: 'Facebook',
            firstname: profile.name.familyName,
            lastname: profile.name.givenName,
            gender: profile.gender,
            avatar: profile?.photos[0]?.value,
          });
          return cb(null, newUser);
        }
      } catch (error) {
        return cb(null, false);
      }
    }
  )
);

export default passport;
