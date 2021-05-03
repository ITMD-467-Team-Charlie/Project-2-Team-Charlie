'use strict';
/* global describe, it */
const assert = require('assert').strict;

describe('the truth', function() {
    it('should be true', function() {
        assert(true);
    });
    it('should not be false', function() {
        assert.equal(!false, true, 'false should not be true');
    });
});