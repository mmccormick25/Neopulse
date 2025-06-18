export default class AnimationManager {
  static createAnimations(scene) {
    // Create ghost movement animation
    scene.anims.create({
      key: "enemy_walk",
      frames: scene.anims.generateFrameNumbers("ghost", {
        start: 0,
        end: 1,
      }),
      frameRate: 6,
      repeat: -1,
    });

    // Create ghost ie animation
    scene.anims.create({
      key: "enemy_die",
      frames: scene.anims.generateFrameNumbers("ghost_die", {
        start: 0,
        end: 3,
      }),
      frameRate: 12,
      repeat: 0,
    });
  }
}
