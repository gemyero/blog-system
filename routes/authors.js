const express = require('express');
const { authorsController } = require('../controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const { query } = req;
  const authors = await authorsController.getAllAuthors(query);
  res.send(authors);
});

router.get('/:id', async (req, res) => {
  const author = await authorsController.getOneAuthor(+req.params.id);
  res.send(author);
});

router.post('/', async (req, res) => {
  const author = await authorsController.addNewAuthor(req.body);
  res.send(author);
});

module.exports = router;
