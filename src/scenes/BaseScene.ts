import { MenuButton } from "../components/MenuButton";
import { SCREEN_CONFIG } from "../config";
import { MENU_BUTTONS_GAP } from "../styles";
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
        .dom(
          menuPosition[0],
          menuPosition[1],
          MenuButton({
            text: menuItem.text,
          }) as HTMLElement
        )
        .setOrigin(0.5, 1);
      lastMenuPositionY += MENU_BUTTONS_GAP;
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
