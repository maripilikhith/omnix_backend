/**
 * Pick specified keys from an object.
 * Useful for extracting only allowed fields from req.body.
 *
 * @param {object} obj - Source object
 * @param {string[]} keys - Keys to pick
 * @returns {object} New object with only the specified keys
 */
export function pick(obj, keys) {
  return keys.reduce((result, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}
