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

    this.play("enemy_walk");
  }

  updateEnemy(playerX, playerY) {
    // Calculate the direction towards the player
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If enemy far enough from player, move towards player
    if (distance > 0) {
      const normalizedDx = dx / distance;
      const normalizedDy = dy / distance;

      // Setting velocity of enemy
      this.body.setVelocity(
        normalizedDx * this.speed,
        normalizedDy * this.speed
      );
    } else {
      this.body.setVelocity(0, 0);
    }
  }

  damage(amount) {
    // Reduce enemy health by the damage amount
    this.health -= amount;
    console.log(`Enemy damaged! Current health: ${this.health}`);

    // Check if enemy health is less than or equal to 0
    this.checkHealth();
  }

  checkHealth() {
    console.log(`Enemy health: ${this.health}`);
    // If enemy health is less than or equal to 0, deactivate it
    if (this.health <= 0) {
      this.destroy();
    }
  }
}
