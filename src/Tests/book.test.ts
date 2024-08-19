import request from "supertest";
import init from "../app";
import mongoose from "mongoose";
import { App } from "supertest/types";
import User from "../Models/userModel";
import Book, { IBook } from "../Models/bookModel";
import { TestUser } from "./auth.test";

const user: TestUser = {
    email: "Idan@gmail.com",
    username: "Idan the chef",
    password: "1234",
  };
  const book:IBook={
    title:"The Great Gatsby",
    paragraphs:["In my younger and more vulnerable", "years my father gave me some advice that I've been turning over in my mind ever since.",],
    images:["https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png","https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"],
    coverImg:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
    prompts:["In my younger and more vulnerable", "years my father gave me some advice that I've been turning over in my mind ever since.",],
    description:"The Great Gatsby is a novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    hero:"Jay Gatsby",
    author:"F. Scott Fitzgerald",
    authorImg:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
  }
let app:App
beforeAll(async () => {
    app = await init();
    console.log("Before all");
    await User.deleteMany({});
    await Book.deleteMany({});
    const res = await request(app).post("/auth/register").send(user);
    user.accessToken = res.body.accessToken;
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("Book Tests", () => {
    test("create book test", async () => {
        try {
            const response = await request(app)
            .post("/book")
            .set("Authorization", `Bearer ${user.accessToken}`)
            .send(book)
            expect(response.statusCode).toEqual(201);
            book._id = response.body._id;
        } catch (err) {
            console.log(err);
            expect(1).toEqual(2);
        }
    })
    test("book to docx file test", async () => {
        try {
            jest.setTimeout(30000)
            const response = await request(app)
            .post("/book/toDocx")
            .set("Authorization", `Bearer ${user.accessToken}`)
            .send({bookId:book._id})
            expect(response.statusCode).toEqual(200);
        } catch (err) {
            console.log(err);
            expect(1).toEqual(2);
        }

    });
  });