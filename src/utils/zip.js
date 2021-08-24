'use strict';

/**
 * Zip two iterators together, returning a single iterator producing 2-element tuples.
 *
 * @template A
 * @template B
 * @param {Iterable<A>} a
 * @param {Iterable<B>} b
 * @returns {Generator<[A, B]>}
 */
function* zip(a, b) {
  const itA = a[Symbol.iterator]();
  const itB = b[Symbol.iterator]();

  while (true) {
    const x = itA.next();
    const y = itB.next();
    if (x.done || y.done) {
      return;
    }

    yield [x.value, y.value];
  }
}

module.exports = zip;
