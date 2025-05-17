import { DB_TABLES } from '../config/constants.js';
import Logger from '../utils/logger.js';
import DbService from './dbService.js';
import AppError from '../utils/AppError.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * @class AnalyticsService
 * @description Service for providing analytics and insights from user logs
 */
class AnalyticsService {
  /**
   * Get mood trends for a user over time
   * @param {number} userId - User ID
   * @param {string} [period='month'] - Time period ('week', 'month', 'year')
   * @returns {Promise<Array>} Mood data over time
   */
  static async getMoodTrends(userId, period = 'month') {
    try {
      Logger.debug(`Getting mood trends for user ${userId} over ${period}`);

      let dateFilter;
      const now = new Date();

      switch (period) {
        case 'week':
          dateFilter = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
          break;
        case 'month':
          dateFilter = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
          break;
        case 'year':
          dateFilter = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0];
          break;
        default:
          dateFilter = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
      }

      const trends = await DbService.all(
        `SELECT date, mood_rating, anxiety_level, stress_level
         FROM ${DB_TABLES.LOGS}
         WHERE user_id = ? AND date >= ?
         ORDER BY date ASC`,
        [userId, dateFilter]
      );

      return trends;
    } catch (error) {
      Logger.error(`Error getting mood trends for user ${userId}`, error);
      throw new AppError('Failed to retrieve mood trends', HTTP_STATUS.INTERNAL_SERVER);
    }
  }

  /**
   * Get sleep quality statistics
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Sleep statistics
   */
  static async getSleepStats(userId) {
    try {
      Logger.debug(`Getting sleep stats for user ${userId}`);

      const avgSleepHours = await DbService.get(
        `SELECT AVG(sleep_hours) as average
         FROM ${DB_TABLES.LOGS}
         WHERE user_id = ? AND sleep_hours IS NOT NULL`,
        [userId]
      );

      const sleepQualityDistribution = await DbService.all(
        `SELECT sleep_quality, COUNT(*) as count
         FROM ${DB_TABLES.LOGS}
         WHERE user_id = ? AND sleep_quality IS NOT NULL
         GROUP BY sleep_quality`,
        [userId]
      );

      return {
        averageSleepHours: avgSleepHours?.average || 0,
        sleepQualityDistribution: sleepQualityDistribution || []
      };
    } catch (error) {
      Logger.error(`Error getting sleep stats for user ${userId}`, error);
      throw new AppError('Failed to retrieve sleep statistics', HTTP_STATUS.INTERNAL_SERVER);
    }
  }

  /**
   * Get activity impact analysis
   * Shows correlation between activities and mood/anxiety
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Activity impact data
   */
  static async getActivityImpact(userId) {
    try {
      Logger.debug(`Getting activity impact for user ${userId}`);

      const activityImpact = await DbService.all(
        `SELECT
           physical_activity_type,
           AVG(mood_rating) as avg_mood,
           AVG(anxiety_level) as avg_anxiety,
           COUNT(*) as entry_count
         FROM ${DB_TABLES.LOGS}
         WHERE user_id = ? AND physical_activity_type IS NOT NULL AND physical_activity_type != ''
         GROUP BY physical_activity_type
         HAVING COUNT(*) > 0`,
        [userId]
      );

      return activityImpact || [];
    } catch (error) {
      Logger.error(`Error getting activity impact for user ${userId}`, error);
      throw new AppError('Failed to retrieve activity impact data', HTTP_STATUS.INTERNAL_SERVER);
    }
  }

  /**
   * Get user's overall well-being score and insights
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Wellbeing score and insights
   */
  static async getWellbeingInsights(userId) {
    try {
      Logger.debug(`Getting wellbeing insights for user ${userId}`);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const dateFilter = thirtyDaysAgo.toISOString().split('T')[0];

      const recentLogs = await DbService.all(
        `SELECT * FROM ${DB_TABLES.LOGS}
         WHERE user_id = ? AND date >= ?
         ORDER BY date DESC`,
        [userId, dateFilter]
      );

      if (recentLogs.length === 0) {
        return {
          wellbeingScore: null,
          insights: [],
          enoughData: false
        };
      }

      let moodSum = 0;
      let anxietySum = 0;
      let stressSum = 0;
      let moodCount = 0;
      let anxietyCount = 0;
      let stressCount = 0;

      for (const log of recentLogs) {
        if (log.mood_rating) {
          moodSum += log.mood_rating;
          moodCount++;
        }
        if (log.anxiety_level) {
          anxietySum += (11 - log.anxiety_level);
          anxietyCount++;
        }
        if (log.stress_level) {
          stressSum += (11 - log.stress_level);
          stressCount++;
        }
      }

      const avgMood = moodCount > 0 ? moodSum / moodCount : null;
      const avgAnxiety = anxietyCount > 0 ? anxietySum / anxietyCount : null;
      const avgStress = stressCount > 0 ? stressSum / stressCount : null;

      let wellbeingScore = null;
      const validScores = [avgMood, avgAnxiety, avgStress].filter(score => score !== null);

      if (validScores.length > 0) {
        wellbeingScore = Math.round((validScores.reduce((a, b) => a + b, 0) / validScores.length) * 10) / 10;
      }

      const insights = [];

      if (wellbeingScore !== null) {
        if (wellbeingScore >= 8) {
          insights.push('Your overall wellbeing score is excellent!');
        } else if (wellbeingScore >= 6) {
          insights.push('Your overall wellbeing score is good.');
        } else if (wellbeingScore >= 4) {
          insights.push('Your overall wellbeing score is moderate.');
        } else {
          insights.push('Your overall wellbeing score suggests you might be struggling.');
        }
      }

      const avgSleep = recentLogs.reduce((sum, log) => sum + (log.sleep_hours || 0), 0) / recentLogs.length;
      if (avgSleep < 6) {
        insights.push('You appear to be getting less sleep than recommended (7-9 hours).');
      }

      const logsWithActivity = recentLogs.filter(log => log.physical_activity_type && log.physical_activity_type !== '');
      if (logsWithActivity.length > 3) {
        const avgMoodWithActivity = logsWithActivity.reduce((sum, log) => sum + log.mood_rating, 0) / logsWithActivity.length;
        const avgMoodWithoutActivity = recentLogs
          .filter(log => !log.physical_activity_type || log.physical_activity_type === '')
          .reduce((sum, log) => sum + log.mood_rating, 0) /
          (recentLogs.length - logsWithActivity.length || 1);

        if (avgMoodWithActivity > avgMoodWithoutActivity + 1) {
          insights.push('Physical activity appears to positively impact your mood.');
        }
      }

      return {
        wellbeingScore,
        moodAverage: avgMood,
        anxietyAverage: avgAnxiety,
        stressAverage: avgStress,
        insights,
        enoughData: recentLogs.length >= 5
      };
    } catch (error) {
      Logger.error(`Error getting wellbeing insights for user ${userId}`, error);
      throw new AppError('Failed to retrieve wellbeing insights', HTTP_STATUS.INTERNAL_SERVER);
    }
  }
}

export default AnalyticsService;