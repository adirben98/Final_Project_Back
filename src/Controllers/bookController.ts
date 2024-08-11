import BaseController from "./baseController";
import Book, { IBook } from "../Models/bookModel";
import { Request, Response } from "express";
import User from "../Models/userModel";

class BookController extends BaseController<IBook> {
  constructor() {
    super(Book);
  }
  getUserBooksAndFavorites = async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ username: req.params.name });
      const userFavorites = user!.favorites;
      let favorites:IBook[] = [];
      for (let i = 0; i < userFavorites.length; i++) {
        const book:IBook | null = await Book.findById(userFavorites[i]);
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
  getBooksByAuthor = async (req: Request, res: Response) => {
    try {
      const author = req.params.author;
      const books = await Book.find({ author: author });
      res.status(200).send(books);
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  };
}
export default new BookController();
