import Gun from "./Gun.js";
import PlasmaBullet from "./PlasmaBullet.js";

export default class PlasmaGun extends Gun {
  constructor(scene, bulletTexture, fireRate = 250, bulletSpeed = 700) {
    super(scene, bulletTexture, fireRate, bulletSpeed);

    // Override bullets group to use PlasmaBullet
    this.bullets = scene.physics.add.group({
      classType: PlasmaBullet,
      runChildUpdate: true,
    });
  }

  fire(x, y, angle) {
    const now = this.scene.time.now;

    if (now < this.nextFireTime) return;

    this.nextFireTime = now + this.fireRate;

    // Calculate velocity
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    // Create plasma bullet with higher damage
    const bullet = new PlasmaBullet(this.scene, x, y, this.bulletTexture, 40);
    // Add bullet to game scene group
    this.scene.playerBullets.add(bullet);

    if (bullet) {
      // Setting active in game scene
      bullet.setActive(true).setVisible(true);
      // Resetting to player body
      bullet.body.reset(x, y);

      bullet.setScale(this.bulletScale);

      const velocityX = Math.round(dx * this.bulletSpeed);
      const velocityY = Math.round(dy * this.bulletSpeed);

      // Setting base and initial velocities
      bullet.setBaseVelocity(velocityX, velocityY);
      bullet.setVelocity(velocityX, velocityY);
    }
  }
}
