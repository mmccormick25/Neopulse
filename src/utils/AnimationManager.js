export default class AnimationManager {
  static createAnimations(scene) {
    // Create ghost movement animation
    scene.anims.create({
      key: "ghost_walk",
      frames: scene.anims.generateFrameNumbers("ghost", {
        start: 0,
        end: 1,
      }),
      frameRate: 6,
      repeat: -1,
    });

    // Create ghost die animation
    scene.anims.create({
      key: "ghost_die",
      frames: scene.anims.generateFrameNumbers("ghost_die", {
        start: 0,
        end: 3,
      }),
      frameRate: 12,
      repeat: 0,
    });

    // Create advanced ghost movement animation
    scene.anims.create({
      key: "advancedghost_walk",
      frames: scene.anims.generateFrameNumbers("advancedghost", {
        start: 0,
        end: 1,
      }),
      frameRate: 6,
      repeat: -1,
    });

    // Create advanced ghost die animation
    scene.anims.create({
      key: "advancedghost_die",
      frames: scene.anims.generateFrameNumbers("advancedghost_die", {
        start: 0,
        end: 3,
      }),
      frameRate: 12,
      repeat: 0,
    });
  }
}
