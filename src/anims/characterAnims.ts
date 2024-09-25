import Phaser from "phaser";

const playerAnimationDirections = ["down", "up", "side"];

const createPlayerRunAnimations = (
  anims: Phaser.Animations.AnimationManager
) => {
  playerAnimationDirections.forEach((direction) => {
    anims.create({
      key: `faune-run-${direction}`,
      frames: anims.generateFrameNames("faune", {
        start: 1,
        end: 8,
        prefix: `run-${direction}-`,
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 12,
    });
  });
};

const createPlayerIdleAnimations = (
  anims: Phaser.Animations.AnimationManager
) => {
  playerAnimationDirections.forEach((direction) => {
    anims.create({
      key: `faune-idle-${direction}`,
      frames: [
        {
          key: "faune",
          frame: `walk-${direction}-3.png`,
        },
      ],
    });
  });
};

const createPlayerDeadAnimation = (
  anims: Phaser.Animations.AnimationManager
) => {
  anims.create({
    key: "faune-faint",
    frames: anims.generateFrameNames("faune", {
      start: 1,
      end: 4,
      prefix: "faint-",
      suffix: ".png",
    }),
    frameRate: 14,
  });
};

export const createCharacterAnims = (
  anims: Phaser.Animations.AnimationManager
) => {
  createPlayerIdleAnimations(anims);
  createPlayerRunAnimations(anims);
  createPlayerDeadAnimation(anims);
};
