require('express-async-errors');
const express = require('express');
const articlesRouter = require('./articles');
const authorsRouter = require('./authors');

const router = express.Router();

router.use('/articles', articlesRouter);
router.use('/authors', authorsRouter);

module.exports = router;
