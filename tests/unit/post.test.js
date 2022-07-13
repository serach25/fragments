// tests/unit/post.test.js

/*CONSIDER:
authenticated vs unauthenticated requests (use HTTP Basic Auth, don't worry about Cognito in tests)
authenticated users can create a plain text fragment
responses include all necessary and expected properties (id, created, type, etc), and these values match what you expect for a given request (e.g., size, type, ownerId)
responses include a Location header with a URL to GET the fragment 
A fragment with an unsupported type should give a 415 error response*/

const request = require('supertest');

const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');
const hash = require('crypto');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', async () =>
    request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  //A fragment with an unsupported type should give a 415 error response
  test('unsupported types cause a 415 response', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'multipart/form-data')
      .expect(415);
  });

  /* Using a valid username/password pair can create a plain text fragment should give a success result with
responses include all necessary and expected properties (id, created, type, etc), and these values match what you expect for a given request (e.g., size, type, ownerId)
responses include a Location header with a URL to GET the fragment*/
  test('authenticated users can create a plain text fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('This is a fragment');

    const ownerId = hash.createHash('sha256').update('user1@email.com').digest('hex');
    const savedFragment = await Fragment.byUser(ownerId, true);
    expect(res.statusCode).toBe(201);

    //responses include all necessary and expected properties
    expect(savedFragment.at(0).ownerId).toEqual(ownerId);
    expect(savedFragment.at(0).type).toEqual('text/plain');
    expect(savedFragment.at(0).id).toEqual(expect.anything(String));
    expect(savedFragment.at(0).created).toEqual(expect.any(String));
    expect(savedFragment.at(0).updated).toEqual(expect.any(String));
    expect(savedFragment.at(0).size).toEqual(expect.any(Number));

    //responses include a Location header with a URL to GET the fragment
    //const fullURL = '/v1/fragments/' + savedFragment.at(0).id;
    // expect(res.headers.location).toBe(fullURL);
  });

  /* Using a valid username/password pair can create a text/markdown fragment should give a success result with
responses include all necessary and expected properties (id, created, type, etc), and these values match what you expect for a given request (e.g., size, type, ownerId)
responses include a Location header with a URL to GET the fragment*/
  /* test('authenticated users can create a text/markdown fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/markdown')
      .send('# This is a fragment');

    const ownerId = hash.createHash('sha256').update('user1@email.com').digest('hex');
    const savedFragment = await Fragment.byUser(ownerId, true);
    expect(res.statusCode).toBe(201);

    //responses include all necessary and expected properties
    expect(savedFragment.at(0).ownerId).toEqual(ownerId);
    expect(savedFragment.at(0).type).toEqual('text/markdown');
    expect(savedFragment.at(0).id).toEqual(expect.anything(String));
    expect(savedFragment.at(0).created).toEqual(expect.any(String));
    expect(savedFragment.at(0).updated).toEqual(expect.any(String));
    expect(savedFragment.at(0).size).toEqual(expect.any(Number));
  });*/

  /* Using a valid username/password pair can create a text/html fragment should give a success result with
responses include all necessary and expected properties (id, created, type, etc), and these values match what you expect for a given request (e.g., size, type, ownerId)
responses include a Location header with a URL to GET the fragment*/
  /*test('authenticated users can create a text/html fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/html')
      .send('<h1>This is a fragment</h1>');

    const ownerId = hash.createHash('sha256').update('user1@email.com').digest('hex');
    const savedFragment = await Fragment.byUser(ownerId, true);
    expect(res.statusCode).toBe(201);

    //responses include all necessary and expected properties
    expect(savedFragment.at(0).ownerId).toEqual(ownerId);
    expect(savedFragment.at(0).type).toEqual('text/html');
    expect(savedFragment.at(0).id).toEqual(expect.anything(String));
    expect(savedFragment.at(0).created).toEqual(expect.any(String));
    expect(savedFragment.at(0).updated).toEqual(expect.any(String));
    expect(savedFragment.at(0).size).toEqual(expect.any(Number));
  });*/

  /* Using a valid username/password pair can create a text/plain; charset=utf-8 fragment should give a success result with
responses include all necessary and expected properties (id, created, type, etc), and these values match what you expect for a given request (e.g., size, type, ownerId)
responses include a Location header with a URL to GET the fragment*/
  /*test('authenticated users can create a text/plain; charset=utf-8 fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain; charset=utf-8')
      .send('\x54\x68\x69\x73\x20\x69\x73\x20\x61\x20\x66\x72\x61\x67\x6d\x65\x6e\x74');

    const ownerId = hash.createHash('sha256').update('user1@email.com').digest('hex');
    const savedFragment = await Fragment.byUser(ownerId, true);
    expect(res.statusCode).toBe(201);

    //responses include all necessary and expected properties
    expect(savedFragment.at(0).ownerId).toEqual(ownerId);
    expect(savedFragment.at(0).type).toEqual('text/plain');
    expect(savedFragment.at(0).id).toEqual(expect.anything(String));
    expect(savedFragment.at(0).created).toEqual(expect.any(String));
    expect(savedFragment.at(0).updated).toEqual(expect.any(String));
    expect(savedFragment.at(0).size).toEqual(expect.any(Number));
  });*/

  /* Using a valid username/password pair can create a application/json fragment should give a success result with
responses include all necessary and expected properties (id, created, type, etc), and these values match what you expect for a given request (e.g., size, type, ownerId)
responses include a Location header with a URL to GET the fragment*/
  /*test('authenticated users can create an application/json fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'application/json')
      .send('{text:this is a fragment}');

    const ownerId = hash.createHash('sha256').update('user1@email.com').digest('hex');
    const savedFragment = await Fragment.byUser(ownerId, true);
    expect(res.statusCode).toBe(201);

    //responses include all necessary and expected properties
    expect(savedFragment.at(0).ownerId).toEqual(ownerId);
    expect(savedFragment.at(0).type).toEqual('application/json');
    expect(savedFragment.at(0).id).toEqual(expect.anything(String));
    expect(savedFragment.at(0).created).toEqual(expect.any(String));
    expect(savedFragment.at(0).updated).toEqual(expect.any(String));
    expect(savedFragment.at(0).size).toEqual(expect.any(Number));
  });*/
});
