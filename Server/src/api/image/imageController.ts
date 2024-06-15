import type { NextFunction, Request, Response } from 'express';

import {
  deleteFileByFileNameService,
  getAllFilesService,
  getFileByFilenameService,
  getRecentFileService,
  openImageBrowserService,
  uploadImageService,
} from './imageService';

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const link = await uploadImageService(req.file.filename);
    res.status(200).json({
      success: true,
      data: { link },
    });
  } catch (error) {
    next(error);
  }
};

export const openImageBrowser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stream = await openImageBrowserService(req.params.filename);
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
};

export const uploadMultipleFiles = (req: Request, res: Response, next: NextFunction) => {
  const filenames = req.files.map((file) => file?.filename);

  res.status(200).json({
    success: true,
    message: `${filenames.length} files uploaded successfully`,
    data: {
      filenames,
    },
  });
};

export const getRecentFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = await getRecentFileService();
    res.status(200).json({
      success: true,
      data: { file },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = await getAllFilesService();
    res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    next(error);
  }
};

export const getFileByFilename = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = await getFileByFilenameService(req.params.filename);
    res.status(200).json({
      success: true,
      file,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFileByFileName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deleteFileByFileNameService(req.params.id);
    res.status(200).json({
      success: true,
      message: `File with ID ${req.params.id} is deleted`,
    });
  } catch (error) {
    next(error);
  }
};
