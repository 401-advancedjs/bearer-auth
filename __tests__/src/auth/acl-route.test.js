'use strict';

/*

router.get('/public-stuff') should be visible by anyone
router.get('/hidden-stuff') should require only a valid login
router.get('/something-to-read') should require the read capability
router.post('/create-a-thing) should require the create capability
router.put('/update) should require the update capability
router.patch('/jp) should require the update capability
router.delete('/bye-bye) should require the delete capability
router.get('/everything') should require the superuser ca

*/

'use strict';

process.env.SECRET='test';

const {startDB,stopDB} = require('../../supergoose.js');
const auth = require('../../../src/auth/middleware.js');
const Users = require('../../../src/auth/users-model.js');
const Roles = require('../../../src/auth/role-model.js');

let users = {
  admin: {username: 'admin', password: 'password', role: 'admin'},
  editor: {username: 'editor', password: 'password', role: 'editor'},
  user: {username: 'user', password: 'password', role: 'user'},
};

let roles = {
  admin: {role: 'admin', capabilities:['create','read','update','delete']},
  editor: {role: 'editor', capabilities:['create','read','update']},
  user: {role: 'user', capabilities:['read']},
};

beforeAll(async (done) => {
  await startDB();
  const admin = await new Users(users.admin).save();
  const editor = await new Users(users.editor).save();
  const user = await new Users(users.user).save();
  const adminRole = await new Roles(roles.admin).save();
  const editorRole = await new Roles(roles.editor).save();
  const userRole = await new Roles(roles.user).save();
  done();
});

afterAll(stopDB);

/*
  For now, these test only make assertions on the admin user
  That user has a role with create, read, update, delete credentials
  ... you can go further as you please.
 */
describe('Auth Middleware', () => {

  // admin:password: YWRtaW46cGFzc3dvcmQ=
  // admin:foo: YWRtaW46Zm9v
  // editor:password: ZWRpdG9yOnBhc3N3b3Jk
  // user:password: dXNlcjpwYXNzd29yZA==

  let errorMessage = {'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized'};

  describe('user authorization', () => {

    it('restricts access to a valid user without permissions', () => {

      let req = {
        headers: {
          authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth('godpower');

      return middleware(req,res,next)
        .then( () => {
          expect(next).toHaveBeenCalledWith(errorMessage);
        });

    }); // it()

    it('grants access when a user has permission to delete', () => {

      let req = {
        headers: {
          authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth('delete');

      return middleware(req,res,next)
        .then( () => {
          expect(next).toHaveBeenCalledWith();
        });

    });

    it('grants access when a user has permission to update', () => {

      let req = {
        headers: {
          authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth('update');

      return middleware(req,res,next)
        .then( () => {
          expect(next).toHaveBeenCalledWith();
        });

    });

    it('grants access when a user has permission to create', () => {

      let req = {
        headers: {
          authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth('create');

      return middleware(req,res,next)
        .then( () => {
          expect(next).toHaveBeenCalledWith();
        });

    });

    it('grants access when a user has permission to read', () => {

      let req = {
        headers: {
          authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth('read');

      return middleware(req,res,next)
        .then( () => {
          expect(next).toHaveBeenCalledWith();
        });

    });

  }); 

});
