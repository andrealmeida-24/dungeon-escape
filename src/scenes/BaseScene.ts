import { SCREEN_CONFIG } from "../config";
import { sceneEvents } from "../events/eventsHub";
import { MENU_LINE_HEIGHT, MENU_TEXT_OPTIONS } from "../styles";
import { GameDifficulty } from "../types";

export default class BaseScene extends Phaser.Scene {
  screenCenter: [number, number];
  gameDifficulty!: GameDifficulty;

  constructor(key: string) {
    super(key);
    this.screenCenter = [SCREEN_CONFIG.width / 2, SCREEN_CONFIG.height / 2];

    this.gameDifficulty = GameDifficulty.EASY;
  }

  createMenu(menu: any, setupMenuEvents: any) {
    let lastMenuPositionY = 0;

    menu.forEach((menuItem: any) => {
      const menuPosition = [
        this.screenCenter[0],
        this.screenCenter[1] + 20 + lastMenuPositionY,
      ];
      menuItem.textGO = this.add
        .text(
          menuPosition[0],
          menuPosition[1],
          menuItem.text,
          MENU_TEXT_OPTIONS
        )
        .setOrigin(0.5, 1);
      lastMenuPositionY += MENU_LINE_HEIGHT;
      setupMenuEvents(menuItem);
    });
  }

  handleNavigateToMenu() {
    const navigateToMenu = setTimeout(() => {
      this.game.destroy(true);
      window.location.reload();
    }, 3000);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      clearTimeout(navigateToMenu);
    });
  }

  get difficulty(): GameDifficulty {
    return this.gameDifficulty;
  }
}
