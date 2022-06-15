const hash = require('../../src/hash');

describe('hash()', () => {
  test('user email should return the hash SHA256 value', () => {
    const email = 'user1@email.com';
    const hashedEmail = '11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a';
    expect(hash(email)).toEqual(hashedEmail);
  });
});
