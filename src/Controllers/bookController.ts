import BaseController from "./baseController";
import Book, { IBook } from "../Models/bookModel";
import { Request, Response } from "express";
import User from "../Models/userModel";
import { AuthRequest } from "./authController";

class BookController extends BaseController<IBook> {
  constructor() {
    super(Book);
  }
  getUserBooksAndFavorites = async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ username: req.params.name });
      const userFavorites = user!.favorites;
      let favorites: IBook[] = [];
      for (let i = 0; i < userFavorites.length; i++) {
        const book: IBook | null = await Book.findById(userFavorites[i]);
        favorites.push(book!);
      }
      const userBooks = await Book.find({ author: user!.username });

      return res.status(200).send({
        books: userBooks,
        favorites: favorites,
      });
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  };
  likeIncrement = async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthRequest).user._id;
      const user=await User.findById(userId)
      const bookId = req.params.id;
      const book = await Book.findById(bookId);
      if (book?.likedBy.includes(userId)) {
        return res.status(409).send("User already liked this book");
      } else {
        user!.favorites.push(bookId)
        book!.likedBy.push(userId);
        await book!.save();
        await user?.save()
        return res.status(200).send(book);
      }
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  };

  likeDecrement = async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthRequest).user._id;
      const user= await User.findById(userId)
      const bookId = req.params.id;
      const book = await Book.findById(bookId);
      if (!book?.likedBy.includes(userId)) {
        return res.status(409).send("User has not liked this book");
      } else {
        user?.favorites.push(bookId)
        book!.likedBy = book!.likedBy.filter((id) => id !== userId);
        await user?.save()
        await book!.save();
        return res.status(200).send(book);
      }
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  };

  isLiked = async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthRequest).user._id;
      const bookId = req.params.id;
      const book = await Book.findById(bookId);
      if (book?.likedBy.includes(userId)) {
        return res.status(200).send(true);
      } else {
        return res.status(200).send(false);
      }
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  };

  search = async (req: Request, res: Response) => {
    try {
      const query = req.params.query;
      const books = await Book.find({
        title: { $regex: query, $options: "i" },
      });
      res.status(200).send(books);
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  };

  searchByHero = async (req: Request, res: Response) => {
    try {
      const hero = req.params.hero;
      const books = await Book.find({ hero: hero });
      res.status(200).send(books);
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  };
}
export default new BookController();
