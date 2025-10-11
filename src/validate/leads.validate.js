import { body } from 'express-validator';

export const planYourJourneyValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Mobile Number is required'),
  body('phone').isMobilePhone('en-IN').withMessage('Mobile Number is invalid'),
  body('destination').trim().notEmpty().withMessage('Destination is required'),
];

export const contactValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('phone').trim().notEmpty().withMessage('Mobile Number is required'),
   body('phone').isMobilePhone('en-IN').withMessage('Mobile Number is invalid'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
];

export const subscribeValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Mobile Number is required'),
   body('phone').isMobilePhone('en-IN').withMessage('Mobile Number is invalid'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
];

export const suggestionComplainValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
];

export const planYourTripValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('phone_no').trim().notEmpty().withMessage('Mobile Number is required'),
   body('phone_no').isMobilePhone('en-IN').withMessage('Mobile Number is invalid'),
  
]