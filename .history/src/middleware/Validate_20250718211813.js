import { validateResult } from '../utils/validateResult.js'; // adjust path if needed

export const validate = (req, res, next) => {
  const errors = validateResult(req);
  if (errors) {
    const errorMessages = errors.map(err => err.msg);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  next();
};