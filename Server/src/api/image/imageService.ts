import type { Readable } from 'node:stream';

import { default as to } from 'await-to-js';
import { GridFSBucket } from 'mongodb';
import mongoose, { Connection } from 'mongoose';

const conn: Connection = mongoose.createConnection(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const gfsPromise = new Promise<GridFSBucket>((resolve, reject) => {
  conn.once('open', () => {
    const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'images',
    });
    resolve(gfs);
  });

  conn.on('error', (error) => {
    reject(error);
  });
});

export const uploadImageService = async (filename: string): Promise<string> => {
  if (filename) {
    return `${process.env.SERVER_URL}/api/image/${filename}`;
  } else {
    throw new Error('Error upload image');
  }
};

export const openImageBrowserService = async (filename: string): Promise<Readable> => {
  const gfs = await gfsPromise;
  const [err, files] = await to(gfs.find({ filename }).toArray());

  if (err) {
    throw new Error('Error preview image');
  }

  if (!files || files.length === 0) {
    throw new Error('No image exist');
  }

  return gfs.openDownloadStreamByName(filename);
};

export const getRecentFileService = async (): Promise<any> => {
  const gfs = await gfsPromise;
  const files = await gfs.find().sort({ uploadDate: -1 }).limit(1).toArray();
  if (!files || files.length === 0) {
    throw new Error('No files available');
  }
  return files[0];
};

export const getAllFilesService = async (): Promise<any[]> => {
  const gfs = await gfsPromise;
  const files = await gfs.find().toArray();
  if (!files || files.length === 0) {
    throw new Error('No files available');
  }
  return files.map((file) => ({
    ...file,
    isImage: ['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.contentType),
  }));
};

export const getFileByFilenameService = async (filename: string): Promise<any> => {
  const gfs = await gfsPromise;
  const files = await gfs.find({ filename }).toArray();
  if (!files[0] || files.length === 0) {
    throw new Error('File not found');
  }
  return files[0];
};

export const deleteFileByFileNameService = async (id: string): Promise<any> => {
  const gfs = await gfsPromise;
  const [err, result] = await to(gfs.delete(new mongoose.Types.ObjectId(id)));
  if (err) {
    throw new Error('Error deleting file');
  }
  return result;
};
