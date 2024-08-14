import express, { Express } from "express";
const app=express();
import mongoose from "mongoose";
import env from "dotenv";
env.config();
import bodyParser from "body-parser";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express"
import authRouter from "./src/Routes/authRouter";
import fileRouter from "./src/Routes/fileRouter";
import commentRouter from "./src/Routes/commentRouter"; 
import heroRouter from "./src/Routes/heroRoutes";
import bookRouter from "./src/Routes/bookRouter";



const init = () => {
    const promise = new Promise<Express>((resolve) => {
      const db = mongoose.connection;
      db.on("error", (error) => console.error(error));
      db.once("open", () => console.log("connected to database"));
      mongoose.connect(process.env.DATABASE_URL!).then(() => {
        const options = {
          definition: {
            openapi: "3.0.0",
            info: {
              title: "Web Dev 2022 REST API",
              version: "1.0.0",
              description: "REST server including authentication using JWT",
            },
            servers: [{ url: "https://193.106.55.140:80" }],
          },
          apis: ["./src/Routes/*.ts"],
        };
  
        const swaggerSpec = swaggerJsdoc(options);
  
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
  
        app.use(cors());
  
        app.use('/public', express.static('public'));
  
        app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
        app.use("/file", fileRouter);
        app.use("/auth", authRouter);
        app.use("/comment", commentRouter);
        app.use('/hero', heroRouter);
        app.use('/book',bookRouter)
  
  
        resolve(app);
      });
    });
    return promise;
  };
  
  export default init;


  