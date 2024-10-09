import BaseScene from "./BaseScene";

export default class ControlsScene extends BaseScene {
  controlsImage!: Phaser.GameObjects.Image;
  backButton!: Phaser.GameObjects.Image;

  constructor() {
    super("ControlsScene");
  }

  create() {
    this.createGameImage();
    this.createBackButton();
    this.backButtonEventsHandler();

    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  private createGameImage(): void {
    this.controlsImage = this.add.image(
      this.screenCenter[0],
      this.screenCenter[1],
      "controlsImage"
    );

    const scaleX = this.cameras.main.width / this.controlsImage.width;
    const scaleY = this.cameras.main.height / this.controlsImage.height;
    const scale = Math.max(scaleX, scaleY);
    this.controlsImage.setScale(scale).setScrollFactor(0);
  }

  private createBackButton(): void {
    this.backButton = this.add
      .image(this.screenCenter[0], this.screenCenter[1] + 100, "backButton")
      .setScale(0.75)
      .setInteractive();
  }

  private backButtonEventsHandler() {
    this.backButton.on("pointerup", () => {
      this.scene.start("InitGame");
    });
  }
}
