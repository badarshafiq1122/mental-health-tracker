import LogService from '../services/logService.js';
import { HTTP_STATUS } from '../config/constants.js';
import Logger from '../utils/logger.js';

/**
 * Export user logs as JSON
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
const exportLogsAsJSON = async (req, res, next) => {
  try {
    const userId = req.user.id;

    Logger.debug(`Exporting logs as JSON for user ${userId}`);

    const logs = await LogService.getAllLogs(userId);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Export user logs as CSV
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
const exportLogsAsCSV = async (req, res, next) => {
  try {
    const userId = req.user.id;

    Logger.debug(`Exporting logs as CSV for user ${userId}`);

    const logs = await LogService.getAllLogs(userId);

    if (logs.length === 0) {
      return res.status(HTTP_STATUS.OK).send('No logs to export');
    }

    const headers = Object.keys(logs[0])
      .filter(key => !key.startsWith('_'))
      .join(',');

    const rows = logs.map(log =>
      Object.keys(log)
        .filter(key => !key.startsWith('_'))
        .map(key => {
          const value = log[key] === null ? '' : String(log[key]);
          return `"${value.replace(/"/g, '""')}"`;
        })
        .join(',')
    );

    const csv = [headers, ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=mental_health_logs.csv');

    res.status(HTTP_STATUS.OK).send(csv);
  } catch (error) {
    next(error);
  }
};

export {
  exportLogsAsJSON,
  exportLogsAsCSV
};