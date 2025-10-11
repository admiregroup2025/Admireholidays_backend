import {validateResult} from '../middleware/validateResult.js'
export const validate = (req, res, next) => {
  const errors = validateResult(req);
  if (errors) {
    return res.status(400).json({
      status: 'error',
      errors: errors,  // send as an array named errors
      message: errors.map(e => e.msg).join(', '), // human readable error string
    });
  }
  next();
};