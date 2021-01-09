const express = require('express');
const { articlesController } = require('../controllers');

/**
 * @swagger
 * components:
 *  schemas:
 *    NewArticle:
 *      type: object
 *      required:
 *        - title
 *        - body
 *        - AuthorId
 *      properties:
 *        title:
 *          type: string
 *        body:
 *          type: string
 *        AuthorId:
 *          type: integer
 *        thumbsUp:
 *          type: integer
 *    Article:
 *      type: object
 *      properties:
 *        AuthorId:
 *          type: integer
 *        body:
 *          type: string
 *        createdAt:
 *          type: string
 *        id:
 *          type: integer
 *        thumbsUp:
 *          type: integer
 *        title:
 *          type: string
 *        updatedAt:
 *          type: string
 *    Comment:
 *      type: object
 *      properties:
 *        ArticleId:
 *          type: integer
 *        id:
 *          type: integer
 *        body:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
const router = express.Router();

/**
 *  @swagger
 *  /api/articles:
 *    get:
 *      summary: Get list of articles
 *      tags:
 *        - Articles
 *      parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *        - in: query
 *          name: perPage
 *          schema:
 *            type: integer
 *        - in: query
 *          name: sortedByThumbs
 *          schema:
 *            type: boolean
 *        - in: query
 *          name: term
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  articles:
 *                    type: array
 *                    items:
 *                        $ref: '#/components/schemas/Article'
 *                  total:
 *                    type: integer
 */
router.get('/', async (req, res) => {
  const { query } = req;
  const articles = await articlesController.getAllArticles(query);
  res.send(articles);
});

/**
 *  @swagger
 *  /api/articles/{id}:
 *    get:
 *      summary: Get one article
 *      tags:
 *        - Articles
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Article'
 */
router.get('/:id', async (req, res) => {
  const article = await articlesController.getOneArticle(+req.params.id);
  res.send(article);
});

/**
 *  @swagger
 *  /api/articles:
 *    post:
 *      summary: Add new article
 *      tags:
 *        - Articles
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/NewArticle'
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Article'
 */
router.post('/', async (req, res) => {
  const article = await articlesController.addNewArticle(req.body);
  res.send(article);
});

/**
 *  @swagger
 *  /api/articles/{id}/comments:
 *    patch:
 *      summary: Add comment to one article
 *      tags:
 *        - Articles
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - body
 *              properties:
 *                body:
 *                  type: string
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Comment'
 */
router.patch('/:id/comments', async (req, res) => {
  const comment = await articlesController.addNewCommentToArticle(+req.params.id, req.body);
  res.send(comment);
});

/**
 *  @swagger
 *  /api/articles/{id}/comments:
 *    get:
 *      summary: Get comments of one article
 *      tags:
 *        - Articles
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *        - in: query
 *          name: perPage
 *          schema:
 *            type: integer
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  comments:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Comment'
 *                  total:
 *                    type: integer
 */
router.get('/:id/comments', async (req, res) => {
  const { query } = req;
  const comments = await articlesController.getArticleComments(+req.params.id, query);
  res.send(comments);
});

/**
 *  @swagger
 *  /api/articles/{id}/thumbUp:
 *    patch:
 *      summary: Thumb up one article
 *      tags:
 *        - Articles
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Article'
 */
router.patch('/:id/thumbUp', async (req, res) => {
  const article = await articlesController.incrementThumbUps(+req.params.id);
  res.send(article);
});

module.exports = router;
