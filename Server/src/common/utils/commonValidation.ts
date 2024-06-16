import { z } from 'zod';

const isValidObjectId = (id: string) => {
  const hexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
  return hexRegExp.test(id);
};

export const commonValidations = {
  id: z.string().refine((id) => isValidObjectId(id), 'Is not a valid id'),
};
// export const commonValidations = {
//   id: z
//     .string()
//     .refine((data) => !Number.isNaN(Number(data)), 'ID must be a numeric value')
//     .transform(Number)
//     .refine((num) => num > 0, 'ID must be a positive number'),
// };
