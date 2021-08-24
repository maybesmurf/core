import assert from 'assert';
import clamp from '../src/utils/clamp.js';
import omit from '../src/utils/omit.js';

describe('Utilities', () => {
  it('clamp', () => {
    assert.strictEqual(clamp(0, 1, 2), 1);
    assert.strictEqual(clamp(3, 1, 2), 2);
    assert.strictEqual(clamp(1.5, 1, 2), 1.5);
    assert.strictEqual(clamp(NaN, 1, 2), NaN);
  });

  it('omit', () => {
    const orig = { a: 1, b: 2 };
    assert.deepStrictEqual(omit(orig, 'a'), { b: 2 });
    assert.deepStrictEqual(omit(orig, 'b'), { a: 1 });
    assert.deepStrictEqual(orig, { a: 1, b: 2 });
  });
});
