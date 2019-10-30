const express = require('express');
const router = express.Router();
const request = require('request');
var debug = require('debug')('API')
  , debugStatus = require('debug')('Status');

router.post('/initTest', (req, res) => {
  debug('initTest - http:\/\/'+req.body.valIP+':'+req.body.valPort+'/DP900Service/inittest');
  request.post('http://'+req.body.valIP+':'+req.body.valPort+'/DP900Service/inittest',
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.set('Content-Type', 'application/json')
      res.status(200);
      res.send(body);
    } else {
      res.set('Content-Type', 'application/json')
      res.status(404);
      res.send("");
    };
  });
  return;
});

router.post('/startTest', (req, res) => {
  debug('startTest - http:\/\/'+req.body.valIP+':'+req.body.valPort+'/DP900Service/starttest');
  request.post('http://'+req.body.valIP+':'+req.body.valPort+'/DP900Service/starttest',
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.set('Content-Type', 'application/json')
      res.status(200);
      res.send(body);
    } else {
      res.set('Content-Type', 'application/json')
      res.status(404);
      res.send("");
    };
  });
  return;
});

router.post('/stopTest', (req, res) => {
  debug('stopTest - http:\/\/'+req.body.valIP+':'+req.body.valPort+'/DP900Service/stoptest');
  request.post('http://'+req.body.valIP+':'+req.body.valPort+'/DP900Service/stoptest',
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.set('Content-Type', 'application/json')
      res.status(200);
      res.send(body);
    } else {
      res.set('Content-Type', 'application/json')
      res.status(404);
      res.send("");
    };
  });
  return;
});

router.post('/resumeTest', (req, res) => {
  debug('resumeTest - http:\/\/'+req.body.valIP+':'+req.body.valPort+'/DP900Service/resumetest');
  request.post('http://'+req.body.valIP+':'+req.body.valPort+'/DP900Service/resumetest',
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.set('Content-Type', 'application/json')
      res.status(200);
      res.send(body);
    } else {
      res.set('Content-Type', 'application/json')
      res.status(404);
      res.send("");
    };
  });
  return;
});

router.post('/endTest', (req, res) => {
  debug('endTest - http:\/\/'+req.body.valIP+':'+req.body.valPort+'/DP900Service/endtest');
  request.post('http://'+req.body.valIP+':'+req.body.valPort+'/DP900Service/endtest',
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.set('Content-Type', 'application/json')
      res.status(200);
      res.send(body);
    } else {
      res.set('Content-Type', 'application/json')
      res.status(404);
      res.send("");
    };
  });
  return;
});

router.post('/openTest', (req, res) => {
  debug('openTest - http:\/\/'+req.body.valIP+':'+req.body.valPort+'/DP900Service/opentest?'+req.body.name);
  request.post('http://'+req.body.valIP+':'+req.body.valPort+'/DP900Service/opentest?name='+req.body.name,
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.set('Content-Type', 'application/json')
      res.status(200);
      res.send(body);
    } else {
      res.set('Content-Type', 'application/json')
      res.status(404);
      res.send("");
    };
  });
  return;
});

router.post('/closeTest', (req, res) => {
  debug('closeTest - http:\/\/'+req.body.valIP+':'+req.body.valPort+'/DP900Service/closetest');
  request.post('http://'+req.body.valIP+':'+req.body.valPort+'/DP900Service/closetest',
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.set('Content-Type', 'application/json')
      res.status(200);
      res.send(body);
    } else {
      res.set('Content-Type', 'application/json')
      res.status(404);
      res.send("");
    };
  });
  return;
});

router.post('/statusTest', (req, res) => {
  debugStatus('statusTest - http:\/\/'+req.body.valIP+':'+req.body.valPort+'/DP900Service/teststatus');
  request.get('http://'+req.body.valIP+':'+req.body.valPort+'/DP900Service/teststatus', {timeout: 4000},
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.set('Content-Type', 'application/json')
      res.status(200);
      res.send(body);
    } else {
      res.set('Content-Type', 'application/json')
      res.status(404);
      res.send("");
    };
  });
  return;
});

router.post('/stateLastCmd', (req, res) => {
  debugStatus('stateLastCmd - http:\/\/'+req.body.valIP+':'+req.body.valPort+'/DP900Service/lastcmdstate');
  request.get('http://'+req.body.valIP+':'+req.body.valPort+'/DP900Service/lastcmdstate', {timeout: 4000},
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.set('Content-Type', 'application/json')
      res.status(200);
      res.send(body);
    } else {
      res.set('Content-Type', 'application/json')
      res.status(404);
      res.send("");
    };;
  });
  return;
});


module.exports = router;
