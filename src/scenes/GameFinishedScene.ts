import BaseScene from "./BaseScene";

export default class ScoreScene extends BaseScene {
  constructor() {
    super("GameFinishedScene");
  }

  create() {
    this.createFinishGameText();
  }

  private createFinishGameText(): void {
    this.add.text(this.screenCenter[0] * 0.8, this.screenCenter[1], `You won!`);

    super.handleNavigateToMenu();
  }
}
