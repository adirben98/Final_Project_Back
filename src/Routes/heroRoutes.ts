import express from 'express';
import heroController from "../Controllers/heroController";
import { authMiddleware } from '../Controllers/authController';

const heroRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Hero:
 *       type: object
 *       required:
 *         - name
 *         - image
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the hero
 *         image:
 *           type: string
 *           description: The image URL of the hero
 */

/**
 * @swagger
 * tags:
 *   name: Heroes
 *   description: The heroes managing API
 */

/**
 * @swagger
 * /hero:
 *   get:
 *     summary: Returns the list of all the heroes
 *     tags: [Heroes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of the heroes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hero'
 */
heroRouter.get('/', authMiddleware, heroController.get.bind(heroController));

/**
 * @swagger
 * /hero/{name}:
 *   get:
 *     summary: Get the hero by name
 *     tags: [Heroes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The hero name
 *     responses:
 *       200:
 *         description: The hero description by name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hero'
 *       404:
 *         description: The hero was not found
 */
heroRouter.get('/:name', authMiddleware, heroController.getHeroByName.bind(heroController));

/**
 * @swagger
 * /hero:
 *   post:
 *     summary: Create a new hero
 *     tags: [Heroes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hero'
 *     responses:
 *       200:
 *         description: The hero was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hero'
 *       500:
 *         description: Some server error
 */
heroRouter.post('/', authMiddleware, heroController.post.bind(heroController));

/**
 * @swagger
 * /hero:
 *   put:
 *     summary: Update the hero
 *     tags: [Heroes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hero'
 *     responses:
 *       200:
 *         description: The hero was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hero'
 *       404:
 *         description: The hero was not found
 *       500:
 *         description: Some server error
 */
heroRouter.put('/', authMiddleware, heroController.edit.bind(heroController));

/**
 * @swagger
 * /hero/{id}:
 *   delete:
 *     summary: Remove the hero by id
 *     tags: [Heroes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The hero id
 *     responses:
 *       200:
 *         description: The hero was deleted
 *       404:
 *         description: The hero was not found
 */
heroRouter.delete('/:id', authMiddleware, heroController.delete.bind(heroController));

export default heroRouter;
