import express from "express";
const bookRouter = express.Router();
import bookController from "../Controllers/bookController";
import { auth } from "google-auth-library";
import { authMiddleware } from "../Controllers/authController";

bookRouter.get("/", bookController.get.bind(bookController));
bookRouter.get("/:id", bookController.get.bind(bookController));
bookRouter.get("/isLiked/:id", bookController.isLiked.bind(bookController));
bookRouter.get("/like/:id", bookController.likeIncrement.bind(bookController));
bookRouter.get(
  "/unlike/:id",
  bookController.likeIncrement.bind(bookController)
);

bookRouter.get(
  "/getUserBooksAndFavorites/:name",
  bookController.getUserBooksAndFavorites.bind(bookController)
);

bookRouter.get("/search/:query", authMiddleware, bookController.search.bind(bookController));

bookRouter.get("/searchByHero/:hero", authMiddleware, bookController.searchByHero.bind(bookController));
bookRouter.delete("/:id", bookController.delete.bind(bookController));

export default bookRouter;
