import BaseScene from "./BaseScene";

export default class ScoreScene extends BaseScene {
  score!: number;
  constructor() {
    super("ScoreScene");
  }

  create() {
    this.createGameImage();
  }

  private createGameImage(): void {
    this.add.text(this.screenCenter[0] * 0.8, this.screenCenter[1], `You won!`);

    super.handleNavigateToMenu();
  }
}
