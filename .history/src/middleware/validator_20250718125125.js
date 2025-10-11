import { validateResult } from './validateResult.js';

export const validate = (req, res, next) => {
  const error = validateResult(req);
  if (error) {
    return res.status(400).json({
      status: 'error',
      message: error,
    });
  }
  next();
};
