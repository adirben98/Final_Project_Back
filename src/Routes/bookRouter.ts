import express from 'express'
const bookRouter = express.Router();
import bookController from "../Controllers/bookController";

bookRouter.get('/getUserBooksAndFavorites/:name', bookController.getUserBooksAndFavorites.bind(bookController));

export default bookRouter;