import { Request, Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "./authController";
import User from "../Models/userModel";

class BaseController<ModelInterface> {
  model: mongoose.Model<ModelInterface>;

  constructor(model:mongoose.Model<ModelInterface>) {
    this.model = model;
  }

  async get(req: Request, res: Response) {
    try {
      if (req.params.id != null) {
        const modelObject = await this.model.findById(req.params.id);
        if (modelObject != null) {
          return res.status(200).send(modelObject);
        }
        return res.status(404).send();
      } else {
        const modelObjects = await this.model.find();
        return res.status(200).send(modelObjects);
      }
    } catch (err:any) {
      res.status(400).send(err.message);
    }
  }

  async post(req: Request, res: Response) {
    try {
      const modelObject = req.body;

      if ("author" in req.body) {
        const _id = (req as AuthRequest).user._id;
        const user = await User.findById({ _id: _id });
        modelObject.author = user!.username;
      }

      const newModelObject = await this.model.create(modelObject);
      res.status(201).send(newModelObject);
    } catch (err:any) {
      res.status(400).send(err.message);
    }
  }

  async edit(req: Request, res: Response) {
    try {
        if ("edited" in req.body) {
            req.body.edited = true;
        }
        const modelObject = req.body;
        const updatedModel = await this.model.findByIdAndUpdate(
          modelObject._id,
          modelObject,
          { new: true }
        );
        res.status(200).send(updatedModel);
      
    } catch (err:any) {
      res.status(400).send(err.message);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      if (req.params.id != null) {
        await this.model.findByIdAndDelete({ _id: req.params.id });
        return res.status(200).send();
      }
    } catch (err:any) {
      res.status(400).send(err.message);
    }
  }
}

export default BaseController;
