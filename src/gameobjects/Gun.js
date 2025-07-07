export default class Gun {
  constructor(scene, bulletTexture, fireRate = 300, bulletSpeed = 2000) {
    this.scene = scene;
    this.bulletTexture = bulletTexture;

    // Fire rate vars
    this.fireRate = fireRate;
    this.baseFireRate = this.fireRate;
    this.fireRateUpgrade = 0;

    // Bullet speed vars
    this.bulletSpeed = bulletSpeed;
    this.baseBulletSpeed = this.bulletSpeed;
    this.bulletSpeedUpgrade = 0;

    this.bulletScale = 1;

    // Bullet damage vars
    this.bulletDamage = 34;
    this.baseBulletDamage = this.bulletDamage;
    this.bulletDamageUpgrade = 0;

    // Next time stamp the gun is allowed to fire
    this.nextFireTime = 0;
  }

  fire(x, y, angle) {
    // Recording current time
    const now = this.scene.time.now;

    if (now < this.nextFireTime) return;

    this.nextFireTime = now + this.fireRate;

    // Calculate velocity
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    // Create bullet with current damage value
    const bullet = this.scene.playerBullets.get(
      x,
      y,
      this.bulletTexture,
      this.bulletDamage
    );
    if (bullet) {
      bullet.setScale(this.bulletScale);
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
