import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const MessageSchema = z.object({
  sender: z.string(),
  receiver: z.string(),
  apartment: z.string(),
  content: z.string(),
  timestamp: z.date().optional(),
});

export type Message = z.infer<typeof MessageSchema>;
