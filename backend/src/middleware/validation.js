import AppError from '../utils/AppError.js';
import { HTTP_STATUS } from '../config/constants.js';
import { logSchema, extendedLogSchema } from '../utils/validation.js';

/**
 * Validation middleware for logs
 * Handles both extended and core schema validation
 */
export const validateLog = (req, res, next) => {
  try {
    const { error: extendedError, value: extendedValue } = extendedLogSchema.validate(req.body);

    if (extendedError) {
      throw new AppError(`Validation error: ${extendedError.details[0].message}`, HTTP_STATUS.BAD_REQUEST);
    }

    const {
      physical_activities,
      physical_activity_notes,
      ...coreFields
    } = extendedValue;

    if (physical_activities && physical_activities.length > 0) {
      coreFields.physical_activity_type = physical_activities[0];
    }

    const additionalContent = [];

    if (physical_activities && physical_activities.length > 1) {
      additionalContent.push(`Additional activities: ${physical_activities.slice(1).join(', ')}`);
    }

    if (physical_activity_notes) {
      additionalContent.push(`Activity notes: ${physical_activity_notes}`);
    }

    if (additionalContent.length > 0) {
      const additionalText = additionalContent.join('\n\n');
      coreFields.notes = coreFields.notes
        ? `${coreFields.notes}\n\n${additionalText}`
        : additionalText;
    }

    const { error } = logSchema.validate(coreFields);

    if (error) {
      throw new AppError(`Validation error: ${error.details[0].message}`, HTTP_STATUS.BAD_REQUEST);
    }

    req.body = coreFields;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Generic validation middleware factory
 * Creates middleware that validates request body against a Joi schema
 *
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {function} Express middleware function
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(new AppError(
        `Validation error: ${error.details.map(detail => detail.message).join(', ')}`,
        HTTP_STATUS.BAD_REQUEST
      ));
    }
    next();
  };
};

export default validate;