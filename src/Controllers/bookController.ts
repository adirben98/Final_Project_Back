import BaseController from "./baseController";
import Book, { IBook } from "../Models/bookModel";
import { Request, Response } from "express";
import User from "../Models/userModel";
import { AuthRequest } from "./authController";
import OpenAi from "openai";
import { downloadImage } from "./fileController";
import officegen from "officegen";

import {
  Document,
  Packer as DocxPacker,
  Paragraph,
  HeadingLevel,
  ImageRun,
  AlignmentType,
  PageBreak,
} from "docx";
import axios from "axios";
const docx = officegen("docx");
const openai = new OpenAi({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const style = {
  spiderman: "realistic",
  SpongeBob: "vibrant and cartoonish",
};

class BookController extends BaseController<IBook> {
  constructor() {
    super(Book);
  }

  generateStory = async (req: Request, res: Response) => {
    try {
      const isViolate = await this.checkPrompt(req.body.prompt);
      if (isViolate) {
        return res.status(400).send("Prompt violates content policies");
      }
      const userId = (req as AuthRequest).user._id;
      const user = await User.findById(userId);
      const { hero, prompt } = req.body;
      const story = await this.storyFetch(hero, prompt);
      const elements = await this.keyElementsDescription(story);
      let prompts = [];
      for (let i = 0; i < story.length; i++) {
        prompts.push(await this.promptCreation(story[i], elements));
      }
      const description = await this.generateDescription(story);
      const title = await this.generateTitle(story);
      const coverImg = await this.generateCover(title, description);
      if (coverImg === "") {
        return res
          .status(400)
          .send("Error in generating cover image, violating content policy");
      }
      const book = await Book.create({
        title: title,
        paragraphs: story,
        prompts: prompts,
        description: description,
        coverImg: coverImg,
        authorImg: user.image,
        author: user.username,
        hero: hero,
      });
      return res.status(200).send(book._id);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };
  async checkPrompt(prompt: string): Promise<boolean> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a content moderation assistant.",
          },
          {
            role: "user",
            content: `Does this prompt violate any content policies? '${prompt}'`,
          },
        ],
      });

      const contentCheck = response.choices[0].message?.content;

      if (contentCheck && contentCheck.toLowerCase().includes("yes")) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking prompt:", error);
      return true;
    }
  }
  generateCover = async (title: string, description: string) => {
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Generate a cover image for a story titled ${title} and the description of the story is: ${description}., please add the title of the photo to the photo and do not add the description to the photo!`,
      });
      let url: string;
      if (response.data[0].url) {
        url = await downloadImage(response.data[0].url);
        return url;
      }
      return "";
    } catch (err: any) {
      console.log(err);
      return "";
    }
  };
  generateTitle = async (story: string[]) => {
    const completions = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Generate a title for the story that is being read in the next paragraphs: ${story}`,
            },
          ],
        },
      ],
      model: "gpt-4o",
    });
    return completions.choices[0].message.content;
  };
  generateDescription = async (story: string[]) => {
    const completions = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Generate a short description for the story that is being read in the next paragraphs: ${story}`,
            },
          ],
        },
      ],
      model: "gpt-4o",
    });
    return completions.choices[0].message.content;
  };

  storyFetch = async (hero: string, prompt: string) => {
    const completions = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Generate an exactly five paragraph(make sure that after each paragraph you end the paragraph with only two \n\n) children story that the main character of it is ${hero} and the content of the story should rely on the next prompt: ${prompt}`,
            },
          ],
        },
      ],
      model: "gpt-4o",
    });
    console.log(completions.choices[0].message.content);
    const story = completions.choices[0].message.content;
    return story.split("\n\n");
  };
  keyElementsDescription = async (story: string[]) => {
    const completions = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `tell me all the key visual elements of the story:${story} and discribe for me each as detail as you can by appearance( color of the hair, how his beard looks like. every detail is important!) , age(if it is alive), distinctive features, colors, clothing(color of his shoes, color of shirt , if he has a mask, every garmet that the image wears etc...), emotional expressions, and also add the places described where the scenes are taken. Make sure to start your answer without any introduction. I need the answer to be in this structure: **Character name**: Description... .`,
            },
          ],
        },
      ],
      model: "gpt-4o",
    });
    return completions.choices[0].message.content;
  };
  promptCreation = async (paragraph: string, settings: string) => {
    const example =
      "Create a photo illustrating Spider-Man and Times Square\n\nPhoto description: The scene captures a bustling Times Square (description: A bustling hub in New York City, glowing with giant digital billboards and colorful lights. The streets are packed with people, who, in this scene, are initially under the influence of Joker's toxic laughing gas. The evening ambiance is filled with artificial light reflecting off the surrounding skyscrapers, a significant landmark of the city's incessant energy). The digital billboards display Joker's (description: The Joker is a notorious villain with a flamboyant and unsettling appearance. He has green hair, slicked back, and a pale white face with bright red lips stretched into a perpetual, disturbing grin. His eyes are heavily lined with black makeup, enhancing his manic expression. He is dressed in a garish ringmaster's outfit, which includes a purple tailcoat with green accents, yellow vest, plaid pants, and polished black shoes. He also carries a twirling cane. His age appears to be in his mid-forties) sinister face grinning mischievously. \n\nIn the midst of the chaos, Spider-Man (description: Spider-Man, under his iconic mask, is Peter Parker, a young man in his early twenties with short, brown hair and a clean-shaven face. His Spider-Man suit is a vibrant combination of red and blue. The suit features a large black spider emblem on the chest, web patterns across the red parts, and white eyes outlined in black on the mask. His gloves and boots are primarily red, and he wears web shooters on his wrists) is seen donning a protective mask, preparing his web-shooters. He stands on a rooftop overlooking the square, ready to seal the hidden vents that are spraying Joker's toxic laughing gas. The crowd below shows visible signs of confusion and panic gradually subsiding as Spider-Man disperses an antidote mist from his web-shooters. The overall mood transitions from chaotic and sinister to calm and relieved, captured in the bewildered yet smiling faces of the crowd below.";

    const completions = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Create a short prompt that describe a photo that reflects the scene that being read in the paragraph.The most important thing is that the prompt you return wont violate dalle-3 api cintent policy!. This is the paragraph you should make the prompt on:${paragraph}. After you created the prompt, scan the prompt and when you encounter a setting from the:${settings} what i need you to do is to add the character's or the place's right setting after the name of the setting.This is an example to how you should make your prompt correctly: ${example}. Make sure to start your answer without any introduction. In addition make sure you make a description to every element in the paragraph. Every character whenever mentioned gets a description.  Dont add ** before the prompt or after it. finally scan the prompt and make sure the prompt not exceeding 4000 charcters, which means that if it does exceed, you should elimenate unneccessery words but still make the contest as it was.`,
            },
          ],
        },
      ],
      model: "gpt-4o",
      max_tokens: 850,
    });
    return completions.choices[0].message.content;
  };

  generateImage = async (req: Request, res: Response) => {
    try {
      const { hero, prompt, index } = req.body;
      const book = await Book.findById(req.params.id);
      console.log(hero);

      console.log(style[hero]);
      if (index === -1) {
        book.coverImg = await this.generateCover(book.title, book.description);
        await book.save();
        return res.status(200).send(book.coverImg);
      } else {
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: `Generate an image according to this prompt: ${prompt}, make the images in the photo in style of ${style[hero]}.`,
        });

        const data = response;
        let url: string;
        if (data.data[0].url !== undefined) {
          url = await downloadImage(data.data[0].url);

          if (book!.images.length <= index) {
            book!.images.push(url);
          } else {
            book!.images[index] = url;
          }

          await book!.save();

          console.log(url);
          return res.status(200).send(url);
        }
      }
      res.status(400).send("Error in generating photo");
    } catch (error: any) {}
  };

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
      const user = await User.findById(userId);
      const bookId = req.params.id;
      const book = await Book.findById(bookId);
      if (book?.likedBy.includes(userId)) {
        return res.status(409).send("User already liked this book");
      } else {
        if (!req.body.isAuthor) {
          user!.favorites.push(bookId);
        }
        book!.likedBy.push(userId);
        book.likes += 1;
        await book!.save();
        await user?.save();
        return res.status(200).send(book);
      }
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  };

  likeDecrement = async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthRequest).user._id;
      const user = await User.findById(userId);
      const bookId = req.params.id;
      const book = await Book.findById(bookId);
      if (!book?.likedBy.includes(userId)) {
        return res.status(409).send("User has not liked this book");
      } else {
        if (!req.body.isAuthor) {
          user.favorites = user?.favorites.filter((id) => id !== bookId);
        }
        book!.likedBy = book!.likedBy.filter((id) => id !== userId);
        book.likes -= 1;
        await user?.save();
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

  toDocx = async (req: Request, res: Response) => {
    try {
      const book = await Book.findById(req.body.bookId);
      if (!book) {
        return res.status(404).send("Book not found");
      }

      // Helper function to fetch an image from a URL and return it as a Buffer
      const fetchImage = async (url: string): Promise<Buffer> => {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        return Buffer.from(response.data, "binary");
      };

      // Fetch cover image and other images
      const coverImageBuffer = await fetchImage(book.coverImg);
      const imageBuffers = await Promise.all(book.images.map(fetchImage));

      // Create the document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: book.title,
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                text: `Author: ${book.author}`,
                heading: HeadingLevel.HEADING_2,
              }),
              new Paragraph({
                text: `Hero: ${book.hero}`,
                heading: HeadingLevel.HEADING_3,
              }),
              new Paragraph({
                text: "Description:",
                heading: HeadingLevel.HEADING_3,
              }),
              new Paragraph({
                text: book.description,
                spacing: {
                  after: 200,
                },
              }),
              new Paragraph({
                text: "Cover Image:",
                heading: HeadingLevel.HEADING_3,
              }),
              new Paragraph({
                children: [
                  new ImageRun({
                    data: coverImageBuffer,
                    transformation: {
                      width: 400,
                      height: 300,
                    },
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              ...book.paragraphs
                .map((paragraph, index) => [
                  new Paragraph({
                    text: `Paragraph ${index + 1}:`,
                    heading: HeadingLevel.HEADING_4,
                  }),
                  new Paragraph({
                    text: paragraph,
                    spacing: {
                      after: 200,
                    },
                  }),
                  new Paragraph({
                    children: [new PageBreak()],
                  }),
                ])
                .flat(),
              ...imageBuffers
                .map((buffer, index) => [
                  new Paragraph({
                    text: `Image ${index + 1}:`,
                    heading: HeadingLevel.HEADING_4,
                    spacing: {
                      after: 200,
                    },
                  }),
                  new Paragraph({
                    children: [
                      new ImageRun({
                        data: buffer,
                        transformation: {
                          width: 400,
                          height: 300,
                        },
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                  new Paragraph({
                    children: [new PageBreak()],
                  }),
                ])
                .flat(),
            ],
          },
        ],
      });

      // Generate the document as a buffer
      const buffer = await DocxPacker.toBuffer(doc);

      // Set the response headers for a Word document
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${book.title}.docx"`
      );

      // Send the buffer as the response
      res.send(buffer);
    } catch (error) {
      console.error("Error generating document:", error);
      return res.status(500).send("Internal Server Error");
    }
  };
}
export default new BookController();
