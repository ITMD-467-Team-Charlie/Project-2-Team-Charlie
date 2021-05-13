/* global describe, it */
const assert = require('assert').strict;

describe('the truth', () => {
  it('should be true', () => {
    assert(true);
  });
  it('should not be false', () => {
    assert.equal(!false, true, 'false should not be true');
  });
});
