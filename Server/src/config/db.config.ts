import mongoose from 'mongoose';

import { env } from '@/common/utils/envConfig';

mongoose.set('strictQuery', false);
const { MONGODB_URL } = env;

const dbConnect = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URL, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    if (mongoose.connection.readyState) {
      console.log('Mongoose connection is successful!');
    } else {
      console.log('Mongoose connection is not open');
    }
  } catch (error) {
    console.error('Mongoose connection failed');
    throw new Error(error as string);
  }
};

export { dbConnect };
