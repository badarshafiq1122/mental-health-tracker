/**
 * Wrapper for async controller functions to catch errors
 * @param {Function} fn - Async controller function
 * @returns {Function} Express middleware function that catches errors
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;