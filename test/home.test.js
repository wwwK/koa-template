/* eslint-disable */
const assert = require('assert');
const request = require('supertest');

const app = require('../app');

describe('/', () => {
  it('/', done => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) {
          assert.fail('返回结果错误');
        }
        const resData = res.body;
        assert.strictEqual(resData.data, 'hello word', '返回结果错误');
        done();
      });
  });
});
