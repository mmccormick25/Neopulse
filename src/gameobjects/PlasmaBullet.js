import Bullet from "./Bullet.js";

export default class PlasmaBullet extends Bullet {
  constructor(scene, x, y, texture, damage = 40) {
    super(scene, x, y, texture, damage);

    this.spiralRadius = 0;
    this.spiralSpeed = 0.2;
    this.baseVelocityX = 0;
    this.baseVelocityY = 0;
    this.age = 0;

    this.setScale(0.8);
  }

  preUpdate(time, delta) {
    // Always need to call preupdate super in preupdate function
    super.preUpdate(time, delta);

    // Create spiraling motion

    // Keep track of age to determine position in spiral
    this.age += delta * 0.001; // Convert to seconds
    // Radius of spirals
    this.spiralRadius = 300;
    // Getting X and Y velocities to create spiral motion
    const spiralX =
      Math.cos(this.age * this.spiralSpeed * 100) * this.spiralRadius;
    const spiralY =
      Math.sin(this.age * this.spiralSpeed * 100) * this.spiralRadius;

    // Apply spiral offset to base velocity
    this.setVelocity(
      this.baseVelocityX + spiralX,
      this.baseVelocityY + spiralY
    );
  }

  // Setting base velocity
  setBaseVelocity(vx, vy) {
    this.baseVelocityX = vx;
    this.baseVelocityY = vy;
  }
}
