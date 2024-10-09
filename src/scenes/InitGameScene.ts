import { GAME_MENU, SCREEN_CONFIG } from "../config";
import { sceneEvents } from "../events/eventsHub";

import { GameDifficulty, Menu } from "../types";
import BaseScene from "./BaseScene";

export default class InitGameScene extends BaseScene {
  menu!: Menu;
  gameTitleImage!: Phaser.GameObjects.Image;

  constructor() {
    super("InitGame");

    this.menu = GAME_MENU;
  }

  create() {
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
    this.createGameText();
    sceneEvents.emit("game-difficulty", GameDifficulty.EASY);
  }

  setupMenuEvents(menuItem: any) {
    const textGO = menuItem.textGO;
    textGO.setInteractive();

    textGO.on("pointerup", () => {
      menuItem.scene && this.scene.start(menuItem.scene);
    });
  }

  createGameText() {
    this.gameTitleImage = this.add.image(
      this.screenCenter[0],
      this.screenCenter[1] - SCREEN_CONFIG.height * 0.2,
      this.menu === GAME_MENU ? "gameTitle" : "gamePauseImage"
    );

    const scaleX = this.cameras.main.width / (this.gameTitleImage.width * 2);
    const scaleY = this.cameras.main.height / (this.gameTitleImage.height * 2);
    const scale = Math.max(scaleX, scaleY);
    this.gameTitleImage.setScale(scale).setScrollFactor(0);
  }
}
