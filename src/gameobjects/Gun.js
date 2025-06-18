import Bullet from "./Bullet.js";

export default class Gun {
  constructor(scene, bulletTexture, fireRate = 200, bulletSpeed = 2000) {
    this.scene = scene;
    this.bulletTexture = bulletTexture;
    this.fireRate = fireRate; // milliseconds between shots
    this.bulletSpeed = bulletSpeed;

    // Next time stamp the gun is allowed to fire
    this.nextFireTime = 1000;

    // Create a group for bullets
    this.bullets = scene.physics.add.group({
      classType: Bullet || Phaser.Physics.Arcade.Sprite,
      runChildUpdate: true,
    });
  }

  fire(x, y, angle) {
    // Recording current time
    const now = this.scene.time.now;

    if (now < this.nextFireTime) return;

    this.nextFireTime = now + this.fireRate;

    // Calculate velocity
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    // Create bullet
    const bullet = this.bullets.get(x, y, this.bulletTexture, 1);
    if (bullet) {
      bullet.setActive(true).setVisible(true);
      bullet.body.reset(x, y);
      bullet.setVelocity(
        Math.round(dx * this.bulletSpeed),
        Math.round(dy * this.bulletSpeed)
      );
      bullet.setAngle((angle * 180) / Math.PI + 90);
    }
  }
}
