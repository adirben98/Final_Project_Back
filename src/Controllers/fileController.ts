import { Request, Response } from "express";
import multer from "multer";
import path from 'path'
import fs from 'fs'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
export const base = "https://193.106.55.140:80/";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/");
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").filter(Boolean).slice(1).join(".");
    cb(null, Date.now() + "." + ext);
  },
});

export const upload = multer({ storage: storage });

export default function (req: Request, res: Response) {
  res.status(200).send({ url: base + req.file!.path });
}
export const downloadImage = async (url: string): Promise<string> => {
    try {
      const filename = generateUniqueFilename("png");
      // Define the path where the image will be saved
      const filePath = path.resolve(__dirname, "..", "..","public", filename);
  
      // Make the request to the URL
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream", // Important for streaming the image
      });
  
      // Pipe the response stream to the file system
      response.data.pipe(fs.createWriteStream(filePath));
  
      // Wait for the download to finish
      await new Promise((resolve, reject) => {
        response.data.on("end", resolve);
        response.data.on("error", reject);
      });
  
      console.log(`Image downloaded and saved to ${filePath}`);
      return filePath
      
    } catch (error) {
      console.error("Error downloading the image:", error.message);
      throw error;
    }
  };
  export const generateUniqueFilename = (extension: string): string => {
    const uuid = uuidv4();
    return `${uuid}.${extension}`;
  };
  
