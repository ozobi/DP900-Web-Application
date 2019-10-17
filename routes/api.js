const express = require('express');
const router = express.Router();
const request = require('request');

router.post('/initTest', (req, res) => {
	//console.log('initTest - http:\/\/'+req.body.valIP+':'+req.body.valPort+'/DP900Service/inittest');
	request.post('http://'+req.body.valIP+':'+req.body.valPort+'/DP900Service/inittest',
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
			res.send(body);
        }
    });
	res.status(200);
	return;
});

router.post('/startTest', (req, res) => {
	//console.log('startTest - http:\/\/'+req.body.valIP+':'+req.body.valPort+'/DP900Service/starttest');
	request.post('http://'+req.body.valIP+':'+req.body.valPort+'/DP900Service/starttest',
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
			res.send(body);
        }
    });
	res.status(200);
	return;
});

router.post('/stopTest', (req, res) => {
	//console.log('stopTest - http:\/\/'+req.body.valIP+':'+req.body.valPort+'/DP900Service/stoptest');
	request.post('http://'+req.body.valIP+':'+req.body.valPort+'/DP900Service/stoptest',
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
			res.send(body);
        }
    });
	res.status(200);
	return;
});

router.post('/resumeTest', (req, res) => {
	//console.log('resumeTest - http:\/\/'+req.body.valIP+':'+req.body.valPort+'/DP900Service/resumetest');
	request.post('http://'+req.body.valIP+':'+req.body.valPort+'/DP900Service/resumetest',
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
			res.send(body);
        }
    });
	res.status(200);
	return;
});

router.post('/endTest', (req, res) => {
	//console.log('endTest - http:\/\/'+req.body.valIP+':'+req.body.valPort+'/DP900Service/endtest');
	request.post('http://'+req.body.valIP+':'+req.body.valPort+'/DP900Service/endtest',
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
			res.send(body);
        }
    });
	res.status(200);
	return;
});

router.post('/openTest', (req, res) => {
	//console.log('openTest - http:\/\/'+req.body.valIP+':'+req.body.valPort+'/DP900Service/opentest?'+req.body.name);
	request.post('http://'+req.body.valIP+':'+req.body.valPort+'/DP900Service/opentest?name='+req.body.name,
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
			res.send(body);
        }
    });
	res.status(200);
	return;
});

router.post('/closeTest', (req, res) => {
	//console.log('closeTest - http:\/\/'+req.body.valIP+':'+req.body.valPort+'/DP900Service/closetest');
	request.post('http://'+req.body.valIP+':'+req.body.valPort+'/DP900Service/closetest',
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
			res.send(body);
        }
    });
	res.status(200);
	return;
});

router.post('/statusTest', (req, res) => {
	//console.log('statusTest - http:\/\/'+req.body.valIP+':'+req.body.valPort+'/DP900Service/teststatus');
	request.get('http://'+req.body.valIP+':'+req.body.valPort+'/DP900Service/teststatus',
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
			res.set('Content-Type', 'application/json')
			res.send(body);
        };
    });
	res.status(200);
	return;
});

module.exports = router;
