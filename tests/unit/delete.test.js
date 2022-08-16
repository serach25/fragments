const request = require('supertest');
const app = require('../../src/app');
//const { Fragment } = require('../../src/model/fragment');

describe('DELETE /v1/fragments/:id', () => {
  test('unauthenticated requests are denied', () =>
    request(app).delete('/v1/fragments/:id').expect(401));

  // Using a valid username/password pair with correct fragment id
  test('authenticated user deletes a fragment', async () => {
    const data = Buffer.from('This is a fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    var id = JSON.parse(postRes.text).fragment.id;
    const deleteRes = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');
    expect(deleteRes.statusCode).toBe(200);
  });

  //using an invalid username/password pair with correct fragment id
  /*test('unauthenticated users deletes a fragment', async () => {
    const postResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    //get fragment id
    const fragment = await Fragment.byId(
      postResponse.body.fragment.ownerId,
      postResponse.body.fragment.id
    );
    const deleteResponse = await request(app)
      .delete(`/v1/fragments/${fragment.id}`)
      .auth('invalid@email.com', 'invalid')
      .expect(deleteResponse.statusCode)
      .toBe(401);
  });*/

  test('authenticated users deletes an nonexisting fragment', async () => {
    const data = Buffer.from('This is fragment');
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    var id = 1;
    const deleteRes = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');
    expect(deleteRes.statusCode).toBe(404);
  });
});
