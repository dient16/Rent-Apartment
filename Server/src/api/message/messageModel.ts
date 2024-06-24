import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

import type { Message } from './messageSchema';

const messageSchema = new Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model<Message & Document>('Message', messageSchema, 'messages');

export default MessageModel;
