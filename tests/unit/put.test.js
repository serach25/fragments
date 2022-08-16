const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
  // Using a valid username/password pair with correct fragment id
  test('authenticated users update a fragment', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    var id = JSON.parse(postRes.text).fragment.id;
    const data2 = Buffer.from('UPD:This is fragment');
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data2);
    expect(putRes.statusCode).toBe(200);
  });

  test('unauthenticated users updates a fragment', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    var id = JSON.parse(postRes.text).fragment.id;
    const data2 = Buffer.from('UPD: This is fragment');
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .set('Content-Type', 'text/plain')
      .send(data2);
    expect(putRes.statusCode).toBe(401);
  });

  test('authenticated users updates an nonexisting fragment', async () => {
    const data = Buffer.from('This is fragment');
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    var id = 1;
    const data2 = Buffer.from('UPD: This is fragment');
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send(data2);
    expect(putRes.statusCode).toBe(404);
  });

  // Using a valid username/password pair with correct fragment id but incorrect type
  test('authenticated users update a fragment', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    var id = JSON.parse(postRes.text).fragment.id;
    const data2 = Buffer.from('# UPD:This is fragment');
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(data2);
    expect(putRes.statusCode).toBe(400);
  });
});
