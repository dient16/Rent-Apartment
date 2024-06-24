import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

import type { Notification } from './notificationSchema';

const notificationSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model<Notification & Document>('Notification', notificationSchema, 'notifications');

export default NotificationModel;
