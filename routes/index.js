const express = require('express');
const router = express.Router();

const apiRouter = require('./api');
router.use('/api', apiRouter)

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

module.exports = router;
