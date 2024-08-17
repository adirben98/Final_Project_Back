import express, { Request, Response } from "express";
const router = express.Router();
import func, { upload, downloadImage } from "../Controllers/fileController";
router.post("/download", (req: Request, res: Response) => {
  downloadImage(req.body.url)
    .then((path) => {
      res.status(200).send({ path });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});
router.post("/", upload.single("file"), func);
/**
 * @swagger
 * /file:
 *   post:
 *     summary: Upload a file
 *     description: Upload a file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 */
export default router;
