import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("tiles", "tiles/dungeon_tiles.png");
    this.load.image("ui-heart-empty", "ui/ui_heart_empty.png");
    this.load.image("ui-heart-full", "ui/ui_heart_full.png");
    this.load.image("weapon_knife", "weapons/weapon_knife.png");
    this.load.image("gameTitle", "ui/game_title.png");
    this.load.image("gamePauseImage", "ui/pause_image.png");
    this.load.image("gameOverImage", "ui/game_over_bg.png");
    this.load.image("controlsImage", "menus/controls/controls_bg.png");
    this.load.image("backButton", "menus/back.png");
    this.load.image("potion", "items/potion.png");

    this.load.tilemapTiledJSON("dungeonEasy", "dungeon/dungeon-lvl1.json");
    this.load.tilemapTiledJSON("dungeonHard", "dungeon/dungeon-lvl3.json");

    this.load.atlas("faune", "character/fauna.png", "character/fauna.json");
    this.load.atlas("lizard", "enemies/lizard.png", "enemies/lizard.json");
    this.load.atlas("treasure", "items/treasure.png", "items/treasure.json");
    this.load.atlas("wizard", "enemies/wizard.png", "enemies/wizard.json");
  }

  create() {
    this.scene.start("InitGame");
  }
}
