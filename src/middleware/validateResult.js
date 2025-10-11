import { validationResult } from 'express-validator';

export const validateResult = (req) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return result.array();
  }
  return null;
};