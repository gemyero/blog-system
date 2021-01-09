const express = require('express');
const { articlesController } = require('../controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const { query } = req;
  const articles = await articlesController.getAllArticles(query);
  res.send(articles);
});

router.get('/:id', async (req, res) => {
  const article = await articlesController.getOneArticle(+req.params.id);
  res.send(article);
});

router.post('/', async (req, res) => {
  const article = await articlesController.addNewArticle(req.body);
  res.send(article);
});

router.post('/:id/comments', async (req, res) => {
  const comment = await articlesController.addNewCommentToArticle(+req.params.id, req.body);
  res.send(comment);
});

router.get('/:id/comments', async (req, res) => {
  const comments = await articlesController.getArticleComments(+req.params.id);
  res.send(comments);
});

router.patch('/:id/thumbUp', async (req, res) => {
  const article = await articlesController.incrementThumbUps(+req.params.id);
  res.send(article);
});

module.exports = router;
