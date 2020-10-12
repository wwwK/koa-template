/*
 * @Author: dingdongzhao
 * @Date: 2019-03-25 17:38:27
 * @Last Modified by: dingdongzhao
 * @Last Modified time: 2019-08-20 15:53:22
 */

/* eslint-disable */
const assert = require('assert');
const request = require('supertest');

const app = require('../../app');

describe('/user 用户信息管理', () => {
  let newUserId = '';
  let newToken = '';
  let newClassroomId = '';

  after(function(done) {
    if (newClassroomId) {
      request(app)
        .delete('/classroom')
        .send({
          classroomId: newClassroomId,
        })
        .set({ 'content-type': 'application/json', Authorization: `Bearer ${newToken}` })
        .expect(200)
        .end((err, res) => {
          const { deletedCount } = res.body;
          assert(deletedCount > 0, 'deletedCount 错误');
          done();
        });
    }
  });

  it('登录', done => {
    request(app)
      .post('/loginUser')
      .send({
        username: 'admin',
        password: '123456',
      })
      .set('content-type', 'application/json')
      .expect(200)
      .end((err, res) => {
        const {
          data: { token },
        } = res.body;
        assert(token, 'token 错误');
        newToken = token;
        done();
      });
  });

  it('创建班级', done => {
    request(app)
      .post('/classroom')
      .send({
        classname: '一年二班',
        headTeacherId: 1,
      })
      .set({ 'content-type': 'application/json', Authorization: `Bearer ${newToken}` })
      .expect(200)
      .end((err, res) => {
        const {
          data: { id },
        } = res.body;
        assert(id, 'classroomId 错误');
        newClassroomId = id;
        done();
      });
  });

  it('清理缓存', done => {
    request(app)
      .delete('/clearCache')
      .send()
      .set({ 'content-type': 'application/json', Authorization: `Bearer ${newToken}` })
      .expect(200)
      .end((err, res) => {
        const {
          data: { result },
        } = res.body;
        assert.equal(result, 'OK', 'result 错误');
        done();
      });
  });

  it('创建用户', done => {
    request(app)
      .post('/user')
      .send({
        username: 'hxm',
        sex: '1',
        password: '123456',
        classroomId: newClassroomId,
        age: 8,
      })
      .set({ 'content-type': 'application/json', Authorization: `Bearer ${newToken}` })
      .expect(200)
      .end((err, res) => {
        const {
          data: { id, sex, username, age, classname },
        } = res.body;
        assert.equal(username, 'hxm', 'username 错误');
        assert.equal(sex, '男', 'sex 错误');
        assert.equal(age, 8, 'age 错误');
        assert.equal(classname, '一年二班', 'classname 错误');
        assert(id, 'id 错误');
        newUserId = id;
        done();
      });
  });

  it('获得全部用户数据--mysql', done => {
    request(app)
      .get('/user')
      .set({ 'content-type': 'application/json', Authorization: `Bearer ${newToken}` })
      .expect(200)
      .end((err, res) => {
        const { data, dataSource } = res.body;
        assert(data.length > 0, '用户数据错误');
        assert.equal(dataSource, 'redis', 'dataSource 错误');
        done();
      });
  });

  it('根据用户id获得用户信息', done => {
    request(app)
      .get(`/user/id?id=${newUserId}`)
      .set('Authorization', `Bearer ${newToken}`)
      .expect(200)
      .end((err, res) => {
        const {
          data: { id, username, sex, age, classname },
        } = res.body;
        assert.equal(username, 'hxm', 'username 错误');
        assert.equal(sex, '男', 'sex 错误');
        assert.equal(age, 8, 'age 错误');
        assert.equal(classname, '一年二班', 'classname 错误');
        assert.equal(id, newUserId, 'id 错误');
        done();
      });
  });

  it('更新用户信息', done => {
    request(app)
      .put('/user/id')
      .send({
        id: newUserId,
        username: 'zzz',
      })
      .set({ 'content-type': 'application/json', Authorization: `Bearer ${newToken}` })
      .expect(200)
      .end((err, res) => {
        const {
          data: { username },
        } = res.body;
        assert.equal(username, 'zzz', 'username 错误');
        done();
      });
  });

  it('获得全部用户数据--redis', done => {
    request(app)
      .get('/user')
      .set({ 'content-type': 'application/json', Authorization: `Bearer ${newToken}` })
      .expect(200)
      .end((err, res) => {
        const { data, dataSource } = res.body;
        assert(data.length > 0, '用户数据错误');
        assert.equal(dataSource, 'redis', 'dataSource 错误');
        assert.equal(data[0].username, 'zzz', 'username 错误');
        done();
      });
  });
});
