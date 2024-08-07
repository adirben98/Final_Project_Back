import { Request, Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "./authController";
import User from "../Models/userModel";

class BaseController<ModelInterface> {
  model: mongoose.Model<ModelInterface>;

  constructor(model) {
    this.model = model;
  }

  async get(req: AuthRequest, res: Response) {
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
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  async post(req: AuthRequest, res: Response) {
    try {
      const modelObject = req.body;

      if ("author" in req.body) {
        const _id = req.user._id;
        const user = await User.findById({ _id: _id });
        modelObject.author = user!.username;
      }

      const newModelObject = await this.model.create(modelObject);
      res.status(201).send(newModelObject);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  async edit(req: AuthRequest, res: Response) {
    try {
      
        const modelObject = req.body;
        const updatedModel = await this.model.findByIdAndUpdate(
          modelObject._id,
          modelObject,
          { new: true }
        );
        res.status(200).send(updatedModel);
      
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      if (req.params.id != null) {
        await this.model.findByIdAndDelete({ _id: req.params.id });
        return res.status(200).send();
      }
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
}

export default BaseController;
