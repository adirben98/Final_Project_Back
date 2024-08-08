import Hero, { IHero } from "../Models/heroModel";
import BaseController from "./baseController";
import { Request, Response } from "express";

class HeroController extends BaseController<IHero> {
  constructor() {
    super(Hero);
  }
  getHeroByName = async (req: Request, res: Response) => {
    try {
      const heroName = req.params.name;
      const hero = await Hero.findOne({ name: heroName });
        if (hero) {
            return res.status(200).send(hero);
        }
        return res.status(404).send("Hero not found");
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };
}
export default new HeroController();
