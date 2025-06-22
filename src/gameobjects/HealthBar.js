export default class HealthBar {
  constructor(scene, maxHealth) {
    this.scene = scene;
    this.maxHealth = maxHealth;
    this.hearts = [];
  }

  drawHealth(health = this.maxHealth) {
    // Remove old hearts
    this.hearts.forEach((heart) => heart.destroy());
    this.hearts = [];

    const healthBorderGraphic = this.scene.add.graphics();
    healthBorderGraphic
      .lineStyle(5, 0xffffff, 1.0)
      .strokeRect(32, 96, this.maxHealth * 58, 62)
      .setDepth(1000)
      .setScrollFactor(0);

    for (let i = 0; i < health; i++) {
      const heart = this.scene.add
        .image(64 + i * 54, 128, "heart")
        .setScale(1.5)
        .setDepth(1000)
        .setScrollFactor(0);
      this.hearts.push(heart);
    }
  }
}
