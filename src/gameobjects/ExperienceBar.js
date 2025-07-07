export default class ExperienceBar {
  constructor(scene) {
    this.scene = scene;
    this.barWidth = 400;
    this.barHeight = 20;
    this.x = scene.scale.width / 2 - this.barWidth / 2;
    this.y = scene.scale.height - 40;

    // Create background bar
    this.backgroundBar = scene.add.graphics();
    this.backgroundBar.setScrollFactor(0);
    // UI displays above bullets and enemies
    this.backgroundBar.setDepth(100);

    // Create experience bar
    this.experienceBar = scene.add.graphics();
    this.experienceBar.setScrollFactor(0);
    // Experience bar goes on top of experience background
    this.experienceBar.setDepth(101);

    // Create level text
    this.levelText = scene.add.text(this.x - 60, this.y, "LV 1", {
      fontFamily: "Pixelify Sans",
      fontSize: "18px",
      color: "#ffffff",
    });
    this.levelText.setScrollFactor(0);
    this.levelText.setDepth(100);

    // Initial empty bar before real exp vars are intitialized
    this.drawBar(0, 1);
  }

  drawBar(currentExp, expToNext) {
    // Clear previous graphics
    this.backgroundBar.clear();
    this.experienceBar.clear();

    // Draw background
    this.backgroundBar.fillStyle(0x333333);
    this.backgroundBar.fillRect(this.x, this.y, this.barWidth, this.barHeight);

    // Draw experience fill
    const fillWidth = (currentExp / expToNext) * this.barWidth;
    this.experienceBar.fillStyle(0x00ff00);
    this.experienceBar.fillRect(this.x, this.y, fillWidth, this.barHeight);

    // Draw border
    this.backgroundBar.lineStyle(2, 0xffffff);
    this.backgroundBar.strokeRect(
      this.x,
      this.y,
      this.barWidth,
      this.barHeight
    );
  }

  // Show new level on screen
  updateLevel(level) {
    this.levelText.setText(`LV ${level}`);
  }

  // Destroy all exp bar elements
  destroy() {
    this.backgroundBar.destroy();
    this.experienceBar.destroy();
    this.levelText.destroy();
  }
}
