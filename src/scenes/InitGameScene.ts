import { MenuButton } from "../components/MenuButton";
import { FADE_TIME_DELAY, GAME_MENU, SCREEN_CONFIG } from "../config";
import { sceneEvents } from "../events/eventsHub";
import { MENU_BUTTONS_GAP } from "../styles";

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
    this.fadeIn();
    this.createGameText();
    sceneEvents.emit("game-difficulty", GameDifficulty.EASY);
  }

  fadeIn() {
    this.cameras.main.fadeIn(FADE_TIME_DELAY, 0, 0, 0);

    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE,
      () => {
        this.time.delayedCall(FADE_TIME_DELAY, () => {
          this.createMenu(this.menu);
        });
      }
    );
  }

  createMenu(menu: any) {
    let lastMenuPositionY = 0;

    menu.forEach((menuItem: any) => {
      const menuPosition = [
        this.screenCenter[0],
        this.screenCenter[1] + 20 + lastMenuPositionY,
      ];
      menuItem.textGO = this.add
        .dom(
          menuPosition[0],
          menuPosition[1],
          MenuButton({
            text: menuItem.text,
          }) as HTMLElement
        )
        .setOrigin(0.5, 1);

      lastMenuPositionY += MENU_BUTTONS_GAP;
      this.setupMenuEvents(menuItem);
    });
  }

  setupMenuEvents(menuItem: any) {
    const textGO = menuItem.textGO;
    textGO.setInteractive();

    textGO.on("pointerup", () => {
      this.cameras.main.fadeOut(FADE_TIME_DELAY, 0, 0, 0);
      textGO.removeInteractive();

      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.time.delayedCall(FADE_TIME_DELAY, () => {
            menuItem.scene && this.scene.start(menuItem.scene);
          });
        }
      );
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
