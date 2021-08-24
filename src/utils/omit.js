'use strict';

/**
 * @template {Record<string, unknown>} O
 * @template {keyof O} K
 * @param {O} object
 * @param {K} key
 * @returns {Omit<O, K>}
 */
function omit(object, key) {
  const clone = { ...object };
  delete clone[key];
  return clone;
}

module.exports = omit;
