import HealthBar from "../gameobjects/HealthBar.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, character, speed, health) {
    super(scene, x, y, character);

    // Initialize the player sprite
    scene.add.existing(this);
    // Initialize physics for players
    scene.physics.add.existing(this);

    this.setScale(0.75);

    this.speed = speed;
    this.baseSpeed = this.speed;
    this.speedUpgrade = 0;

    this.health = health;
    this.knockbackTimer = 0;
    this.invincibilityTimer = 0;
    this.maxHealth = health;

    // Choosing turret based on character type
    switch (character) {
      case "squareplayer":
        this.turret = scene.add.sprite(x, y, "squareturret");
        break;
      case "circleplayer":
        this.turret = scene.add.sprite(x, y, "circleturret");
        break;
      case "triangleplayer":
        this.turret = scene.add.sprite(x, y, "triangleturret");
        break;
      default:
        console.error("Unknown character type:", character);
        this.turret = scene.add.sprite(x, y, "squareturret");
        break;
    }

    this.setDepth(10);

    this.turret.setScale(0.75);
    this.turret.setDepth(10); // Ensure turret is above enemies
    this.turretAngle = 0;

    this.healthBar = new HealthBar(scene, this.maxHealth);
    this.healthBar.drawHealth();
  }

  // Function when player is hit by an enemy
  playerHit(enemyX, enemyY) {
    // If player is invincible, ignore hit
    if (this.invincibilityTimer > 0) return;

    // Reduce player health
    this.health -= 1;

    // Drawing player health
    this.healthBar.drawHealth(this.health);

    if (this.health <= 0) {
      this.scene.endGame();
      return;
    }

    this.setTint(0xff0000); // Tint player red on hit

    // Getting angle to launch player at
    const launchAngle = Phaser.Math.Angle.Between(
      enemyX,
      enemyY,
      this.x,
      this.y
    );

    // Setting velocity to launch player away from enemy
    this.setVelocity(Math.cos(launchAngle) * 500, Math.sin(launchAngle) * 500);
    // Setting knockback timer
    this.knockbackTimer = 100;

    // Use custom invincibility duration if set, otherwise default to 1000ms
    const invincibilityDuration = this.invincibilityDuration || 1000;
    this.invincibilityTimer = invincibilityDuration;
  }

  movePlayer(cursors, keys) {
    // If player is knocked back, do not allow movement
    if (this.knockbackTimer > 0) {
      this.knockbackTimer -= this.scene.game.loop.delta;
      if (this.knockbackTimer <= 0) {
        this.knockbackTimer = 0; // Reset timer
        this.setVelocity(0, 0); // Stop movement after knockback
        this.setTint(0xff00e1); // Set invincibility tint
      }
      return; // Skip further movement logic
    }

    if (this.invincibilityTimer > 0) {
      this.invincibilityTimer -= this.scene.game.loop.delta;
      if (this.invincibilityTimer <= 0) {
        this.invincibilityTimer = 0; // Reset timer
        this.clearTint(); // Clear tint after invincibility
      }
    }

    let dx = 0;
    let dy = 0;

    // Check left: arrow left or A
    if (cursors.left.isDown || keys.A.isDown) dx = -1;
    // Check right: arrow right or D
    else if (cursors.right.isDown || keys.D.isDown) dx = 1;

    // Check up: arrow up or W
    if (cursors.up.isDown || keys.W.isDown) dy = -1;
    // Check down: arrow down or S
    else if (cursors.down.isDown || keys.S.isDown) dy = 1;

    if (dx !== 0 && dy !== 0) {
      // This is the side length of a triangle with a hypotenuse of length 1
      const norm = Math.SQRT1_2;
      dx *= norm;
      dy *= norm;
    }

    this.body.setVelocity(dx * this.speed, dy * this.speed);
  }

  updateTurret(pointer, camera) {
    // Locking turret position to player
    this.turret.x = this.x;
    this.turret.y = this.y;

    const pointerX = pointer.x;
    const pointerY = pointer.y;

    // Convert pointer position to world coordinates
    const worldPoint = camera.getWorldPoint(pointer.x, pointer.y);

    // Setting turret angle
    this.turretAngle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      worldPoint.x,
      worldPoint.y
    );

    this.turret.rotation = this.turretAngle + Math.PI / 2;
  }

  updateMaxHealth(newMaxHealth) {
    // Update max health and redraw health bar
    this.maxHealth = newMaxHealth;
    this.healthBar.maxHealth = newMaxHealth;
    this.healthBar.drawHealth(this.health);
  }
}
