import Phaser from "phaser";

import "../characters/faune";

import Lizard from "../enemies/lizard";
import Wizard from "../enemies/wizards";

import Faune from "../characters/faune";

import { createCharacterAnims } from "../anims/characterAnims";
import { createLizardAnims } from "../anims/enemyAnims";
import { createChestAnims } from "../anims/treasurenims";

import { sceneEvents } from "../events/eventsHub";
import Chest from "../items/chest";
import BaseScene from "./BaseScene";
import { EGameEvents } from "../events/types";
import { EEnemyType } from "../enemies/types";
import Potions from "../items/potions";

export default class Game extends BaseScene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune!: Faune;
  private tileset!: Phaser.Tilemaps.Tileset;
  private map!: Phaser.Tilemaps.Tilemap;
  private wallsLayer!: Phaser.Tilemaps.TilemapLayer;
  private pillarsLayer!: Phaser.Tilemaps.TilemapLayer;
  private lizards!: Phaser.Physics.Arcade.Group;
  private wizards!: Phaser.Physics.Arcade.Group;
  private playerLizardsCollider?: Phaser.Physics.Arcade.Collider;
  private playerWizardsCollider?: Phaser.Physics.Arcade.Collider;
  private knives!: Phaser.Physics.Arcade.Group;
  private chests!: Phaser.Physics.Arcade.StaticGroup;
  private potions!: Phaser.Physics.Arcade.StaticGroup;
  private closedDoor!: Phaser.Tilemaps.TilemapLayer;
  private openDoor!: Phaser.Tilemaps.TilemapLayer;
  private fauneDoorCollider!: Phaser.Physics.Arcade.Collider;

  constructor() {
    super("GameScene");
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.runInterfaceScene();

    createCharacterAnims(this.anims);
    createLizardAnims(this.anims);
    createChestAnims(this.anims);

    this.createMap();
    this.createChests();
    this.createPlayer();
    this.createLizards();
    this.createWizards();
    this.createKnives();
    this.createPotions();
    this.createColliders();

    this.handleUIEvents();
  }

  private runInterfaceScene() {
    this.scene.run("GameInterfaceScene");
  }

  private createMap() {
    this.map = this.make.tilemap({ key: "dungeonHard" });
    this.tileset = this.map.addTilesetImage("dungeon", "tiles");
    this.map.createLayer("Ground", this.tileset);
    this.wallsLayer = this.map.createLayer("Walls", this.tileset);
    this.pillarsLayer = this.map.createLayer("Pilars", this.tileset);
    this.closedDoor = this.map.createLayer("ClosedDoor", this.tileset);
  }

  private createChests() {
    this.chests = this.physics.add.staticGroup({
      classType: Chest,
    });
    const chestsLayer = this.map.getObjectLayer("Chests");
    chestsLayer.objects.forEach((chestObj) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const chestWidth = chestObj.x! + chestObj.width! * 0.5;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const chestHeight = chestObj.y! - chestObj.height! * 0.5;
      this.chests.get(chestWidth, chestHeight, "treasure");
    });
  }

  private createPotions() {
    this.potions = this.physics.add.staticGroup({
      classType: Potions,
    });
    const potionsLayer = this.map.getObjectLayer("Potions");
    potionsLayer.objects.forEach((potionsObj) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const potionsWidth = potionsObj.x! + potionsObj.width! * 0.5;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const potionsHeight = potionsObj.y! - potionsObj.height! * 0.5;
      this.potions.get(potionsWidth, potionsHeight, "potion");
    });
  }

  private createPlayer() {
    this.faune = this.add.faune(128, 128, "faune");
    this.faune.setDepth(100);
    this.cameras.main.startFollow(this.faune, true);
  }

  private createLizards() {
    this.lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: (item) => {
        const lizGo = item as Lizard;
        lizGo.body.onCollide = true;
      },
    });

    const lizardsLayer = this.map.getObjectLayer("Lizards");
    lizardsLayer.objects.forEach((lizardObj) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const lizardWidth = lizardObj.x! + lizardObj.width! * 0.5;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const lizardHeight = lizardObj.y! - lizardObj.height! * 0.5;
      this.lizards.get(lizardWidth, lizardHeight, "lizard");
    });
  }

  private createWizards() {
    this.wizards = this.physics.add.group({
      classType: Wizard,
      createCallback: (item) => {
        const wizGo = item as Wizard;
        wizGo.body.onCollide = true;
      },
    });

    const wizardsLayer = this.map.getObjectLayer("Wizards");
    wizardsLayer.objects.forEach((wizardObj) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const wizardWidth = wizardObj.x! + wizardObj.width! * 0.5;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const wizardHeight = wizardObj.y! - wizardObj.height! * 0.5;
      this.wizards.get(wizardWidth, wizardHeight, "wizard");
    });
  }

  private createColliders() {
    this.pillarsLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.faune, this.pillarsLayer);
    this.physics.add.collider(this.lizards, this.pillarsLayer);
    this.physics.add.collider(this.wizards, this.pillarsLayer);

    this.wallsLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.faune, this.wallsLayer);
    this.physics.add.collider(this.lizards, this.wallsLayer);
    this.physics.add.collider(this.lizards, this.chests);
    this.physics.add.collider(this.wizards, this.wallsLayer);
    this.physics.add.collider(this.wizards, this.chests);

    this.closedDoor.setCollisionByProperty({ collides: true });
    this.fauneDoorCollider = this.physics.add.collider(
      this.faune,
      this.closedDoor
    );
    this.physics.add.collider(this.lizards, this.closedDoor);
    this.physics.add.collider(this.wizards, this.closedDoor);

    this.playerLizardsCollider = this.physics.add.collider(
      this.lizards,
      this.faune,
      this.handlePlayerLizardCollision,
      undefined,
      this
    );
    this.playerWizardsCollider = this.physics.add.collider(
      this.wizards,
      this.faune,
      this.handlePlayerWizardCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.knives,
      this.wallsLayer,
      this.handleKnifeWallCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.knives,
      this.lizards,
      this.handleKnifeLizardCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.faune,
      this.chests,
      this.handlePlayerChestCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.faune,
      this.potions,
      this.handlePlayerPotionCollision,
      undefined,
      this
    );
  }

  private handlePlayerLizardCollision(
    _: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const lizard = obj2 as Lizard;

    const dx = this.faune.x - lizard.x;
    const dy = this.faune.y - lizard.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.faune.handleDamage(dir, EEnemyType.LIZARD);

    sceneEvents.emit(EGameEvents.PLAYER_LIZARD_COLLISION, this.faune.health);

    if (this.faune.health <= 0) {
      this.playerLizardsCollider?.destroy();
    }
  }

  private handlePlayerWizardCollision(
    _: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const wizard = obj2 as Wizard;

    const dx = this.faune.x - wizard.x;
    const dy = this.faune.y - wizard.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.faune.handleDamage(dir, EEnemyType.WIZARD);

    sceneEvents.emit(EGameEvents.PLAYER_WIZARD_COLLISION, this.faune.health);

    if (this.faune.health <= 0) {
      this.playerWizardsCollider?.destroy();
    }
  }

  private createKnives() {
    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });
    this.faune.setKnives(this.knives);
  }

  private handleKnifeLizardCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    this.knives.killAndHide(obj1 as Phaser.Physics.Arcade.Image);
    this.lizards.killAndHide(obj2 as Lizard);
    this.faune.increaseCoinsForLizardKill();

    obj2.destroy();
    obj1.destroy();
  }

  private handleKnifeWallCollision(obj1: Phaser.GameObjects.GameObject) {
    this.knives.killAndHide(obj1 as Phaser.Physics.Arcade.Image);

    obj1.destroy();
  }

  private handlePlayerChestCollision(
    _: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const chest = obj2 as Chest;

    this.faune.setChest(chest);
  }

  private handlePlayerPotionCollision(
    _: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const potion = obj2 as Potions;

    this.faune.setPotion(potion);
  }

  private finishGame() {
    this.closedDoor.setAlpha(0);
    this.physics.world.removeCollider(this.fauneDoorCollider);
    this.openDoor = this.map.createLayer("OpenDoor", this.tileset);
    this.openDoor.setCollisionByProperty({ collides: true });
    this.openDoor.setDepth(1);
    this.physics.add.collider(
      this.faune,
      this.openDoor,
      () => this.scene.start("GameFinishedScene"),
      undefined,
      this
    );
  }

  private handleUIEvents() {
    sceneEvents.on(EGameEvents.READY_TO_EXIT, this.finishGame, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(EGameEvents.READY_TO_EXIT, this.finishGame, this);
    });
  }

  update() {
    if (this.faune) {
      this.faune.update(this.cursors);
    }
  }
}
