export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, speed, health) {
    super(scene, x, y, texture);

    // Initialize the enemy sprite
    scene.add.existing(this);
    // Initialize physics for the enemy
    scene.physics.add.existing(this);

    // Setting enemy properties
    this.speed = speed;
    this.health = health;
  }

  updateEnemy(xVel, yVel) {
    this.x -= xVel;
    this.y -= yVel;
  }
}
