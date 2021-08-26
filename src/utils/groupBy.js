'use strict';

/**
 * @template TItem
 * @template {PropertyKey} TGroup
 * @param {Iterable<TItem>} iterable
 * @param {(item: TItem) => TGroup} by
 */
function groupBy(iterable, by) {
  /** @type {Record<TGroup, TItem[]>} */
  const groups = Object.create(null);
  for (const item of iterable) {
    const key = by(item);
    if (!Array.isArray(groups[key])) {
      groups[key] = [item];
    } else {
      groups[key].push(item);
    }
  }
  return groups;
}

module.exports = groupBy;
