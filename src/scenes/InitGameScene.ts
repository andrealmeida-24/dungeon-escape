import { FADE_TIME_DELAY, GAME_MENU } from "../config";

import { createGameTextFromImage, createMenuEntries } from "../utils";
import BaseScene from "./BaseScene";

export default class InitGameScene extends BaseScene {
  constructor() {
    super("InitGame");
  }

  create() {
    this.fadeIn();
    createGameTextFromImage(this, "gameTitle");
  }

  private fadeIn() {
    this.cameras.main.fadeIn(FADE_TIME_DELAY, 0, 0, 0);

    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE,
      () => {
        this.time.delayedCall(FADE_TIME_DELAY, () => {
          createMenuEntries(this, GAME_MENU);
        });
      }
    );
  }
}
