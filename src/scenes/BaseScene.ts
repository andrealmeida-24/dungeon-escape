import { SCREEN_CONFIG } from "../config";
import { GameDifficulty } from "../types";

export default class BaseScene extends Phaser.Scene {
  screenCenter: [number, number];
  gameDifficulty!: GameDifficulty;

  constructor(key: string) {
    super(key);
    this.screenCenter = [SCREEN_CONFIG.width / 2, SCREEN_CONFIG.height / 2];
    this.gameDifficulty = GameDifficulty.EASY;
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
