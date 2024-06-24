import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const NotificationSchema = z.object({
  userId: z.string(),
  type: z.string(),
  message: z.string(),
  read: z.boolean().optional(),
  timestamp: z.date().optional(),
});

export type Notification = z.infer<typeof NotificationSchema>;
