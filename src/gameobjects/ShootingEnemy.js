import Enemy from "./Enemy.js";
import Bullet from "./Bullet.js";

export default class ShootingEnemy extends Enemy {
  constructor(scene, x, y, id, speed, health) {
    super(scene, x, y, id, speed, health);

    // Tint the enemy to distinguish it from regular ghosts
    this.setTint(0xff4444); // Red tint

    // Shooting properties
    this.shootCooldown = 0;
    this.shootDelay = 2000; // Shoot every 2 seconds
    this.shootRange = 350; // Only shoot if player is within this range
    this.bulletSpeed = 200;
  }

  updateEnemy(playerX, playerY) {
    // Call parent update method for movement
    super.updateEnemy(playerX, playerY);

    // Handle shooting logic
    this.updateShooting(playerX, playerY);
  }

  damage(amount) {
    if (this.dying) return; // Prevent further damage if already dying

    // Reduce enemy health by the damage amount
    this.health -= amount;

    // Tint the enemy blue
    this.setTint(0x00fffd);

    // Return to red tint after 1 second
    this.scene.time.delayedCall(100, () => {
      if (this.active) this.setTint(0xff4444); // Red tint
    });

    // Check if enemy health is less than or equal to 0
    if (this.health <= 0 && !this.dying) {
      this.die();
    }
  }

  updateShooting(playerX, playerY) {
    if (this.dying) return;

    // Update shoot cooldown
    if (this.shootCooldown > 0) {
      this.shootCooldown -= this.scene.game.loop.delta;
    }

    // Calculate distance to player
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only shoot if player is in range and cooldown is ready
    if (distance <= this.shootRange && this.shootCooldown <= 0) {
      this.shootAtPlayer(playerX, playerY);
      this.shootCooldown = this.shootDelay;
    }
  }

  shootAtPlayer(playerX, playerY) {
    // Get or create a bullet
    const bullet = this.scene.enemyBullets.get(this.x, this.y, "defaultbullet");

    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.damage = 1; // Enemy bullets do 1 damage

      bullet.setTint(0xff4444); // Red tint

      // Calculate angle to player
      const angle = Phaser.Math.Angle.Between(this.x, this.y, playerX, playerY);

      // Set bullet velocity towards player
      bullet.body.setVelocity(
        Math.cos(angle) * this.bulletSpeed,
        Math.sin(angle) * this.bulletSpeed
      );

      // Making bullet face player
      bullet.setAngle((angle * 180) / Math.PI + 90);

      // Destroy bullet after 3 seconds if it doesn't hit anything
      this.scene.time.delayedCall(10000, () => {
        if (bullet.active) {
          bullet.destroy();
        }
      });
    }
  }
}
