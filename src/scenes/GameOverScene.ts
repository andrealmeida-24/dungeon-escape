import { GAME_OVER_MENU } from "../config";
import { createGameTextFromImage, createMenuEntries } from "../utils";
import BaseScene from "./BaseScene";

export default class GameOverScene extends BaseScene {
  constructor() {
    super("GameOver");
  }

  create() {
    createMenuEntries(this, GAME_OVER_MENU);
    createGameTextFromImage(this, "gameOverImage");
  }
}
