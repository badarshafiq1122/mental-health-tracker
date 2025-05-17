import Joi from 'joi';
import { RATING_SCALES, SLEEP_QUALITY } from '../config/constants.js';

/**
 * Validation schema for daily log entries
 * This is the core schema that matches the database structure
 */
const logSchema = Joi.object({
  date: Joi.string().required(),
  mood_rating: Joi.number().integer().min(RATING_SCALES.MIN).max(RATING_SCALES.MAX),
  anxiety_level: Joi.number().integer().min(RATING_SCALES.MIN).max(RATING_SCALES.MAX),
  sleep_hours: Joi.number().min(0).max(24),
  sleep_quality: Joi.string().valid(
    SLEEP_QUALITY.POOR,
    SLEEP_QUALITY.FAIR,
    SLEEP_QUALITY.GOOD,
    SLEEP_QUALITY.EXCELLENT
  ),
  physical_activity_type: Joi.string().allow('', null),
  physical_activity_duration: Joi.number().integer().min(0).allow(null),
  social_interactions: Joi.number().integer().min(0),
  stress_level: Joi.number().integer().min(RATING_SCALES.MIN).max(RATING_SCALES.MAX),
  depression_symptoms: Joi.string().allow('', null),
  anxiety_symptoms: Joi.string().allow('', null),
  notes: Joi.string().allow('', null)
});

/**
 * Extended validation schema that allows additional fields for frontend flexibility
 * This schema is used for initial validation before transforming to the core schema
 */
const extendedLogSchema = Joi.object({
  date: Joi.string().required(),
  mood_rating: Joi.number().integer().min(RATING_SCALES.MIN).max(RATING_SCALES.MAX),
  anxiety_level: Joi.number().integer().min(RATING_SCALES.MIN).max(RATING_SCALES.MAX),
  sleep_hours: Joi.number().min(0).max(24),
  sleep_quality: Joi.string().valid(
    SLEEP_QUALITY.POOR,
    SLEEP_QUALITY.FAIR,
    SLEEP_QUALITY.GOOD,
    SLEEP_QUALITY.EXCELLENT
  ),
  physical_activity_type: Joi.string().allow('', null),
  physical_activity_duration: Joi.number().integer().min(0).allow(null),
  social_interactions: Joi.number().integer().min(0),
  stress_level: Joi.number().integer().min(RATING_SCALES.MIN).max(RATING_SCALES.MAX),
  depression_symptoms: Joi.string().allow('', null),
  anxiety_symptoms: Joi.string().allow('', null),
  notes: Joi.string().allow('', null),

  physical_activities: Joi.array().items(Joi.string()).allow(null),
  physical_activity_notes: Joi.string().allow('', null)
});

export { logSchema, extendedLogSchema };