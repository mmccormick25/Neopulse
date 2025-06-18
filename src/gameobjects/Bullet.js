export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, damage = 1) {
    super(scene, x, y, texture);

    this.damage = damage; // Bullet damage

    // Initialize bullet sprite
    scene.add.existing(this);
    // Initialize physics for bullet
    scene.physics.add.existing(this);

    this.setDepth(2);
  }

  hitEnemy(enemy) {
    enemy.damage(this.damage);

    // Destroying bullet on enemy hit
    this.destroy();
  }
}
