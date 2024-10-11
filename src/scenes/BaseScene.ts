import { SCREEN_CONFIG } from "../config";

export default class BaseScene extends Phaser.Scene {
  screenCenter: [number, number];

  constructor(key: string) {
    super(key);
    this.screenCenter = [SCREEN_CONFIG.width / 2, SCREEN_CONFIG.height / 2];
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
}
