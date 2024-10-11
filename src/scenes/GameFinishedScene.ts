import { FINISHED_GAME_MENU } from "../config";
import { createGameTextFromImage, createMenuEntries } from "../utils";
import BaseScene from "./BaseScene";

export default class GameFinishedScene extends BaseScene {
  constructor() {
    super("GameFinished");
  }

  create() {
    createMenuEntries(this, FINISHED_GAME_MENU);
    createGameTextFromImage(this, "gameFinished");
  }
}
