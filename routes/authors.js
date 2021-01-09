const express = require('express');
const { authorsController } = require('../controllers');

/**
 * @swagger
 * components:
 *  schemas:
 *    NewAuthor:
 *      type: object
 *      required:
 *        - name
 *        - job
 *      properties:
 *        name:
 *          type: string
 *        job:
 *          type: string
 *    Author:
 *      type: object
 *      properties:
 *        job:
 *          type: string
 *        createdAt:
 *          type: string
 *        id:
 *          type: integer
 *        name:
 *          type: string
 *        updatedAt:
 *          type: string
 */
const router = express.Router();

/**
 *  @swagger
 *  /api/authors:
 *    get:
 *      summary: Get list of authors
 *      tags:
 *        - Authors
 *      parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *        - in: query
 *          name: perPage
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  authors:
 *                    type: array
 *                    items:
 *                        $ref: '#/components/schemas/Author'
 *                  total:
 *                    type: integer
 */
router.get('/', async (req, res) => {
  const { query } = req;
  const authors = await authorsController.getAllAuthors(query);
  res.send(authors);
});

/**
 *  @swagger
 *  /api/authors/{id}:
 *    get:
 *      summary: Get one author
 *      tags:
 *        - Authors
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
 *                $ref: '#/components/schemas/Author'
 */
router.get('/:id', async (req, res) => {
  const author = await authorsController.getOneAuthor(+req.params.id);
  res.send(author);
});

/**
 *  @swagger
 *  /api/authors:
 *    post:
 *      summary: Add new author
 *      tags:
 *        - Authors
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/NewAuthor'
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Author'
 */
router.post('/', async (req, res) => {
  const author = await authorsController.addNewAuthor(req.body);
  res.send(author);
});

module.exports = router;
