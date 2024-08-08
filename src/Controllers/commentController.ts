import BaseController from "./baseController";
import Comment, { IComment } from "../Models/commentModel";
import { Response, Request } from "express";

class CommentController extends BaseController<IComment>{
    constructor() {
        super(Comment);
    }
    getCommentsByBookId = async (req: Request, res: Response) => {
        try {
            const bookId = req.params.id;
            const comments = await Comment.find({ bookId: bookId });
            res.status(200).send(comments);
        } catch (err:any) {
            res.status(400).send(err.message);
        }
    }

}
export default new CommentController();