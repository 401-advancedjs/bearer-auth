'use strict';

const express = require('express');
const aclRouter = express.Router();
const auth = require('./middleware.js');

aclRouter.get('/public-stuff', (req, res, next) => {
  res.status(200).send('from public stuff');
});

aclRouter.get('/hidden-stuff', auth(), (req, res, next) => {
  res.status(200).send('from hidden stuff');
});

aclRouter.get('/something-to-read', auth('read'), (req, res, next) => {
  res.status(200).send('from something to read');
});

aclRouter.post('/create-a-thing', auth('create'), (req, res, next) => {
  res.status(200).send('from create a thing');
});

aclRouter.put('/update', auth('update'), (req, res, next) => {
  res.status(200).send('from update');
});

aclRouter.patch('/jp', auth('update'), (req, res, next) => {
  res.status(200).send('from jp');
});

aclRouter.delete('/bye-bye', auth('delete'), (req, res, next) => {
  res.status(200).send('from bye bye');
});

aclRouter.get('/everything', auth('superuser'), (req, res, next) => {
  res.status(200).send('from everything');
});

module.exports = aclRouter;

