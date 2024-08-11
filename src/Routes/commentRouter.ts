import express from "express";
const commentRouter = express.Router();
import commentController from "../Controllers/commentController";
import { authMiddleware } from "../Controllers/authController";

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: The Comment API
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *         - bookId
 *       properties:
 *         content:
 *           type: string
 *           description: The comment content
 *         author:
 *           type: string
 *           description: The comment author
 *         bookId:
 *           type: string
 *           description: The comment book id
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The comment creation date
 *       example:
 *         content: "This is an amazing book!"
 *         author: "User123"
 *         bookId: "123124143"
 *         createdAt: "2023-07-15T19:20:30Z"
 */

/**
 * @swagger
 * /comment/{id}:
 *   get:
 *     summary: Get comments by book id
 *     description: Need to provide the access token in the auth header.
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The book id
 *     responses:
 *       200:
 *         description: The comments by book id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
commentRouter.get("/:id", authMiddleware, commentController.getCommentsByBookId.bind(commentController));

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Post a comment
 *     description: Need to provide the access token in the auth header. Also, provide the book id you are commenting on.
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: The comment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
commentRouter.post("/", authMiddleware, commentController.post.bind(commentController));

/**
 * @swagger
 * /comment:
 *   put:
 *     summary: Edit a comment
 *     description: Need to provide the access token in the auth header. Also, provide the comment id and the new content.
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *           examples:
 *             commentEditExample:
 *               value:
 *                 _id: "123124143"
 *                 content: "just edited my comment"
 *     responses:
 *       200:
 *         description: The comment was successfully edited
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
commentRouter.put("/", authMiddleware, commentController.edit.bind(commentController));

/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Need to provide the access token in the auth header.
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment id
 *     responses:
 *       200:
 *         description: The comment was successfully deleted!
 */
commentRouter.delete("/:id", authMiddleware, commentController.delete.bind(commentController));

export default commentRouter;
