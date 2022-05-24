/* write an HTTP unit test using supertest to cover this 404 handler 
(i.e., write a test that causes a 404 to occur). */

const request = require('supertest');

const app = require('../../src/app');

//Line 40 in src/app.js is now being tested i.e 404
describe('error 404', () => {
  // If the route is not found i.e does not exist, it should cause a 404 error to occur
  test('404 not found', () => request(app).get('/serach').expect(404));
});
