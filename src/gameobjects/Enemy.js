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
    this.dying = false;

    this.setScale(0.75);

    this.play("enemy_walk");
  }

  updateEnemy(playerX, playerY) {
    // Calculate the direction towards the player
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Despawn enemy if too far from player
    if (distance > 600) {
      this.setActive(false);
      this.setVisible(false);
      // If enemy far enough from player, move towards player
    } else if (distance > 0) {
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
    if (this.dying) return; // Prevent further damage if already dying

    // Reduce enemy health by the damage amount
    this.health -= amount;

    // Tint the enemy blue
    this.setTint(0x00fffd);

    // Remove the tint after 100ms
    this.scene.time.delayedCall(100, () => {
      if (this.active) this.clearTint();
    });

    // Check if enemy health is less than or equal to 0
    this.checkHealth();
  }

  checkHealth() {
    // If enemy health is less than or equal to 0, deactivate it
    if (this.health <= 0 && !this.dying) {
      this.dying = true; // Prevent further damage processing

      // Disable physics body to turn off collisions
      this.body.enable = false;

      this.play("enemy_die", true);

      // Destroy only after the death animation is complete
      this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.destroy();
      });
    }
  }
}
